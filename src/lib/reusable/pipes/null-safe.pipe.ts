import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name: 'nullSafe', standalone: true})
export class NullSafePipe implements PipeTransform {
  transform<T>(value?: T): T | string {
    return this.shouldShowAsNull(value) ? '--' : value!
  }

  private shouldShowAsNull(value: unknown): boolean {
    return (
      value == null ||
      (typeof value === 'string' && !value.trim()) ||
      (typeof value === 'number' && isNaN(value)) ||
      (value instanceof Date && !Number.isFinite(value.getTime()))
    );
  }
}
