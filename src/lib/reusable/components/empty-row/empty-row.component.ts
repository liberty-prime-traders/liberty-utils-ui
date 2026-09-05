import {Component, Input} from '@angular/core'

@Component({
  selector: 'tr' + '[rts-empty-row]',
  templateUrl: './empty-row.component.html',
  imports: []
})
export class EmptyRowComponent {
    @Input() colspan = 1
    @Input() message = 'No records found'
}
