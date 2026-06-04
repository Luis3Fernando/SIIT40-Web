import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
})
export class Button {
  @Input() text: string = '';
  @Input() variant: 'light' | 'dark' | 'primary' | 'gh-dark' = 'light';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';

  get variantClasses(): string {
    const classes = {
      light: 'bg-white text-black border border-slate-200 hover:bg-slate-50',
      dark: 'bg-black text-white hover:bg-slate-900',
      primary: 'bg-gh-primary text-white hover:bg-gh-primary/90',
      'gh-dark': 'bg-gh-dark text-white hover:bg-gh-dark/90'
    };
    return classes[this.variant] || classes.light;
  }
}