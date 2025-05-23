import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'prettifyEnum', standalone: true
})
export class PrettifyEnumPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '--'
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
  }
}
