export function stretchVisibleElement(
  elementId: string,
  useMinHeight: boolean,
  padding: number,
  stopBeforeId?: string
): void {
  const el = document.getElementById(elementId)
  if (!el) {
    return
  }

  const bottom = stopBeforeId
    ? document.getElementById(stopBeforeId)?.getBoundingClientRect().top
    : window.innerHeight

  if (bottom === undefined) {
    return
  }

  const height = bottom - el.getBoundingClientRect().top - padding

  if (useMinHeight) {
    el.style.minHeight = `${height}px`
  } else {
    el.style.height = `${height}px`
  }
}
