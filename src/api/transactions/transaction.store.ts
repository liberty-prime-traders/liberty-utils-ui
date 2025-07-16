import {Injectable} from '@angular/core';
import {BaseStore, createBaseStore} from '../base-api/base.store';
import {Transaction} from './transaction.model';

@Injectable({providedIn: 'root'})
export class TransactionStore extends createBaseStore<Transaction>() implements BaseStore<Transaction> {
  readonly basePath = 'transaction';
}
