import {Component, computed, inject, input, OnInit, WritableSignal} from '@angular/core'
import {Dialog} from 'primeng/dialog';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {Card} from 'primeng/card';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Contact} from '../../../../api/contacts/contact.model';
import {ContactService} from '../../../../api/contacts/contact.service';
import {ContactType} from '../../../../api/contacts/contact-type.enum'
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {ButtonDirective} from 'primeng/button';
import {EnumToDropdownPipe} from '../../../pipes/enum-to-dropdown.pipe';

@Component({
  selector: 'dbt-floating-add-button',
  standalone: true,
  imports: [
    Dialog,
    Menubar,
    Card,
    ReactiveFormsModule,
    InputText,
    Select,
    ButtonDirective,
    EnumToDropdownPipe
  ],
  templateUrl: 'floating-add-button.component.html'
})
export class FloatingAddButtonComponent implements OnInit{
  visible: boolean | WritableSignal<boolean> = false
  activeForm: string = "contact";
  readonly contact = input<Contact>()
  private contactService = inject(ContactService)
  protected readonly ContactType = ContactType
  private readonly formBuilder = inject(FormBuilder)

  protected readonly items: MenuItem[] = [
    {label: 'Person', icon: 'pi pi-user', command: () => { this.activeForm = 'contact'; }},
    {label: 'Transaction', icon: 'pi pi-dollar', command: () => { this.activeForm = 'transaction'; }}
  ]

  showDialog() {
    this.visible = true;
  }

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
    this.onCancel()
  }

  onCancel() {
    this.contactForm().reset(this.contact())
    this.visible = false;
  }
}
