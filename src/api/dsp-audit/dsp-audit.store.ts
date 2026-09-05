import {Injectable} from '@angular/core'
import {CollectionBaseStore, createBaseStore} from '../base-api/collection-base-api/collection-base.store'
import {DspAudit} from './dsp-audit.model'

@Injectable({providedIn: 'root'})
export class DspAuditStore extends createBaseStore<DspAudit>() implements CollectionBaseStore<DspAudit> {
	readonly basePath = 'audit'
}
