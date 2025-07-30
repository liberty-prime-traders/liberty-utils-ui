import {Component, computed, inject, Input, input, Signal, WritableSignal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {ContactService} from '../../../api/contacts/contact.service';
import {FormTypeEnum} from '../../logged-in/debt-tracker/add-entry/form-type.enum';
import {TransactionService} from '../../../api/transactions/transaction.service';

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.component.html',
  standalone: true,
  imports: [
    Dialog,
    ReactiveFormsModule,
    Button,
    PrimeTemplate,
  ]
})
export class DeleteDialogComponent {
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  readonly id = input<string>()
  readonly type = input<FormTypeEnum.CONTACT | FormTypeEnum.TRANSACTION>(FormTypeEnum.CONTACT)
  @Input() visible!: WritableSignal<boolean>

  readonly value: Signal<string | number> = computed(() => {
    if(this.type() === FormTypeEnum.CONTACT) {
      return this.contactService.selectAll().find(p => p.id === this.id())?.fullName ?? ''
    }
    else {
      return this.transactionService.selectAll().find(p => p.id === this.id())?.amount ?? ''
    }
  })



  deleteContact() {
    this.contactService.delete(this.id())
    this.onCancel()
  }

  onCancel() {
    this.visible.set(false)
  }
}
