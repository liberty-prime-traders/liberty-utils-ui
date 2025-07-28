import {Component, computed, inject, Input, input, Signal, WritableSignal} from "@angular/core"
import { ContactService } from "api/contacts/contact.service"
import {ReactiveFormsModule} from '@angular/forms'
import {Dialog} from 'primeng/dialog'
import {Button} from 'primeng/button'
import {PrimeTemplate} from 'primeng/api'


@Component({
  selector: 'dbt-person-delete',
  templateUrl: './person-delete.component.html',
  standalone: true,
  imports: [
    Dialog,
    ReactiveFormsModule,
    Button,
    PrimeTemplate,
  ]
})
export class PersonDeleteComponent {
  private readonly contactService = inject(ContactService)
  readonly personId = input<string>()
  @Input() visible!: WritableSignal<boolean>

  readonly name: Signal<string> = computed(() => {
    return this.contactService.selectAll().find(p => p.id === this.personId())?.fullName ?? ''
  })


  deleteContact() {
    this.contactService.delete(this.personId())
    this.onCancel()
  }

  onCancel() {
    this.visible.set(false)
  }
}
