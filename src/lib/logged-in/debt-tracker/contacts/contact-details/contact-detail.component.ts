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
import {ContactTransactionService} from '../../../../../api/contact-transactions/contact-transaction.service'
import {AddTransactionComponent} from '../../transactions/transaction-form/transaction-form.component';

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
  private readonly contactTransactionService = inject(ContactTransactionService)
  readonly lbuOktaService = inject(LbuOktaService)
  readonly screenSizeService = inject(ScreenSizeService)

  private readonly now = new Date()
  private readonly year = this.now.getFullYear()
  private readonly month = this.now.getMonth()
  protected readonly FormMode = FormMode

  readonly today = new Date(this.year, this.month, this.now.getDate())
  startDate = new Date(this.year, this.month, 1)
  endDate = this.today

  readonly editContact = model(false)
  readonly deleteContact = model(false)
  readonly editTransaction = model(false)
  readonly deleteTransaction = model(false)
  readonly filterByDate = model(false)
  readonly selectedTransactionId = signal<string>('')

  readonly $transactions = computed(() => {
    const all = this.contactTransactionService
      .selectAll()
      .filter(t => t.userId === this.$personId())

    if (this.filterByDate()) {
      return all.filter(t => {
        const date = new Date(t.transactionDate!)
        return date >= this.startDate && date <= this.endDate
      })
    }

    return all
  })

  readonly $transactionsLoading = computed(() =>
    this.contactTransactionService.selectLoading()
  )

  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm

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
        this.contactTransactionService.refetch({ userId: personId })
      }
    })
  }

  readonly $person = computed(() =>
    this.contactService.selectAll().find(p => p.id === this.$personId())
  )

  fetchTransactions() {
    const personId = this.$personId()
    if (personId) {
      this.contactTransactionService.refetch({ userId: personId })
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
