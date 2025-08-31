import {HttpErrorResponse} from '@angular/common/http'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {throwError} from 'rxjs'
import {ProcessingStatus} from '../processing-status.enum'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'

export abstract class ServiceFacade<RESPONSE extends BaseModel> {
  readonly selectLoading
  readonly selectFirst
  readonly selectAll
  readonly selectProcessingStatus
  readonly selectFailureMessages

  protected constructor(protected readonly store: BaseStore<RESPONSE>) {
    this.selectLoading = this.store.loading
    this.selectFirst = this.store.selectFirst
    this.selectAll = this.store.entities
    this.selectProcessingStatus = this.store.processingStatus
    this.selectFailureMessages = this.store.failureMessages
  }

  protected prepareResponse(body: RESPONSE | RESPONSE[]): RESPONSE | RESPONSE[] {
    return body
  }

  protected getBasePath(id?: EntityId): string {
    const idPath = isNil(id) ? '' : `/${id}`
    return `/secured/${this.store.basePath}${idPath}`
  }

  protected setProcessingStatus(processingStatus: ProcessingStatus): void {
    this.store.setProcessingStatus(processingStatus)
  }

  resetProcessingStatus() {
    this.setProcessingStatus(ProcessingStatus.IDLE)
    this.store.clearError()
  }

  protected finishSavingWithSuccess(response: RESPONSE | RESPONSE[]) {
    const result = this.prepareResponse(response)
    if (Array.isArray(result)) {
      this.store.setAll(result)
    } else if (!isNil(result)) {
      this.store.upsert(result)
    }
    this.store.setHasCache(true)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected setStoreError(error: HttpErrorResponse) {
    this.store.setError(error)
    this.store.setHasCache(false)
    return throwError(() => error)
  }
}
