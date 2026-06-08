import { Component, Input, forwardRef, inject, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [FormsModule, NgClass],
  templateUrl: './select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelect),
      multi: true
    }
  ]
})
export class CustomSelect implements ControlValueAccessor {
  @Input() label = '';
  @Input() name = '';
  @Input() options: { value: string; label: string }[] = [];
  value: string = '';
  isOpen = false;
  onChange: any = () => {};
  onTouch: any = () => {};
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  get selectedLabel(): string {
    const match = this.options.find(opt => opt.value === this.value);
    return match ? match.label : 'Seleccionar...';
  }
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
  toggle() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.onTouch();
  }
  selectOption(val: string) {
    this.value = val;
    this.isOpen = false;
    this.onChange(val);
    this.onTouch();
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.cdr.markForCheck();
    }
  }
}