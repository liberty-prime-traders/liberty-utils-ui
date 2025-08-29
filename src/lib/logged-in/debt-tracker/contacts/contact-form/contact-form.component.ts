import {Component, computed, inject, input, model} from '@angular/core'
import {toObservable} from '@angular/core/rxjs-interop'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {filter, skip, take, tap} from 'rxjs/operators'
import {ContactType} from '../../../../../api/contacts/contact-type.enum'
import {Contact} from '../../../../../api/contacts/contact.model'
import {ContactService} from '../../../../../api/contacts/contact.service'
import {ProcessingStatus} from '../../../../../api/processing-status.enum'
import {FormFieldComponent} from '../../../../reusable/components/form-field/form-field.component'
import {EnumToDropdownPipe} from '../../../../reusable/pipes/enum-to-dropdown.pipe'

@Component({
  selector: 'dbt-contact-form',
  templateUrl: './contact-form.component.html',
  imports: [
    Select,
    EnumToDropdownPipe,
    InputText,
    ReactiveFormsModule,
    Card,
    FormFieldComponent,
    Button
  ]
})
export class ContactFormDialogComponent {
  private readonly fb = inject(FormBuilder)
  private readonly contactService = inject(ContactService)
  private readonly messageService = inject(MessageService)

  readonly contact = input<Contact>()
  readonly mode = input<'add' | 'edit'>('add')
  readonly visible = model(false)

  readonly $contactForm = computed(() => this.fb.nonNullable.group({
    id: this.contact()?.id,
    fullName: [this.contact()?.fullName, Validators.required],
    email: [this.contact()?.email],
    phoneNumber: [this.contact()?.phoneNumber,Validators.pattern(/^\d{10}$/)],
    contactType: [this.contact()?.contactType, Validators.required],
  }))

  protected readonly ContactType = ContactType

  private readonly contactProcessingStatus$ = toObservable(this.contactService.selectProcessingStatus)

  onSubmit() {
    const payload: Contact = this.$contactForm().getRawValue()
    if (this.mode() === 'edit') {
      this.contactService.put(payload)
    } else {
      this.contactService.post(payload)
    }
    this.listenToProcessingStatus()
  }

  onReset() {
    this.visible.set(false)
  }

  private listenToProcessingStatus() {
    this.contactProcessingStatus$.pipe(
      skip(1),
      filter((processingStatus) => [ProcessingStatus.SUCCESS, ProcessingStatus.FAILURE].includes(processingStatus)),
      tap((processingStatus) => {
        if (processingStatus === ProcessingStatus.SUCCESS) {
          this.visible.set(false)
        } else if (processingStatus === ProcessingStatus.FAILURE) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: this.contactService.selectFailureMessages().at(0)})
        }
      }),
      take(1)
    ).subscribe()
  }
}
