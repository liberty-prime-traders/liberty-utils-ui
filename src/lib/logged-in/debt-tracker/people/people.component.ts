import {Component, computed, inject, OnInit, signal, Signal} from '@angular/core'
import {Contact} from '../../../../api/contacts/contact.model'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {Transaction} from '../../../../api/transactions/transaction.model'
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'


@Component({
  selector: 'dt-people',
  templateUrl: './people.component.html',
  imports: [
    Card,
    InputText,
    RouterOutlet,
    ReactiveFormsModule,
    NgForOf,
    CurrencyPipe,
    IconField,
    InputIcon,
    NgIf
  ],
  standalone: true
})
export class PeopleComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  contacts!: Signal<Contact[]>
  transactions!: Signal<Transaction[]>

  ngOnInit(): void {
    this.contacts = this.contactService.selectAll
    this.transactions = this.transactionService.selectAll
    this.transactionService.fetch()
    this.contactService.fetch()
  }

  getNetBalanceForContact = (contactId: string | number): number => {
    return this.transactions()
      .filter(t => t.userID === String(contactId))
      .reduce((sum, t) => {
        const amount = t.amount ?? 0
        if (t.transactionType === 'CREDIT') return sum + amount
        if (t.transactionType === 'DEBIT') return sum - amount
        return sum
      }, 0)
  }

  searchTerm = signal('')
  filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    return this.contacts().filter(contact => {
      const name = contact.fullName?.toLowerCase() ?? ''
      const type = contact.contactType?.toLowerCase() ?? ''
      return name.includes(term) || type.includes(term)
    })
  })

  goToPersonDetail(id: string | number) {
    this.router.navigate([id], {relativeTo: this.route})
  }
}
