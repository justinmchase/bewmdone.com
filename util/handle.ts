
export function handle(event: any) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
}
