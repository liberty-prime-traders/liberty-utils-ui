import {ProcessingStatus} from '../processing-status.enum'

export interface BaseState {
  processingStatus: ProcessingStatus
  failureMessages: string[]
  loading: boolean
  hasCache: boolean
}

export const createInitialState = (): BaseState => ({
  processingStatus: ProcessingStatus.IDLE,
  loading: false,
  failureMessages: [],
  hasCache: false
})
