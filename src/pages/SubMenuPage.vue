<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFsMediaStore, type MediaFile } from '@/stores/fsMedia.ts'

import MenuItem from '@/components/helpers/MenuItem.vue'
import EmptyBlock from '@/components/helpers/EmptyBlock.vue'
import BackButton from '@/components/ui/BackButton.vue'

const fs = useFsMediaStore()
const router = useRouter()

const params = useRoute().params
const submenuName = params.name as string
const emptyTitle = `Меню ${submenuName} не заполнено`

const menu = computed(() => fs.byDir.get(submenuName) || [])
const hasMenu = computed(() => Array.isArray(menu.value) && menu.value.length > 0)

const handleClick = (item: MediaFile) => {
  router.push(`/gallery/${item.nameClear}`)
}
</script>

<template>
  <div class="menu">
    <div class="menu-list">
      <menu-item v-if="hasMenu" :menu-items="menu" @click="handleClick" />

      <empty-block v-else :title="emptyTitle" />

      <back-button />
    </div>
  </div>
</template>

<style scoped>
.menu {
  background-color: var(--color-gray);
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 80px 292px 250px;
}

.menu-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  height: 100%;
}
</style>
