import {Component, computed, inject, model, OnInit} from '@angular/core'
import {Avatar} from 'primeng/avatar'
import {ContactService} from '../../../../api/contacts/contact.service'
import {CurrencyPipe} from '@angular/common'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {NullishToZeroPipe} from '../../../reusable/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../reusable/pipes/prettify-enum.pipe'
import {InitialsPipe} from '../../../reusable/pipes/initials.pipe'
import {ScreenSizeService} from '../../../reusable/services/screen-size.service'
import {BalanceService} from '../../../reusable/services/balance.service'
import {Dialog} from 'primeng/dialog'
import {EntityId} from '@ngrx/signals/entities'


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
    InitialsPipe,
    FormsModule,
    Avatar,
    NullishToZeroPipe,
    Dialog
  ],
  standalone: true
})
export class PeopleComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  readonly screenSizeService = inject(ScreenSizeService)
  private readonly balanceService = inject(BalanceService)
  isDialogVisible = false
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  openDetails(personId: EntityId) {
    const id = personId.toString()

    this.router.navigate([id], { relativeTo: this.route })

    if (this.screenSizeService.$isMobile() || this.screenSizeService.$isTabletPortrait()) {
      this.isDialogVisible = true;
    }
  }

  closeDialog() {
    this.isDialogVisible = false;
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
