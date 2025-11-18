import {HttpParams} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {CollectionBaseService} from '../base-api/collection-base-api/collection-base.service'
import {PARAMS} from '../base-api/fetch-utils'
import {DspAudit} from './dsp-audit.model'
import 'config/http-params.extension'
import {DspAuditStore} from './dsp-audit.store'

@Injectable({providedIn: 'root'})
export class DspAuditService extends CollectionBaseService<DspAudit> {
	constructor() {
		super(inject(DspAuditStore))
	}

	override getHttpParams(params: PARAMS): HttpParams {
		return new HttpParams().setNonNull('snapshotId', params?.id ?? '')
	}
}
