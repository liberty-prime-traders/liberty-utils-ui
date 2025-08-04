import {Directive, OnDestroy} from '@angular/core'
import {Subscription} from 'rxjs'

@Directive({selector: '[appHasSubscription]'})
export abstract class HasSubscriptionDirective implements OnDestroy {
  protected readonly subscriptions = new Subscription()

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
