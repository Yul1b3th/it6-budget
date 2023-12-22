// modal.component.ts

import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal.service';

declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent {

  @Input() content: string = '';
  contentType = '';

  @ViewChild('exampleModal', { static: false }) exampleModal?: ElementRef;

  constructor(private modalService: ModalService) { }

  private isOpen = false;

  closeModal() {
    if (this.isOpen) {
      this.isOpen = false;
      this.hideModalBackdrop();
    }
  }

  openModal(contentType: string) {
    if (!this.isOpen) {
      this.isOpen = true;
      this.contentType = contentType;
      this.showModalBackdrop();
    }
  }

  private showModalBackdrop() {
    if (this.exampleModal) {
      this.exampleModal.nativeElement.style.display = 'block';
      this.exampleModal.nativeElement.classList.add('show');
      document.body.classList.add('modal-open');

      let backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.display = 'block';
      document.body.appendChild(backdrop);
    }
  }

  private hideModalBackdrop() {
    if (this.exampleModal) {
      this.exampleModal.nativeElement.style.display = 'none';
      document.body.classList.remove('modal-open');

      let backdrop = document.querySelector('.modal-backdrop');
      backdrop?.classList.remove('show');
      backdrop?.remove();
    }
  }
}
