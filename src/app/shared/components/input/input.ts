import { Component, Input, forwardRef, inject, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Popover } from '../popover/popover';

@Component({
  selector: 'app-input',
  imports: [FormsModule, NgClass, Popover],
  templateUrl: './input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true
    }
  ]
})
export class CustomInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'number' | 'color' = 'text';
  @Input() placeholder = '';
  @Input() infoText = '';
  @Input() errorText = '';
  @Input() required = false;
  @Input() name = '';
  value: any = '';
  onChange: any = () => {};
  onTouch: any = () => {};
  private cdr = inject(ChangeDetectorRef);
  writeValue(val: any): void {
    this.value = val || '';
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  onInputChange(event: any) {
    let val = event.target.value;
    if (this.type === 'number') {
      val = val.replace(/[^0-9.]/g, '');
      const parts = val.split('.');
      if (parts.length > 2) {
        val = parts[0] + '.' + parts.slice(1).join('');
      }
      event.target.value = val;
    }
    this.value = val;
    this.onChange(val);
  }
}