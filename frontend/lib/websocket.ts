import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export type WebSocketEvent =
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'ticket_update'
  | 'device_update'
  | 'chat_message'
  | 'notification'
  | 'system_alert'

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
}

class WebSocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventHandlers: Map<WebSocketEvent, Set<Function>> = new Map()

  constructor() {
    this.initializeEventHandlers()
  }

  private initializeEventHandlers() {
    const events: WebSocketEvent[] = [
      'connect',
      'disconnect',
      'error',
      'ticket_update',
      'device_update',
      'chat_message',
      'notification',
      'system_alert',
    ]

    events.forEach(event => {
      this.eventHandlers.set(event, new Set())
    })
  }

  connect(token?: string) {
    if (this.socket?.connected) {
      console.log('WebSocket already connected')
      return
    }

    const socketToken = token || localStorage.getItem('access_token')

    if (!socketToken) {
      console.warn('No authentication token available for WebSocket connection')
      return
    }

    try {
      this.socket = io(WS_URL, {
        auth: {
          token: socketToken,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      })

      this.setupSocketListeners()
      console.log('WebSocket connection initiated')
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      toast.error('Failed to establish real-time connection')
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id)
      this.reconnectAttempts = 0
      this.emit('connect', { id: this.socket?.id })
      toast.success('Real-time connection established')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      this.emit('disconnect', { reason })

      if (reason === 'io server disconnect') {
        // Server disconnected the socket, try to reconnect manually
        this.socket?.connect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.reconnectAttempts++

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Failed to establish real-time connection')
        this.emit('error', { error: error.message })
      }
    })

    // Business logic events
    this.socket.on('ticket_update', (data: WebSocketMessage) => {
      console.log('Ticket update received:', data)
      this.emit('ticket_update', data.payload)

      if (data.payload.notify) {
        toast.info(`Ticket #${data.payload.id} updated: ${data.payload.status}`)
      }
    })

    this.socket.on('device_update', (data: WebSocketMessage) => {
      console.log('Device update received:', data)
      this.emit('device_update', data.payload)

      if (data.payload.critical) {
        toast.warning(`Device alert: ${data.payload.name}`)
      }
    })

    this.socket.on('chat_message', (data: WebSocketMessage) => {
      console.log('Chat message received:', data)
      this.emit('chat_message', data.payload)
    })

    this.socket.on('notification', (data: WebSocketMessage) => {
      console.log('Notification received:', data)
      this.emit('notification', data.payload)

      const { title, message, type = 'info' } = data.payload

      switch (type) {
        case 'success':
          toast.success(title, { description: message })
          break
        case 'error':
          toast.error(title, { description: message })
          break
        case 'warning':
          toast.warning(title, { description: message })
          break
        default:
          toast.info(title, { description: message })
      }
    })

    this.socket.on('system_alert', (data: WebSocketMessage) => {
      console.log('System alert received:', data)
      this.emit('system_alert', data.payload)
      toast.error(data.payload.message, {
        duration: 10000,
      })
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      console.log('WebSocket disconnected manually')
    }
  }

  on(event: WebSocketEvent, handler: Function) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.add(handler)
    }
  }

  off(event: WebSocketEvent, handler: Function) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  private emit(event: WebSocketEvent, data: any) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in ${event} handler:`, error)
        }
      })
    }
  }

  send(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Cannot send message: WebSocket not connected')
      toast.error('Real-time connection unavailable')
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocketId(): string | undefined {
    return this.socket?.id
  }
}

// Singleton instance
const wsManager = new WebSocketManager()

export default wsManager
