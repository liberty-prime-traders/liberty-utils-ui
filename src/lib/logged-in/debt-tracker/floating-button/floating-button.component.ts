import {Component} from '@angular/core'
import {Router} from '@angular/router'

@Component({
  selector: 'dt-floating-add-button',
  standalone: true,
  templateUrl: 'floating-add-button.component.html'
})
export class FloatingAddButtonComponent {
  constructor(private router: Router) {}

  onAddClick() {
    this.router.navigate(['/secure/debt-tracker/add-new'])
  }
}
