import {ProcessingStatus} from './processing-status.enum'

export interface DspState {
  processingStatus: ProcessingStatus
  failureMessages: string[]
  loading: boolean
}

export const createInitialState = (): DspState => ({
  processingStatus: ProcessingStatus.IDLE,
  loading: false,
  failureMessages: []
})
