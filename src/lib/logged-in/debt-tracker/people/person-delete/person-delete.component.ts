import {Component, computed, inject, Input, input, OnInit, Signal, WritableSignal} from "@angular/core";
import { ContactService } from "api/contacts/contact.service";
import {ReactiveFormsModule} from '@angular/forms';
import {Contact} from "api/contacts/contact.model";
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';


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
export class PersonDeleteComponent implements OnInit {
  ngOnInit(): void {}
  private contactService = inject(ContactService);
  readonly contact = input<Contact>();
  @Input() personId!: WritableSignal<string>;
  @Input() visible!: WritableSignal<boolean>;

  name: Signal<string> = computed(() => {
    return this.contactService.selectAll().find(p => p.id === this.personId())?.fullName ?? '';
  });


  deleteContact() {
    this.contactService.delete(this.personId())
    this.onCancel()
  }

  onCancel() {
    this.visible.set(false)
  }
}
