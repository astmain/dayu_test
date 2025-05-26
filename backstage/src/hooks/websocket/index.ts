import { shallowRef, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from '@/store/modules/user'

interface MessageHandler {
  [messageType: string]: (data: any) => void
}
// 全局 Socket.io 变量（单例）
const socket = shallowRef<Socket | null>(null)
const handlers = shallowRef<MessageHandler>({})
const isConnected = shallowRef(false)
// const url: string = 'ws://127.0.0.1:5000'
const url: string = 'ws://127.0.0.1:8001'
const userId = useUserStore()?.userInfo?.id
const useWebSocket = () => {
  onMounted(() => {
    if (!socket.value) {
      socket.value = io(url, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        forceNew: true,
        timeout: 10000,
        query: {
          userId
        }
      })

      socket.value.on('connect', () => {
        isConnected.value = true
        console.log('Socket.io connected successfully')
        // 发送用户id给客户端
        // sendMessage('user', userId)
      })

      socket.value.on('connect_error', (error) => {
        console.error('Socket.io connection error:', error)
        console.error('Connection details:', {
          url,
          transport: socket.value?.io?.engine?.transport?.name,
          readyState: socket.value?.io?.engine?.readyState
        })
      })

      socket.value.on('disconnect', (reason) => {
        isConnected.value = false
        console.log('Socket.io disconnected, reason:', reason)
      })

      socket.value.onAny((event, data) => {
        console.log('Received event:', event, 'Data:', data)
        if (handlers.value[event]) {
          handlers.value[event](data)
        }
      })
    }
  })

  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  })

  const sendMessage = (event: string, payload: any) => {
    if (socket.value && isConnected.value) {
      console.log('Sending message:', event, payload)
      socket.value.emit(event, payload)
    } else {
      console.warn('Cannot send message: Socket not connected')
    }
  }

  const registerHandler = (event: string, handler: (data: any) => void) => {
    handlers.value[event] = handler
    console.log('Registered handler for event:', event)
  }

  const unregisterHandler = (event: string) => {
    delete handlers.value[event]
    console.log('Unregistered handler for event:', event)
  }

  return { isConnected, sendMessage, registerHandler, unregisterHandler }
}

export default useWebSocket
