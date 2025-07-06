import {AsyncPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {map, Observable} from 'rxjs'
import {LbuOktaService} from '../../../config/lbu-okta.service'

@Component({
  selector: 'dsp-daily-snapshot',
  templateUrl: './daily-snapshot.component.html',
  imports: [
    AsyncPipe,
    Card,
    Menu,
    RouterOutlet
  ]
})
export class DailySnapshotComponent {
  private readonly lbuOktaService = inject(LbuOktaService)

  readonly navigationItems$: Observable<MenuItem[]> = this.lbuOktaService.isLibertyAdmin$.pipe(
    map(isLibertyAdmin => [
      {
        label: 'Menu',
        items: [
          {label: 'Snapshots', routerLink: '.'},
          {label: 'User Locations', routerLink: 'user-locations', visible: isLibertyAdmin}
        ]
      }
    ])
  )
}
