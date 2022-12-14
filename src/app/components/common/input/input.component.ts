import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() inputId?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() control?: FormControl;
  @Input() inputWidth?: string;
  

  constructor() { }

  ngOnInit(): void {
  }

}
