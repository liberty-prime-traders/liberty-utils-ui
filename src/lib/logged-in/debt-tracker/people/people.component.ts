import {Component, computed, inject, OnInit, signal} from '@angular/core'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {CurrencyPipe} from '@angular/common'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {RouterLink, RouterOutlet} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {PrettifyEnumPipe} from '../../../pipes/prettify-enum.pipe'
import {InitialsPipe} from '../../../pipes/initials.pipe'


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
    InputIcon,
    PrettifyEnumPipe,
    InputIcon,
    RouterLink,
    InitialsPipe
  ],
  standalone: true
})
export class PeopleComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)

  ngOnInit(): void {
    this.contactService.fetch()
    this.transactionService.fetch()
  }

  readonly contacts = computed(() =>
    this.contactService.selectAll().map(contact => ({
      ...contact,
      balance: 0,
    }))
  )

  readonly searchTerm = signal('')
  readonly filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    return this.contacts().filter(contact => {
      const name = contact.fullName?.toLowerCase() ?? ''
      const type = contact.contactType?.toLowerCase() ?? ''
      return name.includes(term) || type.includes(term)
    })
  })
}
