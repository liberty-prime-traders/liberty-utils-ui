import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {DspAudit} from './dsp-audit.model'

@Injectable({providedIn: 'root'})
export class DspAuditStore extends createBaseStore<DspAudit>() implements BaseStore<DspAudit> {
	readonly basePath = 'snapshot/audit'
}
