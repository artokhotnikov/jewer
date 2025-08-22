import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'

export interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

export interface WebSocketOptions {
  url: string
  reconnectAttempts?: number
  reconnectInterval?: number
}

export const useWebSocketStore = defineStore('websocket', () => {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const messages = ref<WebSocketMessage[]>([])
  const error = ref<string | null>(null)

  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = ref(5)
  const reconnectInterval = ref(3000)
  const isInitialized = ref(false)

  const initialize = (options: WebSocketOptions) => {
    if (isInitialized.value) {
      console.log('WebSocket уже инициализирован')
      return
    }

    maxReconnectAttempts.value = options.reconnectAttempts || 5
    reconnectInterval.value = options.reconnectInterval || 3000
    isInitialized.value = true

    connect(options.url)
  }

  const connect = (url: string) => {
    if (isConnecting.value || isConnected.value) return

    isConnecting.value = true
    error.value = null

    try {
      socket.value = new WebSocket(url)

      socket.value.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        reconnectAttempts.value = 0
        console.log('WebSocket подключен')
      }

      socket.value.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data)

          let messageType = 'message'
          let messageData = parsedData

          switch (parsedData.type) {
            default:
              messageType = 'message'
              messageData = parsedData
          }

          const message: WebSocketMessage = {
            type: messageType,
            data: messageData,
            timestamp: Date.now(),
          }

          messages.value.push(message)
        } catch {
          const message: WebSocketMessage = {
            type: 'text',
            data: event.data,
            timestamp: Date.now(),
          }
          messages.value.push(message)
        }
      }

      socket.value.onclose = (event) => {
        isConnected.value = false
        isConnecting.value = false

        if (!event.wasClean && reconnectAttempts.value < maxReconnectAttempts.value) {
          console.log(
            `WebSocket закрыт, попытка переподключения ${reconnectAttempts.value + 1}/${maxReconnectAttempts.value}`,
          )
          reconnectAttempts.value++
          setTimeout(() => connect(url), reconnectInterval.value)
        } else if (reconnectAttempts.value >= maxReconnectAttempts.value) {
          error.value = 'Превышено количество попыток переподключения'
        }
      }

      socket.value.onerror = (event) => {
        error.value = 'Ошибка WebSocket соединения'
        console.error('WebSocket ошибка:', event)
      }
    } catch (e) {
      error.value = 'Не удалось создать WebSocket соединение'
      isConnecting.value = false
      console.error('Ошибка создания WebSocket:', e)
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close(1000, 'Отключение пользователем')
      socket.value = null
    }
    isConnected.value = false
    isConnecting.value = false
    reconnectAttempts.value = 0
  }

  const sendMessage = (data: any) => {
    if (!socket.value || !isConnected.value) {
      error.value = 'WebSocket не подключен'
      return false
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      socket.value.send(message)

      const sentMessage: WebSocketMessage = {
        type: 'sent',
        data: data,
        timestamp: Date.now(),
      }
      messages.value.push(sentMessage)

      return true
    } catch (e) {
      error.value = 'Ошибка отправки сообщения'
      console.error('Ошибка отправки:', e)
      return false
    }
  }

  const sendJSON = (data: any) => {
    return sendMessage(data)
  }

  const sendText = (text: string) => {
    return sendMessage(text)
  }

  const clearMessages = () => {
    messages.value = []
  }

  const getLastMessages = (count: number = 10) => {
    return messages.value.slice(-count)
  }

  const getMessagesByType = (type: string) => {
    return messages.value.filter((msg) => msg.type === type)
  }

  const getLastMessage = () => {
    return messages.value[messages.value.length - 1]
  }

  const sendTestMessage = () => {
    const testData = {
      type: 'test',
      message: 'Тестовое сообщение от клиента',
      timestamp: Date.now(),
      clientId: Math.random().toString(36).substr(2, 9),
    }

    return sendJSON(testData)
  }

  const getConnectionStats = () => {
    return {
      isConnected: isConnected.value,
      isConnecting: isConnecting.value,
      messageCount: messages.value.length,
      lastMessage: getLastMessage(),
      error: error.value,
      reconnectAttempts: reconnectAttempts.value,
    }
  }

  return {
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    messages: readonly(messages),
    error: readonly(error),
    isInitialized: readonly(isInitialized),

    initialize,
    connect,
    disconnect,
    sendMessage,
    sendJSON,
    sendText,
    clearMessages,
    getLastMessages,
    getMessagesByType,
    getLastMessage,
    sendTestMessage,
    getConnectionStats,
  }
})
