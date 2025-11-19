import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Re-export the new auth store
export { useAuthStore } from './store/auth'

// Re-export types if needed
export type { User } from './api/services/auth.service'

// UI Store
interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapse: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        sidebarCollapsed: false,
        theme: 'light',
        notifications: [],

        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setTheme: (theme) => set({ theme }),

        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              {
                ...notification,
                id: `notif-${Date.now()}-${Math.random()}`,
                timestamp: new Date(),
                read: false,
              },
              ...state.notifications,
            ].slice(0, 50), // Keep only last 50 notifications
          })),

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'ui-store' }
  )
)

// Dashboard Store
interface DashboardState {
  stats: DashboardStats | null
  recentActivity: Activity[]
  isLoading: boolean
  error: string | null
  setStats: (stats: DashboardStats) => void
  setRecentActivity: (activity: Activity[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface DashboardStats {
  totalTickets: number
  openTickets: number
  closedTickets: number
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  avgResponseTime: number
  satisfactionRate: number
}

interface Activity {
  id: string
  type: 'ticket' | 'device' | 'user' | 'system'
  title: string
  description: string
  timestamp: Date
  user?: string
  icon?: string
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      stats: null,
      recentActivity: [],
      isLoading: false,
      error: null,

      setStats: (stats) => set({ stats, error: null }),

      setRecentActivity: (activity) => set({ recentActivity: activity }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    { name: 'dashboard-store' }
  )
)

// Chat Store
interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversation: (conversation: Conversation | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setLoading: (loading: boolean) => void
}

interface Conversation {
  id: string
  title: string
  lastMessage?: string
  lastMessageAt: Date
  unreadCount: number
}

interface Message {
  id: string
  conversationId: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  isTyping?: boolean
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      conversations: [],
      currentConversation: null,
      messages: [],
      isLoading: false,

      setConversations: (conversations) => set({ conversations }),

      setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

      setMessages: (messages) => set({ messages }),

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'chat-store' }
  )
)

// Filters Store (for devices, tickets, etc.)
interface FiltersState {
  deviceFilters: {
    search: string
    status: string
    type: string
  }
  ticketFilters: {
    search: string
    status: string
    priority: string
    assignee: string
  }
  setDeviceFilters: (filters: Partial<FiltersState['deviceFilters']>) => void
  setTicketFilters: (filters: Partial<FiltersState['ticketFilters']>) => void
  resetDeviceFilters: () => void
  resetTicketFilters: () => void
}

const defaultDeviceFilters = {
  search: '',
  status: '',
  type: '',
}

const defaultTicketFilters = {
  search: '',
  status: '',
  priority: '',
  assignee: '',
}

export const useFiltersStore = create<FiltersState>()(
  devtools(
    (set) => ({
      deviceFilters: defaultDeviceFilters,
      ticketFilters: defaultTicketFilters,

      setDeviceFilters: (filters) =>
        set((state) => ({
          deviceFilters: { ...state.deviceFilters, ...filters },
        })),

      setTicketFilters: (filters) =>
        set((state) => ({
          ticketFilters: { ...state.ticketFilters, ...filters },
        })),

      resetDeviceFilters: () => set({ deviceFilters: defaultDeviceFilters }),

      resetTicketFilters: () => set({ ticketFilters: defaultTicketFilters }),
    }),
    { name: 'filters-store' }
  )
)
