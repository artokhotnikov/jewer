<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import VTitle from '@/components/ui/VTitle.vue'

const route = useRoute()
const galleryName = (route.params.name as string) || 'Галерея'
const galleryIcon = computed(() => `/files/menu/${galleryName}.png`)
</script>

<template>
  <v-title>
    <img :src="galleryIcon" alt="" />

    {{ galleryName }}
  </v-title>
</template>
