import {inject, Pipe, PipeTransform} from '@angular/core'
import {AuditFieldLabelService} from '../services/audit-field-label.service'

@Pipe({name: 'auditFieldLabel'})
export class AuditFieldLabelPipe implements PipeTransform {
  private readonly labelService = inject(AuditFieldLabelService)

  transform(value?: string): string | undefined {
    return value ? this.labelService.getLabel(value) : undefined
  }
}
