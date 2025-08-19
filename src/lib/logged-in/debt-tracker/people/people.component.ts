import {Component, computed, inject, model, OnInit} from '@angular/core'
import {Avatar} from 'primeng/avatar'
import {ContactService} from '../../../../api/contacts/contact.service'
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
import {BalanceService} from '../../../reusable/services/balance.service'


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
  readonly screenSizeService = inject(ScreenSizeService)
  private readonly balanceService = inject(BalanceService)

  ngOnInit(): void {
    this.contactService.fetch()
  }

  private readonly contacts = this.contactService.selectAll


  readonly searchTerm = model('')
  readonly filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    let list = this.contacts()

    if (term) {
      list = list.filter(contact => {
        const name = contact.fullName?.toLowerCase() ?? ''
        const type = contact.contactType?.toLowerCase() ?? ''
        return name.includes(term) || type.includes(term)
      })
    }

    return list.map(contact => ({
      ...contact,
      balance: this.balanceService.getBalance(contact.id?.toString() ?? '')
    }))
  })

}
