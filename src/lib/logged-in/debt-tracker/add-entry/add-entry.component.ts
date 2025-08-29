import {Component, inject, input, model, signal} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {Menubar} from 'primeng/menubar'
import {Contact} from '../../../../api/contacts/contact.model'
import {ScreenSizeService} from '../../../reusable/services/screen-size.service'
import {ContactFormDialogComponent} from '../contacts/contact-form/contact-form.component'
import {DebtTrackerQuickAddForm} from './debt-tracker-quick-add.form.enum'
import {AddTransactionComponent} from '../transactions/transaction-form/transaction-form.component'
import {Transaction} from '../../../../api/transactions/transaction.model'

@Component({
  selector: 'dbt-add-entry',
  standalone: true,
  styleUrl: 'add-entry.component.scss',
  imports: [
    Dialog,
    Menubar,
    ReactiveFormsModule,
    Button,
    ContactFormDialogComponent,
    AddTransactionComponent
  ],
  templateUrl: 'add-entry.component.html'
})
export class AddEntryComponent{
  readonly screenSizeService = inject(ScreenSizeService)

  readonly visible = model(false)
  readonly activeForm = signal(DebtTrackerQuickAddForm.CONTACT)
  readonly contact = input<Contact>()
  readonly transaction = input<Transaction>()

  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm

  protected readonly items: MenuItem[] = [
    {label: 'Person', icon: 'pi pi-user', command: () =>  this.activeForm.set(DebtTrackerQuickAddForm.CONTACT) },
    {label: 'Transaction', icon: 'pi pi-dollar', command: () =>  this.activeForm.set(DebtTrackerQuickAddForm.TRANSACTION) }
  ]

  showDialog() {
    this.visible.set(true)
  }

}
