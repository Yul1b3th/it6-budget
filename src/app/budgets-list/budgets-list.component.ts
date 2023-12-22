// budgets-list.component.ts

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeCa from '@angular/common/locales/ca';
import { Subscription } from 'rxjs';

import { PanelComponent } from '../panel/panel.component';
import { BudgetService } from '../services/budget.service';
import { Budget } from '../models/budget.model';


registerLocaleData(localeEs, 'es');
registerLocaleData(localeCa, 'ca');


@Component({
  selector: 'app-budgets-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PanelComponent],
  templateUrl: './budgets-list.component.html',
  styleUrl: './budgets-list.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'ca' }, // Configurar el idioma a catalan
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class BudgetsListComponent implements OnInit, OnDestroy {
  budgetForm: FormGroup;
  totalBudget = 0;
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  searchInputValue = '';
  webCampaignObj = {
    numberOfPagesTotal: 0,
    numberOfLanguagesTotal: 0
  };
  sortBy: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  formSubmitted = false; // se ha hecho click sobre el boton de enviar
  showError = false;
  isCheckboxSelected = false;
  checkboxState = false;
  seoCampaignState = false;
  adsCampaignState = false;
  webCampaignState = false;
  isCheckboxFocused = false;

  private formValueChangesSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private cdr: ChangeDetectorRef) {
    this.budgetForm = this.fb.group({
      seoCampaign: false,
      adsCampaign: false,
      webCampaign: false,
      webCampaignObj: { numberOfPagesTotal: 0, numberOfLanguagesTotal: 0 },
      webCost: 0,
      clientName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      searchInput: [''],
    });
  }

  ngOnInit(): void {
    this.formValueChangesSubscription = this.budgetForm.valueChanges.subscribe(() => {
      this.calculateTotalBudget();
    });
    this.budgets = this.budgetService.getBudgetsSync();
    this.filteredBudgets = [...this.budgets];
    this.formSubmitted = false;
  }

  calculateTotalBudget() {
    const { seoCampaign, adsCampaign, webCampaign, webCost } = this.budgetForm.value;
    this.totalBudget = this.budgetService.calculateTotalBudget(seoCampaign, adsCampaign, webCampaign, webCost);
  }

  isChecked(formControlName: string): boolean {
    this.seoCampaignState = this.budgetForm.controls['seoCampaign'].value;
    this.adsCampaignState = this.budgetForm.controls['adsCampaign'].value;
    this.webCampaignState = this.budgetForm.controls['webCampaign'].value;

    this.isCheckboxSelected = this.seoCampaignState || this.adsCampaignState || this.webCampaignState;
    this.cdr.markForCheck();

    if (this.formSubmitted) {
      if (!this.seoCampaignState && !this.adsCampaignState && !this.webCampaignState) {
        this.showError = true;
      }
    }

    if (this.budgetForm.get(formControlName)?.value) {
      this.showError = false;
    }
    this.cdr.markForCheck();
    return this.budgetForm.get(formControlName)?.value ?? false;

  }

  isFormValid(): boolean {
    return this.isCheckboxSelected && this.budgetForm.valid;
  }


  submitBudget() {
    this.formSubmitted = true;

    if (!this.isFormValid()) {
      this.showError = true;
      return;
    }

    const { seoCampaign, adsCampaign, webCampaign, webCost, clientName, phone, email } = this.budgetForm.value;

    const budget: Budget = {
      seoCampaign,
      adsCampaign,
      webCampaign,
      webCampaignObj: { ...this.webCampaignObj },
      webCost,
      clientName,
      phone,
      email,
      totalBudget: this.totalBudget,
      date: new Date(),
    };

    // Actualiza webCampaignObj antes de agregar el presupuesto
    this.webCampaignObj = { ...this.webCampaignObj, ...this.budgetForm.value.webCampaignObj };

    // Agrega el presupuesto
    this.budgetService.addBudget(budget);

    // Actualiza la lista de presupuestos directamente
    this.budgets = this.budgetService.getBudgetsSync();
    this.filteredBudgets = [...this.budgets];

    // Restablece el formulario y otras variables
    this.budgetForm.reset();
    this.formSubmitted = false;
    this.webCampaignObj = { numberOfPagesTotal: 0, numberOfLanguagesTotal: 0 };

    this.cdr.markForCheck();
  }


  onInputChange(fieldName: string) {
    const control = this.budgetForm.controls[fieldName];
    if (control) {
      control.markAsTouched();
      this.cdr.markForCheck();
    }
    this.cdr.markForCheck();
  }

  isValidField(field: string): boolean {
    const control = this.budgetForm.controls[field];
    return control.valid && control.touched;
  }

  ngOnDestroy(): void {
    if (this.formValueChangesSubscription && !this.formValueChangesSubscription.closed) {
      this.formValueChangesSubscription.unsubscribe();
    }
  }

  handleFormPanel(formValues: { numberOfPages: number, numberOfLanguages: number }) {
    this.webCampaignObj.numberOfPagesTotal = formValues.numberOfPages;
    this.webCampaignObj.numberOfLanguagesTotal = formValues.numberOfLanguages;
  }

  searchBudgets() {
    const searchValue = this.budgetForm.get('searchInput')?.value || '';
    this.filteredBudgets = this.budgets.filter(budget =>
      budget.clientName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  onSearchInputFocus() {
    this.searchInputValue = 'focused';
  }

  onSearchInputBlur() {
    const searchInputControl = this.budgetForm.get('searchInput');

    if (searchInputControl) {
      const searchInputValue = searchInputControl.value;
      if (searchInputValue == null || searchInputValue == '') {
        this.searchInputValue = '';
      }
    }
  }

  sortBudgetsDate() {
    this.sortBy = 'date';
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredBudgets = this.budgetService.sortBudgetsDate(this.filteredBudgets, this.sortDirection);
  }

  sortBudgetsTotal() {
    this.sortBy = 'totalBudget';
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredBudgets = this.budgetService.sortBudgetsTotal(this.filteredBudgets, this.sortDirection);
  }

  sortBudgetsName() {
    this.sortBy = 'clientName';
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredBudgets = this.budgetService.sortBudgetsName(this.filteredBudgets, this.sortDirection);
  }

  onCheckboxChange(event: any) {
    this.seoCampaignState = this.budgetForm.controls['seoCampaign'].value;
    this.adsCampaignState = this.budgetForm.controls['adsCampaign'].value;
    this.webCampaignState = this.budgetForm.controls['webCampaign'].value;

    this.isCheckboxSelected = this.seoCampaignState || this.adsCampaignState || this.webCampaignState;

    if (this.isCheckboxSelected) {
      document.querySelector('#idSeoCampaign')?.classList.remove('is-invalid');
      document.querySelector('#idAdsCampaign')?.classList.remove('is-invalid');
      document.querySelector('#idWebCampaign')?.classList.remove('is-invalid');
    } else {
      document.querySelector('#idSeoCampaign')?.classList.add('is-invalid');
      document.querySelector('#idAdsCampaign')?.classList.add('is-invalid');
      document.querySelector('#idWebCampaign')?.classList.add('is-invalid');
    }

    event.target.blur(); // Desenfocar el checkbox después de cambiar su estado
  }

  onCheckboxFocus() {
    this.isCheckboxFocused = true;
    console.log('Checkbox tiene el foco');
  }

  onCheckboxBlur() {
    this.isCheckboxFocused = false;
    console.log('Checkbox perdio el foco');
  }

}
