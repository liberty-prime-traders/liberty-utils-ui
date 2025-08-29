import {NgClass} from '@angular/common'
import {Component, input} from '@angular/core'
import {FormFieldDirection} from './form-field-direction'

@Component({
  selector: 'lbu-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  imports: [
    NgClass
  ]
})

export class FormFieldComponent {
  readonly label = input('')
  readonly for = input('')
  readonly layout = input(FormFieldDirection.VERTICAL)
  readonly required = input(false)
  readonly labelWidth = input('120px')
  readonly contentClass = input<string>()
  readonly containerClass = input<string>()

  readonly formFieldDirection = FormFieldDirection
}
