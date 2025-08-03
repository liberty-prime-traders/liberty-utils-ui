import {Component, inject, input, signal} from '@angular/core'
import {Dialog} from 'primeng/dialog'
import {Menubar} from 'primeng/menubar'
import {MenuItem} from 'primeng/api'
import {ReactiveFormsModule} from '@angular/forms'
import {Contact} from '../../../../api/contacts/contact.model'
import {ScreenSizeService} from '../../../reusable/services/screen-size.service'
import {FormTypeEnum} from './form-type.enum';
import {ContactFormDialogComponent} from '../people/contact-form/contact-form.component';

@Component({
  selector: 'dbt-add-entry',
  standalone: true,
  imports: [
    Dialog,
    Menubar,
    ReactiveFormsModule,
    ContactFormDialogComponent
  ],
  templateUrl: 'add-entry.component.html'
})
export class AddEntryComponent{
  readonly screenSizeService = inject(ScreenSizeService)

  readonly visible = signal<boolean>(false)
  readonly activeForm = signal(FormTypeEnum.CONTACT)
  readonly contact = input<Contact>()

  protected readonly items: MenuItem[] = [
    {label: 'Person', icon: 'pi pi-user', command: () =>  this.activeForm.set(FormTypeEnum.CONTACT) },
    {label: 'Transaction', icon: 'pi pi-dollar', command: () =>  this.activeForm.set(FormTypeEnum.TRANSACTION) }
  ]

  showDialog() {
    this.visible.set(true)
  }

  protected readonly FormTypeEnum = FormTypeEnum;
}
