import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {computed, inject, Injectable} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {map} from 'rxjs'

@Injectable({providedIn: 'root'})
export class ScreenSizeService {
  private readonly breakpointObserver = inject(BreakpointObserver)


  private readonly isMobilePortrait$ = this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
    map(breakPointState => breakPointState.matches)
  )

  private readonly isMobileLandScape$ = this.breakpointObserver.observe(Breakpoints.HandsetLandscape).pipe(
    map(breakPointState => breakPointState.matches)
  )

  private readonly isTabletPortrait$ = this.breakpointObserver.observe(Breakpoints.TabletPortrait).pipe(
    map(breakPointState => breakPointState.matches)
  )

  private readonly isTabletLandscape$ = this.breakpointObserver.observe(Breakpoints.TabletLandscape).pipe(
    map(breakPointState => breakPointState.matches)
  )

  private readonly isWebPortrait$ = this.breakpointObserver.observe(Breakpoints.WebPortrait).pipe(
    map(breakPointState => breakPointState.matches)
  )

  private readonly isWebLandscape$ = this.breakpointObserver.observe(Breakpoints.WebLandscape).pipe(
    map(breakPointState => breakPointState.matches)
  )

  readonly $isMobilePortrait = toSignal(this.isMobilePortrait$)
  readonly $isMobileLandscape = toSignal(this.isMobileLandScape$)
  readonly $isTabletPortrait = toSignal(this.isTabletPortrait$)
  readonly $isTabletLandscape = toSignal(this.isTabletLandscape$)
  private readonly $isWebPortrait = toSignal(this.isWebPortrait$)
  private readonly $isWebLandscape = toSignal(this.isWebLandscape$)

  readonly isTabletPortraitAndBelow = computed(() =>
    this.$isMobilePortrait() || this.$isMobileLandscape() || this.$isTabletPortrait()
  )

  readonly $isMobile = computed(() =>
    this.$isMobilePortrait() || this.$isMobileLandscape()
  )
}
