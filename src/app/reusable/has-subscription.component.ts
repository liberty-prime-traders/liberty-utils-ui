import {Component, OnDestroy} from '@angular/core'
import {Subscription} from 'rxjs'

@Component({
  template: ''
})
export abstract class HasSubscriptionComponent implements OnDestroy {
  protected readonly subscriptions = new Subscription()

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
