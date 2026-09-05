import {Injectable} from '@angular/core'
import {Subject} from 'rxjs'

@Injectable({providedIn: 'root'})
export class AutoStretchService {
  readonly stretch$ = new Subject<void>()

  triggerStretch(): void {
    this.stretch$.next()
  }
}
