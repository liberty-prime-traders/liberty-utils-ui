import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'netStanding',
  standalone: true
})
export class NetStandingPipe implements PipeTransform {
  transform(standing: number, currencyCode = 'USD'): string {
    if (standing === 0) {
      return 'No balance'
    }

    const numberFormatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
    }
    const formatted = new Intl.NumberFormat('en-US', numberFormatOptions).format(Math.abs(standing))

    return standing < 0
      ? `They owe you ${formatted}`
      : `You owe them ${formatted}`
  }
}
