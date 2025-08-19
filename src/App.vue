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
writeCssVars()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <transition name="fade" mode="out-in">
        <suspense>
          <div>
            <component :is="Component" />

            <transition name="fade" appear>
              <clear-handler v-if="fs.hasAccess" />

              <access-handler v-else />
            </transition>
          </div>
        </suspense>
      </transition>
    </template>
  </RouterView>
</template>
