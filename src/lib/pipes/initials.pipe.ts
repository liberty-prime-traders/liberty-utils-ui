import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(fullName: string | undefined): string {
    if (!fullName) return '-'

    const names = fullName.trim().split(/\s+/)

    let initials: string
    if (names.length === 1) {
      initials = names[0].length > 2
        ? names[0][0] + names[0][1]
        : names[0][0]
    } else {
      initials = names[0][0] + names[names.length - 1][0]
    }

    return initials.toUpperCase()
  }
}
