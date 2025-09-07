import {Contact} from '../contacts/contact.model'

export interface ContactSummary extends Contact {
  amount: number
}
