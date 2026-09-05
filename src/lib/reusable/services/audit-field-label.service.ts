import {Injectable} from '@angular/core'

@Injectable()
export abstract class AuditFieldLabelService {
  abstract getLabel(fieldName: string): string
}
