import {Component} from '@angular/core'
import {Menubar} from 'primeng/menubar'
import {MenuItem} from 'primeng/api'
import {RouterOutlet} from '@angular/router'
import {Card} from 'primeng/card'

@Component({
  selector: 'dt-add-new-form',
  templateUrl: 'add-new-form.component.html',
  imports: [
    Menubar,
    RouterOutlet,
    Card
  ]
})

export class AddNewFormComponent {
  protected readonly items: MenuItem[] = [
    {label: 'Transaction', icon: 'pi pi-dollar', routerLink: 'transaction'},
    {label: 'Person', icon: 'pi pi-user', routerLink: 'person'}
  ]
}
