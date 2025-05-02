import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {catchError, finalize, first, Subscription, tap, throwError} from 'rxjs'
import {DailySnapshotModel} from './daily-snapshot.model'
import {DspStore} from './dsp-store'
import {ProcessingStatus} from './processing-status.enum'

@Injectable({providedIn: 'root'})
export class DspService {
	private readonly dspStore = inject(DspStore)
	private readonly httpClient = inject(HttpClient)
	
	private readonly basePath = 'secured/snapshot'
	
	get(startDate: string, endDate: string): Subscription {
		this.startRequest()
		return this.httpClient
			.get<DailySnapshotModel[]>(`${this.basePath}?startDate=${startDate}&endDate=${endDate}`)
			.pipe(
				tap((response) => this.dspStore.setAll(response)),
				catchError((error) => {
					this.dspStore.setError(error)
					return throwError(() => error)
				}),
				finalize(() => this.dspStore.setLoading(false)),
				first()
			).subscribe()
	}
	
	post(dailySnapshot: DailySnapshotModel): Subscription {
		this.startRequest()
		return this.httpClient
			.post<DailySnapshotModel>(this.basePath, dailySnapshot)
			.pipe(
				tap((response) => this.dspStore.upsert(response)),
				catchError((error) => {
					this.dspStore.setError(error)
					return throwError(() => error)
				}),
				finalize(() => this.dspStore.setLoading(false)),
				first()
			).subscribe()
	}
	
	put(dailySnapshot: DailySnapshotModel): Subscription {
		this.startRequest()
		return this.httpClient
			.put<DailySnapshotModel>(`${this.basePath}`, dailySnapshot)
			.pipe(
				tap((response) => this.dspStore.upsert(response)),
				catchError((error) => {
					this.dspStore.setError(error)
					return throwError(() => error)
				}),
				finalize(() => this.dspStore.setLoading(false)),
				first()
			).subscribe()
	}
	
	delete(id: string): Subscription {
		this.startRequest()
		return this.httpClient
			.delete(`${this.basePath}/${id}`)
			.pipe(
				tap(() => this.dspStore.remove(id)),
				catchError((error) => {
					this.dspStore.setError(error)
					return throwError(() => error)
				}),
				finalize(() => this.dspStore.setLoading(false)),
				first()
			).subscribe()
	}
	
	private startRequest() {
		this.dspStore.setLoading(true)
		this.dspStore.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
	}
}
