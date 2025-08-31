import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {inject} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {finalize, Subscription} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {ProcessingStatus} from '../processing-status.enum'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'
import {FetchService} from './fetch-service'

export abstract class BaseService<RESPONSE extends BaseModel, PAYLOAD = Partial<RESPONSE>>
  extends FetchService<RESPONSE> {

  private readonly httpClient = inject(HttpClient)

  protected constructor(protected override readonly store: BaseStore<RESPONSE>) {
    super(store, inject(HttpClient))
  }

  post(body?: PAYLOAD, id?: string): Subscription {
    this.startApiRequest()
    return this.httpClient.post<RESPONSE>(this.getBasePath(id), body).pipe(
      first(),
      tap((postResult: RESPONSE) => this.finishSavingWithSuccess(postResult)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.store.setLoading(false))
    ).subscribe()
  }

  put(body: PAYLOAD): Subscription {
    this.startApiRequest()
    return this.httpClient.put<RESPONSE>(this.getBasePath(), body).pipe(
      first(),
      tap((putResult: RESPONSE) => this.finishSavingWithSuccess(putResult)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.store.setLoading(false))
    ).subscribe()
  }

  delete(id?: EntityId): Subscription|undefined {
    if (!id) {
      return
    }
    this.startApiRequest()
    return this.httpClient.delete(this.getBasePath(id)).pipe(
      first(),
      tap(() => this.finishDeletingWithSuccess(id)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.store.setLoading(false))
    ).subscribe()
  }

  protected finishDeletingWithSuccess(id: EntityId) {
    this.store.remove(id)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  private startApiRequest() {
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
  }
}
