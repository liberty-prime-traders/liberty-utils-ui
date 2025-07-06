import {Component, computed, inject, input, OnInit} from '@angular/core'
import {Card} from 'primeng/card'
import {Select} from 'primeng/select'
import {EnumToDropdownPipe} from '../../../../pipes/enum-to-dropdown.pipe'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {InputText} from 'primeng/inputtext'
import {ButtonDirective} from 'primeng/button'
import {ContactType} from '../../../../../api/contacts/contact-type.enum'
import {Contact} from '../../../../../api/contacts/contact.model'
import {ContactService} from '../../../../../api/contacts/contact.service'

@Component({
  selector: 'dt-add-person',
  imports: [
    Card,
    Select,
    EnumToDropdownPipe,
    ReactiveFormsModule,
    InputText,
    ButtonDirective
  ],
  templateUrl: './add-person.component.html'
})
export class AddPersonComponent implements OnInit {
  readonly contact = input<Contact>()
  private contactService = inject(ContactService)
  protected readonly ContactType = ContactType
  private readonly formBuilder = inject(FormBuilder)

  ngOnInit(): void {
    this.contactService.fetch()
  }

  readonly contactForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.contact()?.id,
    fullName: [this.contact()?.fullName, Validators.required],
    email: [this.contact()?.email],
    phoneNumber: [this.contact()?.phoneNumber],
    contactType: [this.contact()?.contactType, Validators.required]
  }))

  saveContact(): void {
    const newContact: Partial<Contact> = {...this.contactForm().getRawValue()}
    this.contactService.post(newContact)
  }

  onCancel() {
    this.contactForm().reset(this.contact())
  }
}
