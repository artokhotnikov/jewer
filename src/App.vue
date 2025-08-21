<script lang="ts" setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composable/useTheme.ts'
import { useFsMediaStore } from '@/stores/fsMedia.ts'

import ClearHandler from '@/components/FileSystem/ClearHandler.vue'
import AccessHandler from '@/components/FileSystem/AccessHandler.vue'

const { writeCssVars } = useTheme()
const fs = useFsMediaStore()

onMounted(async () => {
  await fs.tryRestoreOnInit()

  writeCssVars()
})
</script>

<template>
  <div class="page">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <transition name="fade" mode="out-in" class="router-view-transition">
          <suspense>
            <component :is="Component" />
          </suspense>
        </transition>

        <transition name="fade" appear>
          <clear-handler v-if="fs.hasAccess" />

          <access-handler v-else />
        </transition>
      </template>
    </RouterView>
  </div>
</template>

<style scoped>
.page {
  background: linear-gradient(180deg, #b3ad91 8.08%, #e1dcc3 35.58%, #e1dcc3 78.77%, #b3ad91 100%);
  position: relative;
  width: 100vw;
  height: 100vh;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      98.47% 98.47% at 49.62% 50%,
      rgba(55, 69, 36, 0) 9.29%,
      #374524 100%
    );
    pointer-events: none;
  }
}
</style>
