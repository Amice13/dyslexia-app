<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
:root {
  --vh: 1vh;
}

html, body {
  height: 100%;
  margin: 0;
}

.fullscreen {
  height: calc(var(--vh, 1vh) * 100);
}
</style>

<script lang="ts" setup>
function setVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('resize', setVh)
setVh()
</script>
