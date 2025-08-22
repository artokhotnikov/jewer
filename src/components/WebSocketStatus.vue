<template>
  <div class="websocket-status">
    <div
      class="status-indicator"
      :class="{ connected: websocket.isConnected, connecting: websocket.isConnecting }"
    >
      {{ statusText }}
    </div>
    <div v-if="websocket.error" class="error-message">
      {{ websocket.error }}
    </div>
    <div class="connection-info">
      <span>Сообщений: {{ websocket.messages.length }}</span>
      <span v-if="lastMessage" class="last-message">
        Последнее: {{ formatTime(lastMessage.timestamp) }}
      </span>
    </div>
    <div class="actions">
      <button @click="sendTest" :disabled="!websocket.isConnected" class="test-btn">Тест</button>
      <button @click="showStats" class="stats-btn">Статистика</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWebSocketStore } from '@/stores/websocket.ts'

const websocket = useWebSocketStore()

const statusText = computed(() => {
  if (websocket.isConnected) return 'Подключено'
  if (websocket.isConnecting) return 'Подключение...'
  return 'Отключено'
})

const lastMessage = computed(() => websocket.getLastMessage())

// Форматирование времени
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

// Отправка тестового сообщения
const sendTest = () => {
  websocket.sendTestMessage()
}

// Показать статистику соединения
const showStats = () => {
  const stats = websocket.getConnectionStats()
  console.log('WebSocket статистика:', stats)
  alert(
    `Статистика WebSocket:\nПодключен: ${stats.isConnected}\nСообщений: ${stats.messageCount}\nОшибок: ${stats.error || 'нет'}`,
  )
}
</script>

<style scoped>
.websocket-status {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  z-index: 1000;
}

.status-indicator {
  font-weight: bold;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  text-align: center;
}

.status-indicator.connected {
  background: #28a745;
}

.status-indicator.connecting {
  background: #ffc107;
  color: #212529;
}

.status-indicator:not(.connected):not(.connecting) {
  background: #dc3545;
}

.error-message {
  background: #dc3545;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 12px;
}

.connection-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  opacity: 0.8;
}

.last-message {
  font-style: italic;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 5px;
}

.test-btn,
.stats-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.test-btn {
  background: #28a745;
  color: white;
}

.test-btn:hover:not(:disabled) {
  background: #1e7e34;
}

.test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats-btn {
  background: #17a2b8;
  color: white;
}

.stats-btn:hover {
  background: #138496;
}
</style>
