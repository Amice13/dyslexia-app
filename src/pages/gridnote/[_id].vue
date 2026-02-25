<template>
  <v-container fluid style="height: 100vh;">
    <v-row>
      <v-col cols="9">
        <div class="grid-wrapper" style="height: calc(100vh - 78px); overflow: hidden;">
          <grid-page :rows="36" :cols="28" ref="gridRef" />
        </div>
        <v-chip-group v-model="currentPage" mandatory filter>
          <v-chip
            v-for="(_, i) in pages"
            :key="`page-${i}`"
            @click="getPage(i)"
          >Page {{ i + 1 }}</v-chip>
          <v-chip @click="addPage()">+</v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="3">
        <v-card class="pa-0">
          <v-card-text class="pa-0 d-flex">
            <div>
              <v-container class="bg-primary">
                <v-row no-gutters>
                  <v-col
                    v-for="n in buttons"
                    :key="n"
                    cols="3"
                    class="mb-4 text-center"
                  >
                    <v-btn @click="handleButton(n)" class="text-h5 pr-1" size="large" icon>{{n}}</v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-if="availableButtons.length > 0" class="bg-primary-darken-1">
                <v-row no-gutters>
                  <v-col
                    v-for="n in availableButtons"
                    :key="n"
                    cols="3"
                    class="mb-4 text-center"
                  >
                    <v-btn @click="handleButton(n)" class="text-h5 pr-1" size="large" icon>{{n}}</v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-if="currentLayout === '🖌'" class="bg-primary-darken-1">
                <v-row no-gutters>
                  <v-col
                    cols="3"
                    class="mb-4 text-center"
                  >
                    <v-btn class="text-h5 pr-1" size="large" icon>
                      🖌
                      <v-menu activator="parent">
                      <v-color-picker
                        @update:modelValue="(e: keyof typeof colors) => handleClass(`colored bg-${colors[e]}`)"
                        :swatches="swatches"
                        :swatches-max-height="240"
                        min-height="220"
                        hide-canvas
                        hide-eye-dropper
                        hide-inputs
                        hide-sliders
                        class="ma-2 custom-color-swatch"
                        show-swatches
                      />
                    </v-menu>
                    </v-btn>
                  </v-col>
                  <v-col
                    v-for="n in classes"
                    :key="n"
                    cols="3"
                    class="mb-4 text-center"
                  >
                    <v-btn @click="handleClass(classesDict[n as keyof typeof classesDict])" class="text-h5 pr-1" size="large" icon>{{n}}</v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-if="currentLayout === '💾'" class="bg-primary-darken-1">
                <v-row no-gutters>
                  <v-col cols="12" class="d-flex justify-space-between">
                    <v-btn prepend-icon="mdi-delete" variant="text">Supprimer</v-btn>
                    <v-btn
                      @click="saveGrid"
                      prepend-icon="mdi-content-save"
                      color="yellow-darken-2"
                      variant="flat"
                    >Sauver</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div class="bg-blue-grey-darken-3 d-flex flex-column" style="min-width: 32px;">
              <div
                v-for="layout in keyboardLayouts"
                @click="currentLayout = layout.value"
                :key="layout.value"
                :class="[layout.value === currentLayout && 'bg-yellow-darken-2']"
                class="add-button"
              >
                {{ layout.value }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  title: Cahier
</route>

<style>
.add-button {
  width: 100%;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.custom-color-swatch .v-color-picker-swatches__color {
  min-height: 48px;
  height: 48px;
}
</style>

<script lang="ts" setup>
import { v7 as uuid } from 'uuid'
import GridPage from '@/components/Grid-Page.vue'
import { toPng } from 'html-to-image'
import useGridnotes from '@/composables/use-database'
import { type Gridnote } from '@/composables/use-database'

const route = useRoute()
const router = useRouter()
const { gridnotes }  = useGridnotes()
const gridRef = ref<InstanceType<typeof GridPage> | null>(null)

function handleButton(value: string) {
  if (value === '⌫') return gridRef?.value?.backspace()
  gridRef?.value?.handleInput(value)
}

function handleClass(value: string) {
  return gridRef?.value?.changeClass(value)
}

const buttons = [
  '(', ')', '%', '÷',
  '7', '8', '9', '×',
  '4', '5', '6', '-',
  '1', '2', '3', '+',
  '0', '.', '⌫', '='
]

const inegalitiesButtons = [
  '≠', '<', '>', '≈',
  '≤', '≥', '±'
]

const functionsButtons = [
  'ƒ', 'a', 'b', 'c',
  'd', 'x', 'y', 'z' 
]

const statsButtons = [
  '∑', '∏', '?', '!'
]

const powerButtons = [
  '√', '∛', '∜'
]

const geometryButtons = [
  '⌀', '∠', '∡', '⦜',
  'Δ', '⊥', '∥', '∦'
]

const integralButtons = [
  '∫', '∬'
]

const symbolButtons = [
  'π', 'e', '∞', '10',
  'l', 'o', 'g', 'n'
]

const bracketButtons = [
  '[', ']'
]

const classes = [
  '⎧', '_', '▕', 
  '🡇', '▏', 'nᕽ', 'nₓ',
  'ᵺ', '⎩',
]

const classesDict = {
  '🡇': 'downed',
  '_': 'underlined',
  '▕': 'right-border',
  'ᵺ': 'strikethrough',
  'nᕽ': 'superscript',
  'nₓ': 'subscript',
  '▏': 'left-border',
  '🖌': 'colored',
  '⎧': 'rounded-up-border',
  '⎩': 'rounded-bottom-border'
}

const keyboardLayouts = [
  { name: 'Inégalités', value: '≤' },
  { name: 'Functions', value: 'ƒ' },
  { name: 'Statistics', value: '∑' },
  { name: 'Racine', value: '√' },
  { name: 'Geometrie', value: 'Δ' },
  { name: 'Integrals', value: '∫' },
  { name: 'Constants', value: 'π' },
  { name: 'Parenthèses', value: '[ ]' },
  { name: 'Styles', value: '🖌' },
  { name: 'Savuer', value: '💾' }
]

const currentLayout = ref<string>('🖌')
const availableButtons = computed<string[]>(() => {
  if (currentLayout.value === '≤') return inegalitiesButtons
  if (currentLayout.value === 'ƒ') return functionsButtons
  if (currentLayout.value === '∑') return statsButtons
  if (currentLayout.value === '√') return powerButtons
  if (currentLayout.value === 'Δ') return geometryButtons
  if (currentLayout.value === '∫') return integralButtons
  if (currentLayout.value === 'π') return symbolButtons
  if (currentLayout.value === '[ ]') return bracketButtons
  return []
})

onMounted(async () => {
  const params = route.params as { _id: string } 
  if (!params?._id || params._id === 'new') {
    const data = gridRef?.value?.serialize()
    if (typeof data !== 'string') return false
    pages.value.push(data)
  } else {
    const currentPages = await gridnotes.get(params._id)
    if (!currentPages) return
    pages.value = [...currentPages.data]
    currentPage.value = pages.value.length ? pages.value.length - 1 : 0
    getPage(currentPage.value)
  }
})

const pages = ref<string[]>([])

const currentPage = ref(pages.value.length ? pages.value.length - 1 : 0)

const addPage = () => {
  const data = gridRef?.value?.serialize()
  pages.value.splice(currentPage.value, 1, data ?? '[]')
  const newData = '[]'
  pages.value.push(newData)
  currentPage.value = pages.value.length - 1
  gridRef?.value?.deserialize('[]')
}

const getPage = (i: number) => {
  if (i !== currentPage.value) {
    const data = gridRef?.value?.serialize()
    pages.value.splice(currentPage.value, 1, data ?? '[]')
    if (!pages.value[currentPage.value]) return
    pages.value[currentPage.value] = data ?? '[]'
    currentPage.value = i
  }
  const page = pages.value[i] ?? '[]'
  gridRef?.value?.deserialize(page)
}

const swatches = [
  ['#F44336', '#E91E63', '#9C27B0', '#673AB7'],
  ['#3F51B5', '#2196F3', '#00BCD4', '#009688'],
  ['#8BC34A', '#4CAF50', '#CDDC39', '#FFEB3B'],
  ['#FFC107', '#FF9800', '#FF5722', '#795548'],
  ['#607D8B', '#9E9E9E', '#000000', '#FFFFFF'],
]

const colors = {
  '#F44336': 'red',
  '#E91E63': 'pink',
  '#9C27B0': 'purple',
  '#673AB7': 'deep-purple',
  '#3F51B5': 'indigo',
  '#2196F3': 'blue',
  '#03A9F4': 'light-blue',
  '#00BCD4': 'cyan',
  '#009688': 'teal',
  '#4CAF50': 'green',
  '#8BC34A': 'light-green',
  '#CDDC39': 'lime',
  '#FFEB3B': 'yellow',
  '#FFC107': 'amber',
  '#FF9800': 'orange',
  '#FF5722': 'deep-orange',
  '#795548': 'brown',
  '#607D8B': 'blue-grey',
  '#9E9E9E': 'grey',
  '#000000': 'black',
  '#FFFFFF': 'border-lg border-solid black'
}

const generateImage = async () => {
  getPage(0)
  gridRef?.value?.resetCamera()
  const node = document.querySelector('.world')
  if (!node) return ''
  const dataUrl = await toPng(node as HTMLElement, {
    width: 28 * 36,
    height: 36 * 36,
    pixelRatio: 1,
    quality: 0.8
  })
  return dataUrl
}

const generateFileName = () => {
  const currentDate = new Date()
  const date = currentDate.toLocaleDateString('sv-SV')
  const dayOfWeek = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' })
  const name = [date, dayOfWeek].join(' - ')
  return name
}

generateFileName()

const saveGrid = async () => {
  getPage(0)
  gridRef?.value?.resetCamera()
  const currentData = gridRef?.value?.serialize()
  pages.value.splice(currentPage.value, 1, currentData as string)
  const params = route.params as { _id?: string }
  const id = (!params._id || params._id === 'new') ? uuid() : params._id
  const data = toRaw(pages.value)
  const fileName = generateFileName()
  const cover = await generateImage()
  const date = new Date().toISOString()
  const numberOfpages = data.length
  const note: Gridnote = ({
    id,
    data,
    fileName,
    cover,
    date,
    pages: numberOfpages
  })
  gridnotes.put(note)
  router.push('/')
}

</script>
