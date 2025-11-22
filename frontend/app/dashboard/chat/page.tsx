'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Plus,
  MessageSquare,
  Trash2,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { chatAPI } from '@/lib/api'
import { useChatStore } from '@/lib/store'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const {
    currentConversation,
    messages,
    setCurrentConversation,
    setMessages,
    addMessage,
  } = useChatStore()

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      try {
        const response = await chatAPI.getConversations()
        return response.data
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
        return []
      }
    },
    enabled: false, // Disable auto-fetch until backend endpoint is ready
    initialData: [],
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await chatAPI.sendMessage(text, currentConversation?.id)
      return response.data
    },
    onSuccess: (data) => {
      addMessage({
        id: Date.now().toString(),
        conversationId: currentConversation?.id || '',
        content: message,
        sender: 'user',
        timestamp: new Date(),
      })

      setMessage('')
      setIsTyping(true)

      // Simulate AI response
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          conversationId: currentConversation?.id || '',
          content: data.response || 'I understand your request. How can I help you further?',
          sender: 'ai',
          timestamp: new Date(),
        })
        setIsTyping(false)
      }, 1500)

      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (error) => {
      toast.error('Failed to send message')
      setIsTyping(false)
    },
  })

  const handleSendMessage = () => {
    if (!message.trim()) return
    sendMessageMutation.mutate(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button size="sm" variant="ghost" leftIcon={<Plus className="w-4 h-4" />}>
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {conversations?.map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversation(conv)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    currentConversation?.id === conv.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium text-sm truncate">
                      {conv.title}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${
                    currentConversation?.id === conv.id
                      ? 'text-orange-100'
                      : 'text-gray-500'
                  }`}>
                    {conv.lastMessage}
                  </p>
                  <span className={`text-xs ${
                    currentConversation?.id === conv.id
                      ? 'text-orange-200'
                      : 'text-gray-400'
                  }`}>
                    {formatRelativeTime(conv.lastMessageAt)}
                  </span>
                </button>
              ))}

              {(!conversations || conversations.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs">Start chatting to create one</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">ITPilot AI Assistant</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to ITPilot AI Assistant
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                I'm here to help you with IT support, device troubleshooting,
                and answering your technical questions.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'How do I reset my password?',
                  'Check device status',
                  'Create a new ticket',
                  'System diagnostics',
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion)}
                    className="px-4 py-2 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 text-sm transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message List */}
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-gray-800'
                      : 'bg-gradient-to-br from-orange-500 to-orange-600'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      msg.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}
                  >
                    {formatRelativeTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="px-6"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </Card>
    </div>
  )
}
