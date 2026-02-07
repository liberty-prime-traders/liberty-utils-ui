import {Component, inject} from '@angular/core'
import {MessageService} from 'primeng/api'

@Component({template: ''})
export abstract class ShowsMessagesComponent {
  protected readonly messageService = inject(MessageService)

}
