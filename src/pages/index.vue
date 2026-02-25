<template>
  <div class="bg-black vh-100 d-flex flex-column">
    <div class="text-center w-100 mt-4">
      <v-btn :disabled="active === 0" variant="text" icon="mdi-email" />
      <v-btn @click="goToNote" variant="text" icon="mdi-fullscreen" />
      <v-btn variant="text" icon="mdi-view-grid" />
      <v-btn :disabled="active === 0" variant="text" icon="mdi-information-outline" />
    </div>
    <div class="carousel-wrapper w-100">
      <v-slide-group
        v-model="active"
        center-active
        show-arrows
        class="py-6 w-100"
      >
        <v-slide-group-item v-slot="{ isSelected }" >
          <v-card
            class="pa-4"
            :class="[
              'carousel-item bg-transparent text-center ',
              { 'carousel-item--active': isSelected }
            ]"
            elevation="4"
            @click="active = 0"
          >
            <div class="bg-transparent pa-4" style="border: 2px dashed white;">
              <v-img
                class="align-center"
                height="50vh"
                cover
              >
                <v-icon size="15vh" color="white">mdi-plus</v-icon>
              </v-img>
            </div>
            <div class="mt-4">
              <div>Ajoute un noveau cahier</div>
              <v-btn @click="router.push('/gridnote/new')" class="mt-2 mb-2" variant="outlined">Créer</v-btn>
            </div>
          </v-card>
        </v-slide-group-item>
        <v-slide-group-item
          v-for="(item, index) in items"
          :key="item.id ?? 'new'"
          v-slot="{ isSelected }"
        >
          <v-card
            class="pa-4"
            :class="[
              'carousel-item bg-transparent text-center ',
              { 'carousel-item--active': isSelected }
            ]"
            elevation="4"
            @click="active = index + 1"
          >
            <div class="bg-white pa-4">
              <v-img
                :src="item.cover"
                class="border-md bg-white"
                height="50vh"
                contain
              />
            </div>
            <div class="mt-4">
              <div>{{ item.fileName }}</div>
              <div>{{ item.pages }} page<span v-if="item.pages > 1">s</span></div>
              <v-btn @click="router.push(`/gridnote/${item.id ?? 'new'}`)" class="mt-2 mb-2" variant="outlined">Ouvrir</v-btn>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </div>
  </div>
</template>

<style scoped>
.carousel-wrapper {
  margin: auto;
}

.carousel-item {
  width: 360px;
  transition: all 0.3s ease;
  opacity: 0.5;
  transform: scale(0.85);
  margin: 0 12px;
}

.v-slide-group__content {
  padding-left: calc(50% - 160px);
  padding-right: calc(50% - 160px);
}

.carousel-item--active {
  opacity: 1;
  transform: scale(1);
}

.vh-100 {
  height: 100vh;
}

</style>

<route lang="yaml">
meta:
  title: Cahier
</route>

<script setup lang="ts">
import useGridnotes from '@/composables/use-database'
import { type Gridnote } from '@/composables/use-database'
const { gridnotes }  = useGridnotes()

const router = useRouter()

const active = ref(0)

onMounted(() => {
  active.value = 0
})

const goToNote = () => {
  if (active.value === 0) {
    router.push('/gridnote/new')
    return
  }
  router.push(`/gridnote/${items.value?.[active.value - 1]?.id ?? 'new'}`)
}

const PAGE_SIZE = 50
const page = ref(0)

const items = ref<Gridnote[]>([])

async function loadMore () {
  const result = await gridnotes
    .offset(page.value * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .toArray()
  items.value.push(...result)
  page.value++
}

loadMore()
</script>
