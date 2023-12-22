// budget.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { BudgetService } from './budget.service';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate total budget correctly', () => {
    const seo = true;
    const ads = true;
    const web = true;
    const webCost = 100;

    const totalBudget = service.calculateTotalBudget(seo, ads, web, webCost);

    expect(totalBudget).toBe(1300);
  });
});
