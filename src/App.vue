<script lang="ts" setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composable/useTheme.ts'
import { useFsMediaStore } from '@/stores/fsMedia.ts'
import { useWebSocketStore } from '@/stores/websocket.ts'

import ClearHandler from '@/components/FileSystem/ClearHandler.vue'
import AccessHandler from '@/components/FileSystem/AccessHandler.vue'
import WebSocketStatus from '@/components/WebSocketStatus.vue'

const { writeCssVars } = useTheme()
const fs = useFsMediaStore()
const websocket = useWebSocketStore()

onMounted(async () => {
  await fs.tryRestoreOnInit()

  writeCssVars()

  if (window.WS) {
    console.log('App: Инициализация WebSocket с URL:', window.WS)
    websocket.initialize({
      url: window.WS,
      reconnectAttempts: 5,
      reconnectInterval: 3000,
    })
  } else {
    console.warn('App: window.WS не определен, WebSocket не инициализирован')
  }
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <transition name="fade" mode="out-in">
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

  <!-- Статус WebSocket соединения -->
  <WebSocketStatus />
</template>
