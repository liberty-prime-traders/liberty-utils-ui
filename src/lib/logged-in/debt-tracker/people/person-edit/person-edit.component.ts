import {Component, computed, inject, Input, input, OnInit, Signal, WritableSignal} from "@angular/core";
import { ContactService } from "api/contacts/contact.service";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Contact} from "api/contacts/contact.model";
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {ContactType} from '../../../../../api/contacts/contact-type.enum';
import {EnumToDropdownPipe} from '../../../../pipes/enum-to-dropdown.pipe';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'dbt-person-edit',
  templateUrl: './person-edit.component.html',
  standalone: true,
  imports: [
    Dialog,
    ReactiveFormsModule,
    InputText,
    Select,
    EnumToDropdownPipe,
    ButtonDirective
  ]
})
export class PersonEditComponent implements OnInit {
  private contactService = inject(ContactService);
  private readonly formBuilder = inject(FormBuilder);
  readonly contact = input<Contact>();
  @Input() personId!: WritableSignal<string>;
  @Input() visible!: WritableSignal<boolean>;

  person!: Signal<Contact | undefined>;
  protected readonly ContactType = ContactType;

  readonly contactForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.person()?.id,
    fullName: [this.person()?.fullName, Validators.required],
    email: [this.person()?.email],
    phoneNumber: [this.person()?.phoneNumber],
    contactType: [this.person()?.contactType, Validators.required]
  }));


  ngOnInit(): void {
    this.person = computed(() =>
      this.contactService.selectAll().find(p => p.id === this.personId())
    );
  }


  saveContact() {
    const updatedContact: Partial<Contact> = {...this.contactForm().getRawValue(), id: this.personId()};
    this.contactService.put(updatedContact)
    this.onCancel()
  }

  onCancel() {
    this.contactForm().reset(this.person())
    this.visible.set(false)
  }
}
