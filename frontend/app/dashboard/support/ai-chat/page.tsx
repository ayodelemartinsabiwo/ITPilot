'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MessageSquare, Send, Bot, User, Sparkles, Clock, TrendingUp, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export default function AIChatSupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'I\'m here to help! Our AI is currently in development.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Chat Support</h1>
          <p className="text-gray-600 mt-1">Get instant help from our AI-powered support assistant</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Sparkles className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Chats</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-orange-600">~2s</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
                <p className="text-3xl font-bold text-purple-600">98%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-orange-500" />
                <CardTitle>AI Support Assistant</CardTitle>
                <Badge className="bg-green-500 text-white">Online</Badge>
              </div>
              <Button variant="outline" size="sm">Clear Chat</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                  <p className="text-lg font-medium">Start a conversation</p>
                  <p className="text-sm mt-2">Ask me anything about IT support, troubleshooting, or system issues</p>
                  <div className="mt-6 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full max-w-md mx-auto block text-left"
                      onClick={() => setInputMessage('How do I reset my password?')}
                    >
                      How do I reset my password?
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full max-w-md mx-auto block text-left"
                      onClick={() => setInputMessage('My computer is running slow')}
                    >
                      My computer is running slow
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full max-w-md mx-auto block text-left"
                      onClick={() => setInputMessage('I can\'t connect to the network')}
                    >
                      I can't connect to the network
                    </Button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                        {message.sender === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className={`rounded-lg p-4 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p>{message.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-2">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar - Quick Actions & Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-700">Common Issues</h3>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Password Reset
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Network Issues
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Software Installation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Email Problems
              </Button>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <h3 className="font-semibold text-sm text-gray-700">AI Capabilities</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>24/7 instant responses</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Troubleshooting guidance</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Escalate to human support</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Multi-language support</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <User className="w-4 h-4 mr-2" />
                Talk to Human Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Conversations</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No previous conversations</p>
            <p className="text-sm mt-2">Your chat history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
