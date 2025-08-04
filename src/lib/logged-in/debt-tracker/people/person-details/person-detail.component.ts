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
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {map} from 'rxjs'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {LbuOktaService} from '../../../../../config/lbu-okta.service'
import {DeleteDialogComponent} from '../../../../reusable/components/delete-dialog/delete-dialog.component'
import {BalanceMessagePipe} from '../../../../reusable/pipes/balance-message.pipe'
import {InitialsPipe} from '../../../../reusable/pipes/initials.pipe'
import {NullishToZeroPipe} from '../../../../reusable/pipes/nullish-to-zero.pipe'
import {TransactionSignPipe} from '../../../../reusable/pipes/transaction-sign.pipe'
import {DebtTrackerQuickAddForm} from '../../add-entry/debt-tracker-quick-add.form.enum'
import {ContactFormDialogComponent} from '../contact-form/contact-form.component'

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
    Select,
    TransactionSignPipe,
    BalanceMessagePipe,
    InitialsPipe,
    Dialog,
    ContactFormDialogComponent,
    DeleteDialogComponent,
    Avatar,
    NullishToZeroPipe
  ]
})
export class PersonDetailComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  readonly lbuOktaService = inject(LbuOktaService)

  readonly editContact = model(false)
  readonly deleteContact = model(false)
  readonly selectedSortOrder = signal<string>('date_desc')
  readonly personId = signal<string>('')
  private readonly transactions = computed(() =>
    this.transactionService.selectAll().filter(
      t => t.userId === this.personId()
    )
  )

  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm;

  readonly sortOptions = [
    {label: 'Newest First', value: 'date_desc'},
    {label: 'Oldest First', value: 'date_asc'},
    {label: 'Amount High to Low', value: 'amount_desc'},
    {label: 'Amount Low to High', value: 'amount_asc'}
  ]

  readonly routeId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' }
  );

  constructor() {
    effect(() => {
      this.personId.set(this.routeId());
    });
  }

  readonly person = computed(() =>
    this.contactService.selectAll().find(p => p.id === this.personId())
  )

  readonly sortedTransactions = computed(() => {
    const sort = this.selectedSortOrder()

    const getTime = (t: Transaction) => {
      if (Array.isArray(t.transactionDate)) {
        const [year, month, day] = t.transactionDate
        return new Date(year, month - 1, day).getTime()
      }
      return new Date(t.transactionDate ?? 0).getTime()
    }

    return [...this.transactions()].sort((a, b) => {
      switch (sort) {
        case 'date_asc':
          return getTime(a) - getTime(b)
        case 'date_desc':
          return getTime(b) - getTime(a)
        case 'amount_asc':
          return (a.amount ?? 0) - (b.amount ?? 0)
        case 'amount_desc':
          return (b.amount ?? 0) - (a.amount ?? 0)
        default:
          return 0
      }
    })
  })


  onEdit() {
    this.editContact.set(true)
  }

  onDelete() {
    this.deleteContact.set(true)
  }
}
