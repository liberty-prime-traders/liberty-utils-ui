import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {Select} from 'primeng/select'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common'
import {Card} from 'primeng/card'
import {PrimeTemplate} from 'primeng/api'
import {TableModule} from 'primeng/table'
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum'
import {Transaction} from '../../../../../api/transactions/transaction.model'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {LbuOktaService} from '../../../../../config/lbu-okta.service'
import {Button} from 'primeng/button'
import {PersonEditComponent} from '../person-edit/person-edit.component'
import {PersonDeleteComponent} from '../person-delete/person-delete.component'

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
    Select
  ]
})
export class PersonDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute)
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  protected readonly TransactionType = TransactionType
  readonly dspOktaService = inject(LbuOktaService)
  editContact: WritableSignal<boolean> = signal(false)
  deleteContact: WritableSignal<boolean>  = signal(false)
  readonly selectedSortOrder = signal<string>('date_desc')

  readonly personId = signal<string>('')
  private transactions!: Signal<Transaction[]>

  readonly sortOptions = [
    {label: 'Newest First', value: 'date_desc'},
    {label: 'Oldest First', value: 'date_asc'},
    {label: 'Amount High to Low', value: 'amount_desc'},
    {label: 'Amount Low to High', value: 'amount_asc'}
  ]

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.personId.set(params.get('id') ?? '')
    })

    if (!this.personId) return

    this.transactions = computed(() =>
      this.transactionService.selectAll().filter(t => t.userId === this.personId())
    )
  }

  getInitials(fullName: string): string {
    if (!fullName) return ''
    const names = fullName.trim().split(' ')
    const initials = names.length === 1
      ? (names[0].length > 2) ? names[0].charAt(0) + names[0].charAt(1)
                              : names[0].charAt(0)
      : names[0].charAt(0) + names[names.length - 1].charAt(0)
    return initials.toUpperCase()
  }

  getNetBalanceForPerson(id: string | number): number {
    return this.transactionService.selectAll()
      .filter(t => t.userId === id)
      .reduce((sum, t) => {
        const amount = t.amount ?? 0
        return t.transactionType === TransactionType.CREDIT
          ? sum + amount
          : sum - amount
      }, 0)
  }

  readonly person = computed(() => {
      const p = this.contactService.selectAll().find(p => p.id === this.personId())
      if (!p) return undefined
      return {
        ...p,
        balance: this.getNetBalanceForPerson(p.id),
        initials: this.getInitials(p.fullName ?? '-')
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
