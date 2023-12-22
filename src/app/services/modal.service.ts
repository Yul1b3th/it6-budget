// modal.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openModalSource = new Subject<string>();

  openModal$ = this.openModalSource.asObservable();

  openModal(contentType: string) {
    console.log('openModal(contentType: string) ');
    this.openModalSource.next(contentType);
  }
}
