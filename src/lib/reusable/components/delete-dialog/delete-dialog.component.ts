import {Component, inject, input, model} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {DebtTrackerQuickAddForm} from '../../../logged-in/debt-tracker/add-entry/debt-tracker-quick-add.form.enum'
import {ShowsMessagesComponent} from '../shows-messages.component'

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
export class DeleteDialogComponent extends ShowsMessagesComponent {
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)

  readonly labelOfValueBeingDeleted = input<string | number>()
  readonly idOfValueBeingDeleted = input<string>()
  readonly formType = input(DebtTrackerQuickAddForm.CONTACT)
  readonly visible = model<boolean>(false)

  delete() {
    if (this.formType() === DebtTrackerQuickAddForm.CONTACT) {
      this.contactService.delete(this.idOfValueBeingDeleted())
    } else {
      this.transactionService.delete(this.idOfValueBeingDeleted())
    }
    this.listenToProcessingStatus()
  }

  onCancel() {
    this.visible.set(false)
  }


  private listenToProcessingStatus() {
    this.transactionService.watchProcessingStatus(
      () => this.visible.set(false),
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.transactionService.selectFailureMessages().at(0)
        })
      }
    )
  }
}
