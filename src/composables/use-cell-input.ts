export function useCellInput(
  selected: Ref<{ x: number; y: number } | null>,
  setCell: (x: number, y: number, value: string) => void
) {
  const inputValue = (value: string) => {
    if (!selected.value) return
    setCell(selected.value.x, selected.value.y, value)
  }
  return { inputValue }
}