import {DecimalPipe, NgClass} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {NullishToZeroPipe} from '../pipes/nullish-to-zero.pipe'

@Component({
  selector: 'lbu-money',
  imports: [
    DecimalPipe,
    NullishToZeroPipe,
    NgClass
  ],
  template: `
    <div class="monospace" [ngClass]="effectiveClass()">
      {{'$'}}{{ absoluteAmount() | nullishToZero | number:'1.2-2' }}
    </div>
  `
})
export class MoneyComponent {
  readonly size = input('text-lg')
  readonly amount = input<number|undefined>(0)

  private readonly effectiveAmount = computed(() => this.amount() ?? 0)
  readonly absoluteAmount = computed(() => Math.abs(this.effectiveAmount()))

  private readonly color = computed(() =>
    !this.effectiveAmount() ? 'gray' : this.effectiveAmount() > 0 ? 'green' : 'red'
  )

  private readonly colorClass = computed(() => `text-${this.color()}-600`)

  readonly effectiveClass = computed(() => this.size() + ' ' + this.colorClass())
}
