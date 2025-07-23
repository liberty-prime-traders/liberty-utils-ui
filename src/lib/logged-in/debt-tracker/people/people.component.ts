import {Component, computed, inject, OnInit, signal} from '@angular/core'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {CurrencyPipe} from '@angular/common'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'


@Component({
  selector: 'dbt-people',
  templateUrl: './people.component.html',
  imports: [
    Card,
    InputText,
    RouterOutlet,
    ReactiveFormsModule,
    CurrencyPipe,
    IconField,
    InputIcon
  ],
  standalone: true
})
export class PeopleComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  transactions = this.transactionService.selectAll

  ngOnInit(): void {
    this.contactService.fetch()
    this.transactionService.fetch()
  }

  getNetBalanceForContact = (contactId: string | number): number => {
    return this.transactions()
      .filter(t => t.userId === String(contactId))
      .reduce((sum, t) => {
        const amount = t.amount ?? 0
        if (t.transactionType === 'CREDIT') return sum + amount
        if (t.transactionType === 'DEBIT') return sum - amount
        return sum
      }, 0)
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

  contacts = computed(() =>
    this.contactService.selectAll().map(contact => ({
      ...contact,
      balance: this.getNetBalanceForContact(contact.id),
      initials: this.getInitials(contact.fullName ?? '-')
    }))
  )

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
