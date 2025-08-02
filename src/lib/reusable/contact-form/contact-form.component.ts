import {Component, effect, inject, input, OnInit, WritableSignal} from '@angular/core';
import {Contact} from '../../../api/contacts/contact.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ContactService} from '../../../api/contacts/contact.service';
import {ContactType} from '../../../api/contacts/contact-type.enum'
import {Select} from 'primeng/select';
import {EnumToDropdownPipe} from '../../pipes/enum-to-dropdown.pipe';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {Card} from 'primeng/card';

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
  readonly visible = input<WritableSignal<boolean>>();

  contactForm!: FormGroup
  protected readonly ContactType = ContactType

  private readonly fb = inject(FormBuilder)
  private readonly contactService = inject(ContactService)

  ngOnInit() {
    this.contactForm = this.fb.nonNullable.group({
      id: this.contact()?.id,
      fullName: [this.contact()?.fullName ?? '', Validators.required],
      email: [this.contact()?.email ?? ''],
      phoneNumber: [this.contact()?.phoneNumber ?? ''],
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
    this.visible()?.set(false)
  }
}
