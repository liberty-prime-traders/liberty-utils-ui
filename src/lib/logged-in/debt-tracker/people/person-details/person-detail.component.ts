import {Component, computed, effect, inject, OnInit, signal, Signal} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {Select} from 'primeng/select'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common'
import {Card} from 'primeng/card'
import {PrimeTemplate} from 'primeng/api'
import {TableModule} from 'primeng/table'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {LbuOktaService} from '../../../../../config/lbu-okta.service'
import {Button} from 'primeng/button'
import {PersonEditComponent} from '../person-edit/person-edit.component'
import {PersonDeleteComponent} from '../person-delete/person-delete.component'
import {TransactionSignPipe} from '../../../../pipes/transaction-sign.pipe'
import {BalanceMessagePipe} from '../../../../pipes/balance-message.pipe'
import {InitialsPipe} from '../../../../pipes/initials.pipe'
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

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
    PersonEditComponent,
    PersonDeleteComponent,
    Select,
    TransactionSignPipe,
    BalanceMessagePipe,
    InitialsPipe,
  ]
})
export class PersonDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  readonly dspOktaService = inject(LbuOktaService)
  readonly editContact = signal<boolean>(false)
  readonly deleteContact = signal<boolean>(false)
  readonly selectedSortOrder = signal<string>('date_desc')
  readonly personId = signal<string>('')
  private transactions!: Signal<Transaction[]>

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

  ngOnInit(): void {
    this.transactions = computed(() =>
      this.transactionService.selectAll().filter(
        t => t.userId === this.personId()
      )
    );
  }

  readonly person = computed(() => {
      const p = this.contactService.selectAll().find(p => p.id === this.personId())
      if (!p) return undefined
      return {
        ...p,
        balance: 0,
      }
    }
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
