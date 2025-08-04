import {Component, effect, inject, input, model, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {ContactType} from '../../../../../api/contacts/contact-type.enum'
import {Contact} from '../../../../../api/contacts/contact.model'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {EnumToDropdownPipe} from '../../../../reusable/pipes/enum-to-dropdown.pipe'

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  imports: [
    Select,
    EnumToDropdownPipe,
    InputText,
    ReactiveFormsModule,
    ButtonDirective,
    Card
  ]
})
export class ContactFormDialogComponent implements OnInit {
  readonly contact = input<Contact>()
  readonly mode = input<'add' | 'edit'>('add');
  readonly visible = model(false);

  contactForm!: FormGroup
  protected readonly ContactType = ContactType

  private readonly fb = inject(FormBuilder)
  private readonly contactService = inject(ContactService)

  ngOnInit() {
    this.contactForm = this.fb.nonNullable.group({
      id: this.contact()?.id,
      fullName: [this.contact()?.fullName ?? '', Validators.required],
      email: [this.contact()?.email ?? ''],
      phoneNumber: [this.contact()?.phoneNumber ?? '',Validators.pattern(/^\d{10}$/)],
      contactType: [this.contact()?.contactType ?? '', Validators.required],
    })
  }

  constructor() {
    effect(() => {
      const contact = this.contact()
      if (contact) {
        this.contactForm.reset(this.contact())
      } else {
        this.contactForm.reset({
          id: null,
          fullName: '',
          email: '',
          phoneNumber: '',
          contactType: '',
        })
      }
    })
  }

  onSubmit() {
    const payload = this.contactForm.getRawValue()
    if (this.mode() === 'edit') {
      this.contactService.put(payload)
    } else {
      this.contactService.post(payload)
    }
    this.onCancel()
  }

  onCancel() {
    this.visible.set(false)
  }
}
