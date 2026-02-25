import type { Ref } from 'vue'

export function useCamera(container: Ref<HTMLElement | null>) {
  const zoom = ref(1)
  const offset = reactive({ x: 0, y: 0 })

  const resetCamera = () => {
    zoom.value = 1
    offset.x = 0
    offset.y = 0
    lastX = 0
    lastY = 0
    initialDistance = 0
    initialZoom = 1
    activePointers.clear()
    didDrag = false
  }

  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max)

  const worldStyle = computed(() => ({
    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom.value})`,
    transformOrigin: '0 0'
  }))

  /* ----------------- PAN + PINCH ----------------- */

  const activePointers = new Map<number, PointerEvent>()

  let lastX = 0
  let lastY = 0
  let initialDistance = 0
  let initialZoom = 1

  const getDistance = (a: PointerEvent, b: PointerEvent) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

  let dragStartX = 0
  let dragStartY = 0
  let didDrag = false

  const onPointerDown = (e: PointerEvent) => {
    activePointers.set(e.pointerId, e)

    dragStartX = e.clientX
    dragStartY = e.clientY
    didDrag = false

    if (activePointers.size === 1) {
      lastX = e.clientX
      lastY = e.clientY
    }

    if (activePointers.size === 2) {
      const [a, b] = [...activePointers.values()]
      if (a === undefined || b === undefined) return
      initialDistance = getDistance(a, b)
      initialZoom = zoom.value
    }
  }

  const onWheel = (e: WheelEvent) => {
    if (!container?.value) return

    e.preventDefault()

    const rect = container.value.getBoundingClientRect()

    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top

    // smooth zoom factor
    const factor = e.deltaY < 0 ? 1.1 : 0.9

    const newZoom = clamp(zoom.value * factor, 0.5, 4)
    const scale = newZoom / zoom.value

    offset.x = cx - (cx - offset.x) * scale
    offset.y = cy - (cy - offset.y) * scale

    zoom.value = newZoom
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!activePointers.has(e.pointerId)) return
    activePointers.set(e.pointerId, e)

    // PINCH
    if (activePointers.size === 2) {
      const [a, b] = [...activePointers.values()]
      if (a === undefined || b === undefined) return
      const newDistance = getDistance(a, b)
      const factor = newDistance / initialDistance

      const rect = container.value?.getBoundingClientRect()
      if (!rect) return

      const cx = (a.clientX + b.clientX) / 2 - rect.left
      const cy = (a.clientY + b.clientY) / 2 - rect.top

      const newZoom = clamp(initialZoom * factor, 0.5, 4)
      const scale = newZoom / zoom.value

      offset.x = cx - (cx - offset.x) * scale
      offset.y = cy - (cy - offset.y) * scale

      zoom.value = newZoom
      return
    }

    // PAN
    if (activePointers.size === 1) {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY

      if (Math.abs(e.clientX - dragStartX) > 4 ||
          Math.abs(e.clientY - dragStartY) > 4) {
        didDrag = true
      }

      offset.x += dx
      offset.y += dy

      lastX = e.clientX
      lastY = e.clientY
    }
  }

  const onPointerUp = (e: PointerEvent) => {
    activePointers.delete(e.pointerId)
    if (activePointers.size < 2) initialDistance = 0
  }

  return {
    zoom,
    offset,
    worldStyle,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    resetCamera,
    didDrag: () => didDrag
  }
}
