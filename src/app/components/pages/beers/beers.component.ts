import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { FilterService } from 'src/app/services/filter.service';
import { BeersService } from '../../../services/beers.service';

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit, OnDestroy {

  isTypeFilter1Visible: boolean = true;
  isTypeFilter2Visible: boolean = true;
  isTypeFilter3Visible: boolean = true;

  getBeersSubs?: Subscription;

  alcoholRangeForm: FormGroup

  constructor(
    public beersService: BeersService, 
    private route: ActivatedRoute, 
    public filterService: FilterService, 
    private router: Router,
    public fb: FormBuilder) {
      this.alcoholRangeForm = fb.group({
        from: [undefined],
        until: [undefined]
      }) 
  }

  ngOnInit(): void {
    this.getBeersSubs = this.route.queryParams.pipe(
      switchMap((params: Params) => {
        return this.beersService.getBeers(params)
      }),
      tap(beers => {
        beers.forEach(beer => {
          this.beersService.favouriteBeers$.getValue().find(favBeer => favBeer.id === beer.id ? beer.isFavourite = true : null)
        })
        this.beersService.beers$.next(beers)
      })
    ).subscribe()
  }

  onScroll() {
    if(this.beersService.beers$.getValue().length % this.beersService.per_page === 0) {
      this.beersService.page++
      this.beersService.getBeers(this.route.queryParams).subscribe(beers => {
        let oldBeers = this.beersService.beers$.getValue()
        oldBeers.push(...beers)
        this.beersService.beers$.next(oldBeers)
      })
    }
  }

  get from(): FormControl {
    return this.alcoholRangeForm.get('from') as FormControl
  }

  get until(): FormControl {
    return this.alcoholRangeForm.get('until') as FormControl
  }

  onAlcoholRangeApply(): void {
    this.router.navigate(['/beers'], {queryParams: {abv_gt: this.from.value ? this.from.value : undefined , abv_lt: this.until.value ? this.until.value : undefined}})
  }

  onFilterChange(type: string, value: string): void {
      this.router.navigate(['/beers'], {queryParams: {[type]:value}, queryParamsHandling: 'merge' })
      this.beersService.page = 1;
      let x = this.filterService.selectedFilterTags.find(tag => tag === type)
      !x ? this.filterService.selectedFilterTags.push(type) : null
  }

  resetToDefaut(): void {
    this.router.navigate(['/beers'])
    this.filterService.radios.maltsRadio = null;
    this.filterService.radios.hopsRadio = null;
    this.filterService.selectedFilterTags = [];
    this.alcoholRangeForm.get('from')?.setValue(undefined);
    this.alcoholRangeForm.get('until')?.setValue(undefined); 
  }

  ngOnDestroy() {
    this.getBeersSubs?.unsubscribe()
  }
}
