import {AsyncPipe, DatePipe, NgTemplateOutlet} from '@angular/common'
import {Component, computed, effect, inject, model, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {DatePicker} from 'primeng/datepicker'
import {Dialog} from 'primeng/dialog'
import {TableModule} from 'primeng/table'
import {map} from 'rxjs'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {LbuOktaService} from '../../../../../config/lbu-okta.service'
import {AvatarComponent} from '../../../../reusable/components/avatar/avatar.component'
import {DeleteDialogComponent} from '../../../../reusable/components/delete-dialog/delete-dialog.component'
import {MoneyComponent} from '../../../../reusable/components/money.component'
import {NetStandingPipe} from '../../../../reusable/pipes/net-standing.pipe'
import {NullSafePipe} from '../../../../reusable/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../../reusable/pipes/nullish-to-zero.pipe'
import {TransactionTypePipe} from '../../../../reusable/pipes/transaction-type.pipe'
import {ScreenSizeService} from '../../../../reusable/services/screen-size.service'
import {DebtTrackerQuickAddForm} from '../../add-entry/debt-tracker-quick-add.form.enum'
import {FormMode} from '../../form-mode.enum'
import {ContactFormDialogComponent} from '../contact-form/contact-form.component'
import {ToggleSwitch} from 'primeng/toggleswitch'
import {ContactTransactionsService} from '../../../../../api/contact-transactions/contact-transactions.service'
import {AddTransactionComponent} from '../../transactions/transaction-form/transaction-form.component'
import {TransactionService} from '../../../../../api/transactions/transaction.service'

@Component({
  selector: 'dbt-person-detail',
  templateUrl: './contact-detail.component.html',
  standalone: true,
  imports: [
    Card,
    PrimeTemplate,
    TableModule,
    DatePipe,
    FormsModule,
    AsyncPipe,
    Button,
    ReactiveFormsModule,
    NetStandingPipe,
    Dialog,
    ContactFormDialogComponent,
    DeleteDialogComponent,
    NullishToZeroPipe,
    DatePicker,
    TransactionTypePipe,
    NullSafePipe,
    RouterLink,
    NgTemplateOutlet,
    MoneyComponent,
    AvatarComponent,
    ToggleSwitch,
    AddTransactionComponent
  ]
})
export class ContactDetailComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  private readonly contactTransactionService = inject(ContactTransactionsService)
  readonly lbuOktaService = inject(LbuOktaService)
  readonly screenSizeService = inject(ScreenSizeService)

  private readonly now = new Date()
  private readonly year = this.now.getFullYear()
  private readonly month = this.now.getMonth()
  protected readonly FormMode = FormMode
  readonly today = new Date(this.year, this.month, this.now.getDate())
  readonly startDate = model(new Date(this.year, this.month, 1))
  readonly endDate = model(this.today)
  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm

  readonly editContact = model(false)
  readonly deleteContact = model(false)
  readonly editTransaction = model(false)
  readonly deleteTransaction = model(false)
  readonly filterByDate = model(false)
  readonly selectedTransactionId = signal<string>('')

  readonly $transactions = computed(() => {
    if(this.filterByDate()){
      return this.transactionService.getForDateRangeAndUser(this.startDate(), this.endDate(), this.$personId())()
    }
    else {
      return this.contactTransactionService.selectAll()
        .filter(t => t.userId === this.$personId())
    }
  })

  readonly $transactionsLoading = computed(() =>
    this.contactTransactionService.selectLoading()
  )

  readonly $personId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' }
  )

  constructor() {
    let id = ''
    effect(() => {
      const personId = this.$personId()
      if (personId && id !== personId) {
        id = personId
        this.fetchTransactions()
      }
    })
  }

  readonly $person = computed(() =>
    this.contactService.selectAll().find(p => p.id === this.$personId())
  )

  fetchTransactions() {
    const personId = this.$personId()
    if (personId) {
      if(this.filterByDate()){
        this.transactionService.refetch({
          startDate: this.startDate().toLocaleDateString('en-CA'),
          endDate: this.endDate().toLocaleDateString('en-CA')
        })
      }
      else {
        this.contactTransactionService.refetch({userId: personId})
      }
    }
  }

  onContactEdit() {
    this.editContact.set(true)
  }

  onContactDelete() {
    this.deleteContact.set(true)
  }

  onTransactionEdit(id: string): void {
    this.selectedTransactionId.set(id)
    this.editTransaction.set(true)
  }

  onTransactionDelete(id: string): void {
    this.selectedTransactionId.set(id)
    this.deleteTransaction.set(true)
  }

  readonly $transaction = computed(() => {
    if(this.selectedTransactionId().length > 0) {
      return this.$transactions().find(t => t.id === this.selectedTransactionId())
    }
    return undefined
  })
}
