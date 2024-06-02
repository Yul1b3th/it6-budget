import { Component } from '@angular/core';

import { BudgetsListComponent } from '../budgets-list/budgets-list.component';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BudgetsListComponent, WelcomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
