import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, inject, model, OnInit, Signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router'
import {EntityId} from '@ngrx/signals/entities'
import {Avatar} from 'primeng/avatar'
import {Card} from 'primeng/card'
import {Dialog} from 'primeng/dialog'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'
import {filter, map} from 'rxjs'
import {Contact} from '../../../../api/contacts/contact.model'
import {ContactService} from '../../../../api/contacts/contact.service'
import {InitialsPipe} from '../../../reusable/pipes/initials.pipe'
import {NullishToZeroPipe} from '../../../reusable/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../reusable/pipes/prettify-enum.pipe'
import {ScreenSizeService} from '../../../reusable/services/screen-size.service'


@Component({
  selector: 'dbt-people',
  templateUrl: './contact.component.html',
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
    Dialog,
    NgClass
  ],
  standalone: true
})
export class ContactComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  readonly screenSizeService = inject(ScreenSizeService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  readonly isDialogVisible = model(false)
  readonly searchTerm = model('')
  private readonly contacts: Signal<Contact[]> = this.contactService.selectAll

  readonly filteredContacts = computed(() => {
    const term = this.searchTerm().toLowerCase()
    const contacts = this.contacts()
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

  readonly $selectedPersonId = toSignal(this.selectedPersonId$)

  ngOnInit(): void {
    this.contactService.fetch()
  }

  openDetails(personId: EntityId) {
    const id = personId.toString()
    this.router.navigate([id], { relativeTo: this.route }).then()
    this.isDialogVisible.set(true)
  }

  closeDialog() {
    this.isDialogVisible.set(false)
    this.router.navigate(['../'], { relativeTo: this.route }).then()
  }
}
