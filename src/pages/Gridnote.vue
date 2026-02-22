<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <div class="grid-wrapper" style="height: 500px; overflow: hidden;">
          <grid-page :rows="36" :cols="28" ref="gridRef" />
        </div>
          <v-chip-group filter>
            <v-chip>Page 1</v-chip>
            <v-chip>Page 2</v-chip>
            <v-chip>Page 3</v-chip>
            <v-chip>Page 4</v-chip>
            <v-chip>Page 5</v-chip>
            <v-chip>Page 6</v-chip>
            <v-chip>Page 7</v-chip>
            <v-chip>Page 8</v-chip>
            <v-chip>Page 9</v-chip>
            <v-chip>Page 10</v-chip>
            <v-chip>Page 11</v-chip>
            <v-chip>Page 12</v-chip>
            <v-chip>Page 13</v-chip>
            <v-chip>Page 14</v-chip>
            <v-chip>Page 15</v-chip>
            <v-chip>Page 16</v-chip>
            <v-chip>+</v-chip>
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
              <v-container class="bg-primary-darken-1">
                <v-row no-gutters>
                  <v-col
                    v-for="n in classes"
                    :key="n"
                    cols="3"
                    class="mb-4 text-center"
                  >
                    <v-btn @click="handleClass(classesDict[n])" class="text-h5 pr-1" size="large" icon>{{n}}</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div class="bg-blue-grey-darken-3 d-flex flex-column" style="min-width: 32px;">
              <div class="add-button">≤</div>
              <div class="add-button">ƒ</div>
              <div class="add-button">∑</div>
              <div class="add-button">√</div>
              <div class="add-button">Δ</div>
              <div class="add-button">∫</div>
              <div class="add-button">π</div>
              <div class="add-button">[ ]</div>
              <div class="add-button bg-yellow-darken-2">🖌</div>
              <div class="add-button bg-yellow-darken-2">💾</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

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
</style>

<script lang="ts" setup>

import GridPage from '@/components/Grid-Page.vue'

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

const additionalButtons = [
  '≠', '<', '>', '≈',
  '≤', '≥', '±'
]

const functionsButtons = [
  'ƒ', 'a', 'b', 'c',
  'd', 'x', 'y', 'z' 
]

const statsButton = [
  '∑', '∏'
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

const brackets = [
  '[', ']'
]

const classes = [
  '🡇', '_', '▕', 'ᵺ',
  '⎧', '⎩', '▏', 'ⁱ', 
  '🖌'
]

const classesDict = {
  '🡇': 'downed',
  '_': 'underlined',
  '▕': 'right-border',
  'ᵺ': 'strikethrough',
  'ⁱ': 'superscript',
  '▏': 'left-border',
  '🖌': 'colored',
  '⎧': 'rounded-up-border',
  '⎩': 'rounded-bottom-border'
}

</script>
