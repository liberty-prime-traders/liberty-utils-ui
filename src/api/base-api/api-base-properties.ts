import {HttpErrorResponse} from '@angular/common/http'
import {Signal, signal} from '@angular/core'
import {toObservable} from '@angular/core/rxjs-interop'
import {EntityId} from '@ngrx/signals/entities'
import {Observable, throwError} from 'rxjs'
import {filter, skip, take, tap} from 'rxjs/operators'
import {ProcessingStatus} from '../processing-status.enum'
import {AbstractBaseStore} from './abstract-base-store'
import {ApiRequestConfig} from './api-request-config'

export abstract class ApiBaseProperties<STORE extends AbstractBaseStore> {
  protected store: STORE
  readonly selectLoading: Signal<boolean>
  readonly selectProcessingStatus: Signal<ProcessingStatus>
  readonly selectFailureMessages: Signal<string[]>
  readonly processingStatus$: Observable<ProcessingStatus>

  protected constructor(protected readonly _store: STORE) {
    this.store = _store
    this.selectLoading = this.store.loading
    this.selectProcessingStatus = this.store.processingStatus
    this.selectFailureMessages = this.store.failureMessages
    this.processingStatus$ = toObservable(this.selectProcessingStatus)
  }

  private readonly defaultApiRequestConfig: ApiRequestConfig = {
    upsertOnSuccess: false,
    urlSuffix: ''
  }

  protected readonly apiRequestConfig = signal<ApiRequestConfig>(this.defaultApiRequestConfig)


  protected getBasePath(id?: EntityId): string {
    const idPath = id ? `/${id}` : ''
    const urlSuffix = this.apiRequestConfig().urlSuffix
    const suffixPath = urlSuffix ? `/${urlSuffix}` : ''
    return `/secured/${this.store.basePath}${idPath}${suffixPath}`
  }

  protected setProcessingStatus(processingStatus: ProcessingStatus): void {
    this.store.setProcessingStatus(processingStatus)
  }

  protected startApiRequest() {
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
    this.store.clearError()
  }

  protected finalizeApiRequest() {
    this.store.setLoading(false)
    this.apiRequestConfig.set(this.defaultApiRequestConfig)
  }

  protected patchApiRequestConfig(config: Partial<ApiRequestConfig>) {
    this.apiRequestConfig.update((currentConfig) => ({...currentConfig, ...config}))
  }

  resetProcessingStatus() {
    this.setProcessingStatus(ProcessingStatus.IDLE)
  }

  protected getApiRequestConfig(): ApiRequestConfig {
    return this.apiRequestConfig()
  }

  protected setStoreError(error: HttpErrorResponse) {
    this.store.setError(error)
    this.store.setHasCache(false)
    return throwError(() => error)
  }

  watchProcessingStatus(onSuccess: Function, onFailure?: Function) {
    this.processingStatus$.pipe(
      skip(1),
      filter((processingStatus) => [ProcessingStatus.SUCCESS, ProcessingStatus.FAILURE].includes(processingStatus)),
      tap((processingStatus: ProcessingStatus) => {
        if (processingStatus === ProcessingStatus.SUCCESS) {
          onSuccess()
        } else if (processingStatus === ProcessingStatus.FAILURE && onFailure) {
          onFailure()
        }
      }),
      take(1)
    ).subscribe()
  }
}
