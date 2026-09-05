import {AfterViewInit, computed, DestroyRef, Directive, ElementRef, HostListener, inject, input} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {tap} from 'rxjs/operators'
import {stretchVisibleElement} from '../utils/display-manips'
import {AutoStretchService} from '../services/auto-stretch.service'

@Directive({selector: '[lbuAutoStretch]'})
export class AutoStretchDirective implements AfterViewInit {

  readonly elementId = input('', {alias: 'lbuAutoStretch'})
  readonly useMinHeight = input(false)
  readonly padding = input<number | undefined>(undefined)
  readonly stopBefore = input<string>()

  private readonly el = inject(ElementRef<HTMLElement>)
  private readonly autoStretchService = inject(AutoStretchService)
  private readonly destroyRef = inject(DestroyRef)

  private readonly targetId = computed(() => this.elementId() || this.el.nativeElement.id)

  private readonly effectivePadding = computed(() => {
    if (this.padding() !== undefined) {
      return this.padding()
    }
    return this.useMinHeight() ? 0 : 20
  })

  ngAfterViewInit(): void {
    this.stretch()
    this.autoStretchService.stretch$.pipe(
      tap(() => this.stretch()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  @HostListener('window:resize')
  stretch(): void {
    setTimeout(() =>
        stretchVisibleElement(
          this.targetId(), this.useMinHeight(), this.effectivePadding()!, this.stopBefore()
        ),
      0
    )
  }
}
