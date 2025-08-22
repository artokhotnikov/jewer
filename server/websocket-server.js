import WebSocket from 'ws'

// Создаем WebSocket сервер на порту 8080
const wss = new WebSocket.Server({ port: 8080 })

console.log('🚀 WebSocket сервер запущен на порту 8080')

// Храним все активные соединения с метаданными
const clients = new Map() // ws -> { id, timestamp, userAgent }

// Генерируем уникальный ID для клиента
const generateClientId = () => Math.random().toString(36).substr(2, 9)

// Отправка сообщения всем подключенным клиентам
const broadcastToAll = (message, excludeClient = null) => {
  const messageStr = JSON.stringify(message)
  let sentCount = 0

  clients.forEach((clientInfo, client) => {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      try {
        client.send(messageStr)
        sentCount++
        console.log(`📤 Отправлено клиенту ${clientInfo.id}:`, message.type)
      } catch (error) {
        console.error(`❌ Ошибка отправки клиенту ${clientInfo.id}:`, error.message)
      }
    }
  })

  console.log(`📡 Broadcast: ${sentCount} клиентов получили сообщение типа "${message.type}"`)
}

// Отправка системного сообщения
const sendSystemMessage = (type, data = {}) => {
  const systemMessage = {
    type: 'system',
    subtype: type,
    data: data,
    timestamp: Date.now(),
    activeConnections: clients.size,
  }

  broadcastToAll(systemMessage)
  console.log(`🔔 Системное сообщение "${type}":`, data)
}

// Обработка подключения нового клиента
wss.on('connection', (ws, req) => {
  const clientId = generateClientId()
  const clientInfo = {
    id: clientId,
    timestamp: Date.now(),
    userAgent: req.headers['user-agent'] || 'Unknown',
    ip: req.socket.remoteAddress,
  }

  clients.set(ws, clientInfo)

  console.log(`✅ Новый клиент подключился: ${clientId}`)
  console.log(`   IP: ${clientInfo.ip}`)
  console.log(`   User-Agent: ${clientInfo.userAgent}`)
  console.log(`   Всего клиентов: ${clients.size}`)

  // Отправляем приветственное сообщение
  const welcomeMessage = {
    type: 'welcome',
    message: 'Добро пожаловать в WebSocket чат!',
    clientId: clientId,
    timestamp: Date.now(),
    totalClients: clients.size,
  }

  ws.send(JSON.stringify(welcomeMessage))

  // Уведомляем всех остальных клиентов о новом подключении
  const newClientNotification = {
    type: 'client_connected',
    clientId: clientId,
    timestamp: Date.now(),
    totalClients: clients.size,
  }

  broadcastToAll(newClientNotification, ws)

  // Обработка сообщений от клиента
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data)
      console.log(`📨 Получено от клиента ${clientId}:`, message)

      // Добавляем метаданные к сообщению
      const enrichedMessage = {
        ...message,
        clientId: clientId,
        timestamp: Date.now(),
        serverTimestamp: Date.now(),
      }

      // Отправляем эхо отправителю
      const echoMessage = {
        type: 'echo',
        originalData: message,
        clientId: clientId,
        timestamp: Date.now(),
        serverMessage: 'Сообщение получено сервером',
      }

      ws.send(JSON.stringify(echoMessage))

      // Отправляем сообщение всем остальным клиентам
      const broadcastMessage = {
        type: 'broadcast',
        originalData: message,
        clientId: clientId,
        timestamp: Date.now(),
        serverMessage: 'Сообщение от другого клиента',
      }

      broadcastToAll(broadcastMessage, ws)
    } catch (error) {
      console.log(`📝 Получено текстовое сообщение от клиента ${clientId}:`, data.toString())

      // Эхо для текстовых сообщений
      const echoMessage = {
        type: 'echo',
        originalData: data.toString(),
        clientId: clientId,
        timestamp: Date.now(),
        serverMessage: 'Текстовое сообщение получено сервером',
      }

      ws.send(JSON.stringify(echoMessage))

      // Broadcast текстового сообщения
      const broadcastMessage = {
        type: 'broadcast',
        originalData: data.toString(),
        clientId: clientId,
        timestamp: Date.now(),
        serverMessage: 'Текстовое сообщение от другого клиента',
      }

      broadcastToAll(broadcastMessage, ws)
    }
  })

  // Обработка отключения клиента
  ws.on('close', (code, reason) => {
    const clientInfo = clients.get(ws)
    clients.delete(ws)

    console.log(`❌ Клиент отключился: ${clientInfo?.id}`)
    console.log(`   Код: ${code}, Причина: ${reason || 'не указана'}`)
    console.log(`   Всего клиентов: ${clients.size}`)

    // Уведомляем остальных клиентов об отключении
    if (clientInfo) {
      const disconnectNotification = {
        type: 'client_disconnected',
        clientId: clientInfo.id,
        timestamp: Date.now(),
        totalClients: clients.size,
      }

      broadcastToAll(disconnectNotification)
    }
  })

  // Обработка ошибок
  ws.on('error', (error) => {
    const clientInfo = clients.get(ws)
    console.error(`💥 WebSocket ошибка у клиента ${clientInfo?.id}:`, error.message)
  })
})

// Периодическая отправка системных сообщений
setInterval(() => {
  if (clients.size > 0) {
    sendSystemMessage('heartbeat', {
      message: 'Сервер работает',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  }
}, 30000) // Каждые 30 секунд

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Завершение работы сервера...')

  // Отправляем сообщение о выключении всем клиентам
  sendSystemMessage('shutdown', { message: 'Сервер выключается' })

  // Закрываем все соединения
  clients.forEach((clientInfo, client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1000, 'Server shutdown')
    }
  })

  wss.close(() => {
    console.log('✅ WebSocket сервер остановлен')
    process.exit(0)
  })
})

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error('💥 Необработанная ошибка:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Необработанное отклонение промиса:', reason)
})
