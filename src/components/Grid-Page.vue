<template>
  <div
    ref="container"
    class="viewport"
    tabindex="0"
    @pointerdown.prevent="onPointerDown"
    @pointermove.prevent="onPointerMove"
    @wheel.prevent="onWheel"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="world" :style="worldStyle">
      <div
        class="page-frame"
        :style="{
          width: pageWidth + 'px',
          height: pageHeight + 'px'
        }"
      />
      <div
        v-for="cell in visibleCells"
        :key="cell.x + ':' + cell.y"
        class="cell"
        :class="[...(getCell(cell.x, cell.y)?.classes ?? []), selected?.x === cell.x && selected?.y === cell.y ? 'selected' : '']"
        :style="{
          left: cell.x * cellSize + 'px',
          top: cell.y * cellSize + 'px',
          width: cellSize + 'px',
          height: cellSize + 'px'
        }"
        @click.stop="handleCellClick(cell.x, cell.y)"
      >
        <span>{{ getCell(cell.x, cell.y)?.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fafafa;
  touch-action: none;
}

.world {
  position: absolute;
  will-change: transform;
  width: max-content;
  height: max-content;
}

.cell {
  position: absolute;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: 600;
  background: white;
  user-select: none;
}

.cell.rounded-up-border,
.cell.rounded-bottom-border,
.cell.left-border {
  justify-content: start;
}

.cell.left-border {
  border-left: 3px solid;
}

.cell.rounded-up-border span {
  display: block;
  width: 40%;
  height: 100%;
  border-left: 3px solid;
  border-top: 3px solid;
  border-top-left-radius: 70%;
  position: relative;
  top: 1px;
  left: -1px;
}

.cell.rounded-bottom-border span {
  display: block;
  width: 40%;
  height: 100%;
  border-left: 3px solid;
  border-bottom: 3px solid;
  border-bottom-left-radius: 70%;
  position: relative;
  top: -1px;
  left: -1px;
}

.cell.strikethrough span {
  text-decoration: line-through;
  text-decoration-color: red;
}

.cell.downed,
.cell.underlined,
.cell.right-border,
.cell.superscript,
.cell.subscript,
.cell.strikethrough,
.cell.left-border,
.cell.colored,
.cell.rounded-up-border,
.cell.rounded-bottom-border {
  z-index: 1;
}

.cell.colored.bg-border-lg.border-solid.black {
  border: 3px solid black !important;
}

.cell.underlined {
  border-bottom: 2px solid black;
}

.cell.right-border {
  border-right: 2px solid black;
}

.cell.superscript,
.cell.subscript {
  justify-content: start;
}

.cell.superscript span {
  font-size: 0.6em;
  position: relative;
  top: -5px;
}

.cell.subscript span {
  font-size: 0.6em;
  position: relative;
  bottom: -5px;
}

.cell.downed span {
  position: relative;
  top: 50%;
}

.cell.downed span {
  position: relative;
  top: 50%;
}

.cell.selected {
  outline: 2px solid #1976d2;
  z-index: 5;
}

.page-frame {
  border: 4px solid #000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  background: white;
}
</style>

<script setup lang="ts">
import { useCamera } from '@/composables/use-camera'
import { useMatrix } from '@/composables/use-matrix'
import { useCellInput } from '@/composables/use-cell-input'

const container = ref<HTMLDivElement | null>(null)

const props = defineProps<{
  rows: number
  cols: number
  cellSize?: number
}>()

const cellSize = props.cellSize ?? 36

const {
  rows,
  cols,
  selected,
  toggleClass,
  removeClasses,
  setCell,
  getCell,
  selectCell,
  serialize,
  deserialize
} = useMatrix(props.rows, props.cols)

const { inputValue } = useCellInput(selected, setCell)

const {
  worldStyle,
  onPointerDown,
  onPointerMove,
  onWheel,
  onPointerUp,
  resetCamera,
  didDrag
} = useCamera(container)

const visibleCells = computed(() => {
  const result = []
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      result.push({ x, y })
    }
  }
  return result
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

const isInside = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < cols && y < rows

function moveSelection(dx: number, dy: number) {
  if (!selected.value) return

  const nx = selected.value.x + dx
  const ny = selected.value.y + dy

  if (!isInside(nx, ny)) return

  selectCell(nx, ny)
}

function advanceAfterInput() {
  if (!selected.value) return

  if (selected.value.x + 1 < cols) {
    moveSelection(1, 0)
  } else if (selected.value.y + 1 < rows) {
    selectCell(0, selected.value.y + 1)
  }
}

function handleInput(value: string) {
  inputValue(value)
  advanceAfterInput()
}

function onKeydown(e: KeyboardEvent) {
  if (!selected.value) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    e.stopPropagation()
  }

  switch (e.key) {
    case 'ArrowRight':
      moveSelection(1, 0)
      break
    case 'ArrowLeft':
      moveSelection(-1, 0)
      break
    case 'ArrowDown':
      moveSelection(0, 1)
      break
    case 'ArrowUp':
      moveSelection(0, -1)
      break
    case 'Enter':
      moveSelection(0, 1)
      break
    case 'Delete':
      backspace()
      break
    case 'Backspace':
      backspace()
      break
    default:
      if (/^[0-9=+./*-]$/.test(e.key)) {
        if (e.key === '/') return handleInput('÷')
        if (e.key === '*') return handleInput('×')
        handleInput(e.key)
      }
  }
}

const pageWidth = computed(() => cols * cellSize)
const pageHeight = computed(() => rows * cellSize)


function backspace () {
  if (!selected.value) return
  const currentCell = getCell(selected.value.x, selected.value.y)
  if (currentCell?.value && currentCell?.value !== '') {
    removeClasses(selected.value.x, selected.value.y)
    setCell(selected.value.x, selected.value.y, '')
  } else {
    moveSelection(-1, 0)
    removeClasses(selected.value.x, selected.value.y)
    setCell(selected.value.x, selected.value.y, '')    
  }
}

function changeClass (value: string) {
  if (!selected.value) return
  toggleClass(selected.value.x, selected.value.y, value)
}

function handleCellClick(x: number, y: number) {
  if (didDrag()) return
  selectCell(x, y)
}

defineExpose({
  changeClass,
  removeClasses,
  backspace,
  handleInput,
  resetCamera,
  serialize,
  deserialize
})
</script>
