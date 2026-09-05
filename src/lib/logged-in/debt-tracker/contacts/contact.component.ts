import {CdkVirtualScrollViewport, ScrollingModule} from '@angular/cdk/scrolling'
import {NgClass} from '@angular/common'
import {Component, computed, inject, model, OnInit, Signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'
import {filter, map} from 'rxjs'
import {Contact} from '../../../../api/contacts/contact.model'
import {ContactService} from '../../../../api/contacts/contact.service'
import {BalanceRefreshService} from '../../../../api/debt-tracker-balance-refresh/balance-refresh.service'
import {AvatarComponent} from '../../../reusable/components/avatar/avatar.component'
import {MoneyComponent} from '../../../reusable/components/money.component'
import {ScreenSizeService} from '../../../reusable/services/screen-size.service'

@Component({
  selector: 'dbt-people',
  templateUrl: './contact.component.html',
  imports: [
    Card,
    InputText,
    RouterOutlet,
    ReactiveFormsModule,
    IconField,
    InputIcon,
    InputIcon,
    FormsModule,
    NgClass,
    ScrollingModule,
    AvatarComponent,
    MoneyComponent,
    Button
  ],
  standalone: true,
  providers: [CdkVirtualScrollViewport]
})
export class ContactComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  readonly screenSizeService = inject(ScreenSizeService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private readonly balanceRefreshService = inject(BalanceRefreshService)

  readonly searchTerm = model('')
  private readonly contacts: Signal<Contact[]> = this.contactService.selectAll

  readonly $filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    const contacts = this.contacts().sort((a, b) => {
      const amountDiff = Math.abs(b.balance ?? 0) - Math.abs(a.balance ?? 0)
      if (amountDiff !== 0) {
        return amountDiff
      }
      const nameA = a.fullName?.toLowerCase() ?? ''
      const nameB = b.fullName?.toLowerCase() ?? ''
      return nameA.localeCompare(nameB)
    })

    if (term) {
      return contacts.filter(contact => {
        const name = contact.fullName?.toLowerCase() ?? ''
        const type = contact.contactType?.toLowerCase() ?? ''
        return name.includes(term) || type.includes(term)
      })
    }
    return contacts
  })

  private readonly selectedPersonId$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.route.snapshot.firstChild?.paramMap.get('id') ?? '')
  )

  readonly $selectedPersonId = toSignal(this.selectedPersonId$, {initialValue: ''})

  ngOnInit(): void {
    this.contactService.fetch()
  }

  openDetails(personId: EntityId) {
    const id = personId.toString()
    this.router.navigate([id], { relativeTo: this.route }).then()
  }

  triggerBalanceRefresh() {
    this.balanceRefreshService.triggerRefresh()
  }
}
