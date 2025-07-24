import {Pipe, PipeTransform} from '@angular/core'
import {SelectItem} from 'primeng/api'
import {PrettifyEnumPipe} from './prettify-enum.pipe'

@Pipe({
  name: 'enumToDropdown',
  standalone: true
})
export class EnumToDropdownPipe implements PipeTransform {
  transform<ENUM extends object>(value: ENUM): SelectItem<ENUM>[] {
    return Object.keys(value)
      .map((key): SelectItem => ({
        value: key,
        label: PrettifyEnumPipe.prototype.transform(key)
      }))
  }
}
