import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'balanceMessage',
  standalone: true
})
export class BalanceMessagePipe implements PipeTransform {
  transform(balance: number, currencyCode = 'USD'): string {
    if (balance === 0) {
      return 'No balance'
    }

    const numberFormatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
    }
    const formatted = new Intl.NumberFormat('en-US', numberFormatOptions).format(Math.abs(balance))

    return balance > 0
      ? `They owe you ${formatted}`
      : `You owe them ${formatted}`
  }
}
