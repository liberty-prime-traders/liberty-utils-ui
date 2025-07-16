import {Component, computed, inject, input, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContactService} from '../../../../../api/contacts/contact.service';
import {TransactionService} from '../../../../../api/transactions/transaction.service';
import {Contact} from '../../../../../api/contacts/contact.model';
import {AsyncPipe, CurrencyPipe, DatePipe, formatCurrency, NgIf} from '@angular/common';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {TransactionType} from '../../../../../api/transactions/transaction-type.enum';
import {Transaction} from '../../../../../api/transactions/transaction.model';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LbuOktaService} from '../../../../../config/lbu-okta.service';
import {Button, ButtonDirective} from 'primeng/button';
import {EnumToDropdownPipe} from '../../../../pipes/enum-to-dropdown.pipe';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {ContactType} from '../../../../../api/contacts/contact-type.enum';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'dbt-person-detail',
  templateUrl: './person-detail.component.html',
  standalone: true,
  imports: [
    Card,
    PrimeTemplate,
    DropdownModule,
    TableModule,
    DatePipe,
    CurrencyPipe,
    FormsModule,
    NgIf,
    AsyncPipe,
    Button,
    ButtonDirective,
    EnumToDropdownPipe,
    InputText,
    ReactiveFormsModule,
    Select,
    Dialog
  ]
})
export class PersonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contactService = inject(ContactService);
  private transactionService = inject(TransactionService);
  protected readonly TransactionType = TransactionType;
  protected readonly formatCurrency = formatCurrency;
  readonly dspOktaService = inject(LbuOktaService);
  protected readonly ContactType = ContactType;
  private readonly formBuilder = inject(FormBuilder);
  readonly contact = input<Contact>();
  visible: boolean | WritableSignal<boolean>  = false;

  personId = signal<string>('');
  person!: Signal<Contact | undefined>;
  transactions!: Signal<Transaction[]>;

  sortOptions = [
    {label: 'Newest First', value: 'date_desc'},
    {label: 'Oldest First', value: 'date_asc'},
    {label: 'Amount High to Low', value: 'amount_desc'},
    {label: 'Amount Low to High', value: 'amount_asc'}
  ];

  selectedSortOrder = 'date_desc';

  readonly contactForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.person()?.id,
    fullName: [this.person()?.fullName, Validators.required],
    email: [this.person()?.email],
    phoneNumber: [this.person()?.phoneNumber],
    contactType: [this.person()?.contactType, Validators.required]
  }));

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.personId.set(params.get('id') ?? '');
    });

    if (!this.personId) return;

    this.person = computed(() =>
      this.contactService.selectAll().find(p => p.id === this.personId())
    );

    this.transactions = computed(() =>
      this.transactionService.selectAll().filter(t => t.userID === this.personId())
    );
  }


  getInitials(fullName: string): string {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    const initials = names.length === 1
      ? names[0].charAt(0)
      : names[0].charAt(0) + names[names.length - 1].charAt(0);
    return initials.toUpperCase();
  }

  getNetBalanceForPerson(id: string | number): number {
    return this.transactionService.selectAll()
      .filter(t => t.userID === id)
      .reduce((sum, t) => {
        const amount = t.amount ?? 0;
        return t.transactionType === TransactionType.CREDIT
          ? sum + amount
          : sum - amount;
      }, 0);
  }
  readonly sortedTransactions = computed(() => {
    const sort = this.selectedSortOrder;

    const getTime = (t: Transaction) => {
      if (Array.isArray(t.transactionDate)) {
        const [year, month, day] = t.transactionDate;
        return new Date(year, month - 1, day).getTime();
      }
      return new Date(t.transactionDate ?? 0).getTime();
    };

    return [...this.transactions()].sort((a, b) => {
      switch (sort) {
      case 'date_asc':
        return getTime(a) - getTime(b);
      case 'date_desc':
        return getTime(b) - getTime(a);
      case 'amount_asc':
        return (a.amount ?? 0) - (b.amount ?? 0);
      case 'amount_desc':
        return (b.amount ?? 0) - (a.amount ?? 0);
      default:
        return 0;
      }
    });
  });

  onEdit() {
    this.visible = true;
  }

  saveContact() {
    const updatedContact: Partial<Contact> = {...this.contactForm().getRawValue(), id: this.personId()};
    this.contactService.put(updatedContact)
    this.onCancel()
  }

  onCancel() {
    this.contactForm().reset(this.person())
    this.visible = false
  }
}
