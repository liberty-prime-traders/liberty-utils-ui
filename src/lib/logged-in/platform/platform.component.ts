import {Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'

@Component({
  selector: 'lbu-platform',
  imports: [
    Card,
    RouterOutlet,
    Menu
  ],
  templateUrl: 'platform.component.html'
})
export class PlatformComponent {

  readonly navigationItems: MenuItem[] =   [
    {label: 'Home', routerLink: '.'},
    {label: 'User Locations', routerLink: 'user-locations'}
  ]

}
