// budget.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root',
})

export class BudgetService {
  private budgetsSubject = new BehaviorSubject<Array<Budget>>([]);
  private budgetsObservable = this.budgetsSubject.asObservable();

  constructor() { }

  getBudgets$(): Observable<Array<Budget>> {
    return this.budgetsObservable;
  }

  getBudgetsSync(): Budget[] {
    return this.budgetsSubject.getValue();
  }


  addBudget(budget: Budget) {
    const currentBudgets = this.budgetsSubject.getValue();
    const budgetWithDate = { ...budget, date: new Date() };
    this.budgetsSubject.next([...currentBudgets, budgetWithDate]);
  }

  calculateTotalBudget(seo: boolean, ads: boolean, web: boolean, webCost: number): number {
    let total = 0;

    if (seo) {
      total += 300;
    }

    if (ads) {
      total += 400;
    }

    if (web) {
      total += 500;
    }

    return total + webCost;
  }


  sortBudgets(budgets: Budget[], sortBy: string, sortDirection: 'asc' | 'desc'): Budget[] {
    return budgets.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.date.getTime();
        const dateB = b.date.getTime();

        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'totalBudget') {
        return sortDirection === 'asc' ? a.totalBudget - b.totalBudget : b.totalBudget - a.totalBudget;
      } else {
        const nameA = a.clientName.toLowerCase();
        const nameB = b.clientName.toLowerCase();

        return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
    });
  }

  sortBudgetsDate(budgets: Budget[], sortDirection: 'asc' | 'desc'): Budget[] {
    return this.sortBudgets(budgets, 'date', sortDirection);
  }

  sortBudgetsTotal(budgets: Budget[], sortDirection: 'asc' | 'desc'): Budget[] {
    return this.sortBudgets(budgets, 'totalBudget', sortDirection);
  }

  sortBudgetsName(budgets: Budget[], sortDirection: 'asc' | 'desc'): Budget[] {
    return this.sortBudgets(budgets, 'clientName', sortDirection);
  }




}

