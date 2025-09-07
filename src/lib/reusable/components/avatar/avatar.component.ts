import {NgClass} from '@angular/common'
import {Component, input} from '@angular/core'
import {Avatar} from 'primeng/avatar'
import {Contact} from '../../../../api/contacts/contact.model'
import {InitialsPipe} from '../../pipes/initials.pipe'
import {PrettifyEnumPipe} from '../../pipes/prettify-enum.pipe'

@Component({
  selector: 'lbu-avatar',
  imports: [
    Avatar,
    InitialsPipe,
    PrettifyEnumPipe,
    NgClass
  ],
  template: `
    <div class="flex align-items-center gap-2">
      <p-avatar [label]="contact()?.fullName | initials"
                shape="circle"
                [size]="size()"
                class="bg-primary text-white">
      </p-avatar>

      <div class="flex flex-column gap-1">
        <div [ngClass]="textClass()">{{ contact()?.fullName }}</div>
        @if (showContactType()){
          <div class="font-italic">{{ contact()?.contactType | prettifyEnum}}</div>
        }
        @if (showPhoneNumber() && contact()?.phoneNumber) {
          <div class="text-sm flex align-items-center">
            <i class="pi pi-phone mr-1"></i>{{ contact()?.phoneNumber }}
          </div>
        }
      </div>
    </div>
  `
})
export class AvatarComponent {
  readonly contact = input<Contact|undefined>(undefined)
  readonly size = input<'normal' | 'large' | 'xlarge'>('normal')
  readonly textClass = input<string>('font-medium')
  readonly showContactType = input(false)
  readonly showPhoneNumber = input(false)
}
