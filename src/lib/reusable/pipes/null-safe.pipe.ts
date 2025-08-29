import {Pipe, PipeTransform} from '@angular/core'
import {isNil} from 'lodash-es'

@Pipe({name: 'nullSafe', standalone: true})
export class NullSafePipe implements PipeTransform {
  transform<T>(value?: T): string {
    if (isNil(value)) {
      return '--'
    }
    return String(value) || '--'
  }
}
