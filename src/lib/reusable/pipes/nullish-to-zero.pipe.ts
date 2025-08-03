import {Pipe, PipeTransform} from '@angular/core'
import {isNil} from 'lodash-es'

@Pipe({name: 'nullishToZero', standalone: true})
export class NullishToZeroPipe implements PipeTransform {
  transform(value: any): number {
    if (isNil(value)) {
      return 0
    }
    return value
  }
}
