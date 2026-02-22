export interface Cell {
  value?: string
  classes?: string[]
}

export function useMatrix(rows: number, cols: number) {
  const cells = reactive(new Map<string, Cell>())
  const selected = ref<{ x: number; y: number } | null>(null)

  const keyOf = (x: number, y: number) => `${x}:${y}`

  const isInside = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < cols && y < rows

  const ensureCell = (x: number, y: number): Cell => {
    const key = keyOf(x, y)
    const existing = cells.get(key)
    if (existing) return existing

    const created: Cell = {}
    cells.set(key, created)
    return created
  }

  const setCell = (x: number, y: number, value: string) => {
    if (!isInside(x, y)) return
    const cell = ensureCell(x, y)
    cell.value = value
  }

  const toggleClass = (x: number, y: number, className: string) => {
    console.log(className)
    if (!isInside(x, y)) return
    const cell = ensureCell(x, y)

    if (!cell.classes) cell.classes = []

    const i = cell.classes.indexOf(className)
    if (i >= 0) {
      cell.classes.splice(i, 1)
    } else {
      cell.classes.push(className)
    }
  }

  const removeClasses = (x: number, y: number) => {
    if (!isInside(x, y)) return
    const key = keyOf(x, y)
    const cellProps = cells.get(key)
    cells.set(keyOf(x, y), { ...(cellProps ? cellProps : {}), classes: [] })
  }

  const getCell = (x: number, y: number) =>
    isInside(x, y) ? cells.get(keyOf(x, y)) : undefined

  const selectCell = (x: number, y: number) => {
    if (!isInside(x, y)) return
    selected.value = { x, y }
  }

  const serialize = () => {
    return JSON.stringify([...cells.entries()])
  }

  const deserialize = (json: string) => {
    const entries: [string, Cell][] = JSON.parse(json)
    cells.clear()
    for (const [k, v] of entries) cells.set(k, v)
  }

  return {
    rows,
    cols,
    cells,
    selected,
    setCell,
    toggleClass,
    removeClasses,
    getCell,
    selectCell,
    serialize,
    deserialize
  }
}
