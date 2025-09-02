import {AsyncPipe, CurrencyPipe, DatePipe, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, model} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ActivatedRoute, RouterLink} from '@angular/router'
import {PrimeTemplate} from 'primeng/api'
import {Avatar} from 'primeng/avatar'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {DatePicker} from 'primeng/datepicker'
import {Dialog} from 'primeng/dialog'
import {TableModule} from 'primeng/table'
import {map} from 'rxjs'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../../api/transactions/transaction.service'
import {LbuOktaService} from '../../../../../config/lbu-okta.service'
import {DeleteDialogComponent} from '../../../../reusable/components/delete-dialog/delete-dialog.component'
import {BalanceMessagePipe} from '../../../../reusable/pipes/balance-message.pipe'
import {InitialsPipe} from '../../../../reusable/pipes/initials.pipe'
import {NullSafePipe} from '../../../../reusable/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../../reusable/pipes/nullish-to-zero.pipe'
import {TransactionSignPipe} from '../../../../reusable/pipes/transaction-sign.pipe'
import {TransactionTypePipe} from '../../../../reusable/pipes/transaction-type.pipe'
import {ScreenSizeService} from '../../../../reusable/services/screen-size.service'
import {DebtTrackerQuickAddForm} from '../../add-entry/debt-tracker-quick-add.form.enum'
import {ContactFormDialogComponent} from '../contact-form/contact-form.component'
import {FormMode} from '../../form-mode.enum';

@Component({
  selector: 'dbt-person-detail',
  templateUrl: './contact-detail.component.html',
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
    DatePicker,
    TransactionTypePipe,
    NullSafePipe,
    RouterLink,
    NgTemplateOutlet
  ]
})
export class ContactDetailComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
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

  readonly $transactions = computed(() =>
    this.transactionService.selectAll().filter(
      t => t.userId === this.$personId()
    )
  )

  readonly $transactionsLoading = computed(() => this.transactionService.selectLoading())

  protected readonly DebtTrackerQuickAddForm = DebtTrackerQuickAddForm

  readonly $personId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? '')),
    { initialValue: '' }
  )

  constructor() {
    this.fetchTransactions()
  }

  readonly $person = computed(() =>
    this.contactService.selectAll().find(p => p.id === this.$personId())
  )

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
