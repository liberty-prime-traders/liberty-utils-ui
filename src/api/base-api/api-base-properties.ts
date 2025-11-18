import {HttpErrorResponse} from '@angular/common/http'
import {Signal, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {throwError} from 'rxjs'
import {ProcessingStatus} from '../processing-status.enum'
import {AbstractBaseStore} from './abstract-base-store'
import {ApiRequestConfig} from './api-request-config'

export abstract class ApiBaseProperties<STORE extends AbstractBaseStore> {
  protected store: STORE
  readonly selectLoading: Signal<boolean>
  readonly selectProcessingStatus: Signal<ProcessingStatus>
  readonly selectFailureMessages: Signal<string[]>

  protected constructor(protected readonly _store: STORE) {
    this.store = _store
    this.selectLoading = this.store.loading
    this.selectProcessingStatus = this.store.processingStatus
    this.selectFailureMessages = this.store.failureMessages
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
}
