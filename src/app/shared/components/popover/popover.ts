import { Component, ElementRef, HostListener, ViewChild, inject, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.html',
})
export class Popover {
  isOpen = false;
  popoverTop = 0;
  popoverLeft = 0;

  @ViewChild('triggerWrapper') triggerWrapper!: ElementRef;
  @ViewChild('popoverContent') popoverContent!: ElementRef;

  private cdr = inject(ChangeDetectorRef);

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.cdr.detectChanges();
      setTimeout(() => {
        this.calculatePosition();
        this.cdr.detectChanges();
      });
    }
  }

  private calculatePosition() {
    if (!this.triggerWrapper || !this.popoverContent) return;
    const triggerRect = this.triggerWrapper.nativeElement.getBoundingClientRect();
    const popoverEl = this.popoverContent.nativeElement;
    const popoverHeight = popoverEl.offsetHeight;
    const popoverWidth = popoverEl.offsetWidth;
    if (triggerRect.bottom + popoverHeight + 8 > window.innerHeight) {
      this.popoverTop = triggerRect.top - popoverHeight - 8;
    } else {
      this.popoverTop = triggerRect.bottom + 8;
    }
    if (triggerRect.left + popoverWidth > window.innerWidth) {
      this.popoverLeft = triggerRect.right - popoverWidth;
    } else {
      this.popoverLeft = triggerRect.left;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isOpen) return;
    const target = event.target as HTMLElement;
    if (!this.triggerWrapper.nativeElement.contains(target) && 
        (!this.popoverContent || !this.popoverContent.nativeElement.contains(target))) {
      this.isOpen = false;
      this.cdr.detectChanges();
    }
  }
}