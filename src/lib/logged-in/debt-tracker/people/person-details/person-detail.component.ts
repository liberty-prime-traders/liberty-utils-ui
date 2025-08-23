import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, effect, inject, model, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ActivatedRoute} from '@angular/router'
import {PrimeTemplate} from 'primeng/api'
import {Avatar} from 'primeng/avatar'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Dialog} from 'primeng/dialog'
import {TableModule} from 'primeng/table'
import {map} from 'rxjs'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {LbuOktaService} from '../../../../../config/lbu-okta.service'
import {DeleteDialogComponent} from '../../../../reusable/components/delete-dialog/delete-dialog.component'
import {BalanceMessagePipe} from '../../../../reusable/pipes/balance-message.pipe'
import {InitialsPipe} from '../../../../reusable/pipes/initials.pipe'
import {NullishToZeroPipe} from '../../../../reusable/pipes/nullish-to-zero.pipe'
import {TransactionSignPipe} from '../../../../reusable/pipes/transaction-sign.pipe'
import {DebtTrackerQuickAddForm} from '../../add-entry/debt-tracker-quick-add.form.enum'
import {ContactFormDialogComponent} from '../contact-form/contact-form.component'
import {BalanceService} from '../../../../reusable/services/balance.service'
import {DatePicker} from 'primeng/datepicker'

@Component({
  selector: 'dbt-person-detail',
  templateUrl: './person-detail.component.html',
  standalone: true,
  imports: [
    Card,
    PrimeTemplate,
    TableModule,
    DatePipe,
    CurrencyPipe,
    FormsModule,
    AsyncPipe,
    Button,
    ReactiveFormsModule,
    TransactionSignPipe,
    BalanceMessagePipe,
    InitialsPipe,
    Dialog,
    ContactFormDialogComponent,
    DeleteDialogComponent,
    Avatar,
    NullishToZeroPipe,
    DatePicker
  ]
})
export class PersonDetailComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  private readonly balanceService = inject(BalanceService)
  readonly lbuOktaService = inject(LbuOktaService)

  private readonly now = new Date()
  private readonly year = this.now.getFullYear()
  private readonly month = this.now.getMonth()

  readonly today = new Date(this.year, this.month, this.now.getDate())
  startDate = new Date(this.year, this.month, 1)
  endDate = this.today

  readonly editContact = model(false)
  readonly deleteContact = model(false)
  readonly personId = signal<string>('')
  readonly transactions = computed(() =>
    this.transactionService.selectAll().filter(
      t => t.userId === this.personId()
    )
  )

  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm

  readonly routeId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' }
  )

  constructor() {
    effect(() => {
      this.personId.set(this.routeId())
    })
  }

  readonly person = computed(() => {
    const contact = this.contactService.selectAll().find(
      p => p.id === this.personId()
    )

    if (!contact) {
      return undefined
    }

    return {
      ...contact,
      balance: this.balanceService.getBalance(contact.id?.toString() ?? '')
    }
  })

  fetchTransactions() {
    this.transactionService.refetch({
      startDate: this.startDate.toLocaleDateString('en-CA'),
      endDate: this.endDate.toLocaleDateString('en-CA')
    })
  }
  onEdit() {
    this.editContact.set(true)
  }

  onDelete() {
    this.deleteContact.set(true)
  }
}
