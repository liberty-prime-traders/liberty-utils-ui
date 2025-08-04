import {Component, inject, input, model} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {ContactService} from '../../../../api/contacts/contact.service'
import {DebtTrackerQuickAddForm} from '../../../logged-in/debt-tracker/add-entry/debt-tracker-quick-add.form.enum'

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

  readonly labelOfValueBeingDeleted = input<string>()
  readonly idOfValueBeingDeleted = input<string>()
  readonly formType = input(DebtTrackerQuickAddForm.CONTACT)
  readonly visible = model<boolean>(false)

  deleteContact() {
    this.contactService.delete(this.idOfValueBeingDeleted())
    this.onCancel()
  }

  onCancel() {
    this.visible.set(false)
  }
}
