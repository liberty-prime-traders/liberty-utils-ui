import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {inject} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {finalize, Subscription} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {AbstractBaseStore} from './abstract-base-store'
import {BaseModel} from './base.model'
import {FetchUtils} from './fetch-utils'

export abstract class MutatorUtils <
    RESPONSE extends BaseModel,
    STORE extends AbstractBaseStore,
    PAYLOAD = Partial<RESPONSE>
> extends FetchUtils<RESPONSE, STORE> {

  private readonly httpClient = inject(HttpClient)

  protected finishDeletingWithSuccess(...args: unknown[]): void {
  }

  protected constructor(protected override readonly store: STORE) {
    super(store)
  }

  post(body?: PAYLOAD, id?: string): Subscription {
    this.startApiRequest()
    return this.httpClient.post<RESPONSE>(this.getBasePath(id), body).pipe(
      first(),
      tap((postResult: RESPONSE) => this.finishSavingWithSuccess(postResult)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }

  put(body: PAYLOAD): Subscription {
    this.startApiRequest()
    return this.httpClient.put<RESPONSE>(this.getBasePath(), body).pipe(
      first(),
      tap((putResult: RESPONSE) => this.finishSavingWithSuccess(putResult)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }

  delete(id?: EntityId): Subscription | undefined {
    if (!id) return
    this.startApiRequest()
    return this.httpClient.delete(this.getBasePath(id)).pipe(
      first(),
      tap(() => this.finishDeletingWithSuccess(id)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }
}

