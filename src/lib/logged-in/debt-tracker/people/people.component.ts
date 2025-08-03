import {Component, computed, inject, model, OnInit} from '@angular/core'
import {Avatar} from 'primeng/avatar'
import {ContactService} from '../../../../api/contacts/contact.service'
import {TransactionService} from '../../../../api/transactions/transaction.service'
import {CurrencyPipe} from '@angular/common'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {RouterLink, RouterOutlet} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {NullishToZeroPipe} from '../../../reusable/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../reusable/pipes/prettify-enum.pipe'
import {InitialsPipe} from '../../../reusable/pipes/initials.pipe'
import {ScreenSizeService} from '../../../reusable/services/screen-size.service'


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
    InitialsPipe,
    FormsModule,
    Avatar,
    NullishToZeroPipe
  ],
  standalone: true
})
export class PeopleComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  private readonly transactionService = inject(TransactionService)
  readonly screenSizeService = inject(ScreenSizeService)

  ngOnInit(): void {
    this.contactService.fetch()
    this.transactionService.fetch()
  }

  private readonly contacts = this.contactService.selectAll

  readonly searchTerm = model('')
  readonly filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    if (!term) {
      return this.contacts()
    }
    return this.contacts().filter(contact => {
      const name = contact.fullName?.toLowerCase() ?? ''
      const type = contact.contactType?.toLowerCase() ?? ''
      return name.includes(term) || type.includes(term)
    })
  })
}
