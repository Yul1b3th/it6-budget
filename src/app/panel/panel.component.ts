// panel.component.ts

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})

export class PanelComponent implements OnInit {
  // 1. Se define la propiedad y define con una instancia de la clase EventEmitter
  @Output() sendForm = new EventEmitter<{ numberOfPages: number, numberOfLanguages: number }>();

  @Input() budgetForm!: FormGroup;

  panelForm!: FormGroup;
  modalContent: string = '';
  numeroPagina = 0;

  @ViewChild(ModalComponent, { static: false }) modalComponent?: ModalComponent;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.panelForm = this.fb.group({
      numberOfPages: ['', Validators.min(0)],
      numberOfLanguages: ['', Validators.min(0)],
    });

    // Escuchar cambios en el formulario del panel
    this.panelForm.valueChanges.subscribe(() => {
      this.calculateWebCost();
    });

  }

  // Función para calcular el costo total del sitio web
  calculateWebCost() {
    const pagesCost = this.panelForm.get('numberOfPages')?.value * 30;
    const languagesCost = this.panelForm.get('numberOfLanguages')?.value * 30;

    // Actualizar el costo del sitio web en el formulario principal
    this.budgetForm.patchValue({
      webCost: pagesCost + languagesCost,
    });
  }

  incrementPages() {
    const currentPages = this.panelForm.get('numberOfPages')?.value;
    if (currentPages < 99) {
      this.panelForm.get('numberOfPages')?.setValue((currentPages * 1) + 1);
      this.emitSendForm();
    }
  }

  decrementPages() {
    const currentPages = this.panelForm.get('numberOfPages')?.value;
    if (currentPages > 0) {
      this.panelForm.get('numberOfPages')?.setValue(currentPages - 1);
      this.emitSendForm();
    }
  }

  incrementLanguages() {
    const currentLanguages = this.panelForm.get('numberOfLanguages')?.value;
    if (currentLanguages < 99) {
      this.panelForm.get('numberOfLanguages')?.setValue((currentLanguages * 1) + 1);
      this.emitSendForm();
    }
  }

  decrementLanguages() {
    const currentLanguages = this.panelForm.get('numberOfLanguages')?.value;
    if (currentLanguages > 0) {
      this.panelForm.get('numberOfLanguages')?.setValue(currentLanguages - 1);
      this.emitSendForm();
    }
  }

  emitSendForm() {
    const { numberOfPages, numberOfLanguages } = this.panelForm.value;
    this.sendForm.emit({ numberOfPages, numberOfLanguages });
  }


  openModal(contentType: Event | string) {
    if (typeof contentType === 'string') {
      if (this.modalComponent) {
        this.modalComponent.openModal(contentType);
      }
    }
  }

  validatorInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]+/g, '').substring(0, 3);

    // Actualizar el valor en el formulario después de la validación
    this.panelForm.get(input.id)?.setValue(input.value);

    // Emitir el formulario actualizado
    this.emitSendForm();
  }



}





