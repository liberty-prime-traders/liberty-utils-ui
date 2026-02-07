import {HttpClient, HttpParams} from '@angular/common/http'
import {inject} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {finalize, Subscription} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {LibertyHttpParams} from '../liberty-http.params'
import {ProcessingStatus} from '../processing-status.enum'
import {AbstractBaseStore} from './abstract-base-store'
import {ApiBaseProperties} from './api-base-properties'
import {BaseModel} from './base.model'

export declare type PARAMS = undefined | LibertyHttpParams & Record<string, unknown>

export abstract class FetchUtils <RESPONSE extends BaseModel, STORE extends AbstractBaseStore>
  extends ApiBaseProperties<STORE> {

  private readonly fetcher = inject(HttpClient)

  protected constructor(protected override readonly store: STORE) {
    super(store)
  }

  fetch(params?: PARAMS) {
    return this.doFetch(params)
  }

  refetch(params?: PARAMS) {
    this.resetStoreAndClearCache()
    return this.doFetch(params)
  }

  protected finishSavingWithSuccess(...args: unknown[]): void {
  }

  fetchById(idParam: string, additionalParams?: PARAMS): Subscription | undefined {
    return this.doFetch(additionalParams, idParam)
  }

  private assembleMatrixParams(params: HttpParams): string {
    if (!isNil(params) && params.keys().length <= 0) {
      return ''
    }
    const paramsAsArray = params.keys().map(key => `${key}=${params.get(key)}`)
    return `;${paramsAsArray.join(';')}`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getMatrixParams(params: PARAMS): HttpParams {
    return new HttpParams()
  }

  protected getPathParams(params: PARAMS): string {
    return params?.pathParams ?? ''
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getHttpParams(params: PARAMS): HttpParams {
    return new HttpParams()
  }

  private doFetch(params?: PARAMS, idParam?: EntityId): Subscription | undefined {
    if (!this.shouldMakeCall()) {
      return undefined
    }
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
    const httpParams = this.getHttpParams(params)
    const matrixParams = this.assembleMatrixParams(this.getMatrixParams(params))
    const pathParams = this.getPathParams(params)
    const url = `${this.getBasePath(idParam)}${pathParams}${matrixParams}`
    return this.fetcher.get<RESPONSE>(url, {params: httpParams}).pipe(
      tap((body) => this.finishSavingWithSuccess(body)),
      first(),
      catchError((error) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }

  private shouldMakeCall() {
    return (!this.selectLoading() || this.allowMultipleCalls()) && !this.store.hasCache()
  }

  protected allowMultipleCalls(): boolean {
    return false
  }

  resetStoreAndClearCache() {
    this.store.resetStore()
    this.removeCache()
  }

  protected removeCache(): void {
    this.store.setHasCache(false)
  }
}

