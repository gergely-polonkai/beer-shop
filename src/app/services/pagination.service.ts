import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  selectedPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1)

  constructor() { }
}
