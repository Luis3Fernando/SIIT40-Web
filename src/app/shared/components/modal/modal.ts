import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-modal',
  imports: [Button],
  templateUrl: './modal.html',
})
export class Modal {
  @Input() isOpen = false;
  @Input() title = 'Confirmar acción';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() isConfirmLoading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}