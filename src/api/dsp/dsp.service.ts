import {HttpParams} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {CollectionBaseService} from '../base-api/collection-base-api/collection-base.service'
import {DailySnapshotModel} from './daily-snapshot.model'
import {DspStore} from './dsp-store'
import 'config/http-params.extension'

@Injectable({providedIn: 'root'})
export class DspService extends CollectionBaseService<DailySnapshotModel> {
	constructor() {
		super(inject(DspStore))
	}

	override getHttpParams(params: {startDate: string, endDate: string}): HttpParams {
		return new HttpParams()
			.setNonNull('startDate', params.startDate)
			.setNonNull('endDate', params.endDate)
	}

}
