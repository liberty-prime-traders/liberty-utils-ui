import {Component, inject, input, model} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {ContactService} from '../../../../api/contacts/contact.service'
import {DebtTrackerQuickAddForm} from '../../../logged-in/debt-tracker/add-entry/debt-tracker-quick-add.form.enum'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {ContactTransactionService} from '../../../../api/contact-transactions/contact-transaction.service'
import {ProcessingStatus} from '../../../../api/processing-status.enum';

@Component({
  selector: 'lbu-delete-dialog',
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
  private readonly contactTransactionService = inject(ContactTransactionService)

  readonly labelOfValueBeingDeleted = input<string | number>()
  readonly idOfValueBeingDeleted = input<string>()
  readonly formType = input(DebtTrackerQuickAddForm.CONTACT)
  readonly visible = model<boolean>(false)

  delete() {
    if(this.formType() === DebtTrackerQuickAddForm.CONTACT) {
      this.contactService.delete(this.idOfValueBeingDeleted())
    }else {
      this.transactionService.delete(this.idOfValueBeingDeleted())?.add(() => {
        if (this.transactionService.selectProcessingStatus() === ProcessingStatus.SUCCESS) {
          this.contactTransactionService.removeFromTransactionCache(this.idOfValueBeingDeleted()!)
        }
      })
    }
    this.onCancel()
  }

  onCancel() {
    this.visible.set(false)
  }
}
