import { useState, useRef, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import { Send, Users, Circle } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  isOwn: boolean
}

interface User {
  id: string
  name: string
  isOnline: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'سلام! به اتاق چت خوش آمدید 👋',
      sender: 'مدیر سیستم',
      timestamp: new Date(Date.now() - 300000),
      isOwn: false
    },
    {
      id: '2',
      text: 'چطورید؟ امیدوارم روز خوبی داشته باشید',
      sender: 'علی احمدی',
      timestamp: new Date(Date.now() - 120000),
      isOwn: false
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [currentUser] = useState('شما')
  const [onlineUsers] = useState<User[]>([
    { id: '1', name: 'مدیر سیستم', isOnline: true },
    { id: '2', name: 'علی احمدی', isOnline: true },
    { id: '3', name: 'فاطمه رضایی', isOnline: true },
    { id: '4', name: 'محمد کریمی', isOnline: false }
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser,
      timestamp: new Date(),
      isOwn: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2)
  }

  return (
    <div className="h-screen bg-background flex flex-col font-['Inter']" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">اتاق چت عمومی</h1>
              <p className="text-sm text-muted-foreground">
                {onlineUsers.filter(u => u.isOnline).length} نفر آنلاین
              </p>
            </div>
          </div>
          
          {/* Online Users */}
          <div className="flex items-center gap-2">
            {onlineUsers.slice(0, 4).map(user => (
              <div key={user.id} className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-secondary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-accent fill-current" />
                )}
              </div>
            ))}
            {onlineUsers.length > 4 && (
              <div className="text-sm text-muted-foreground">
                +{onlineUsers.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex gap-3 max-w-[70%] ${message.isOwn ? 'flex-row' : 'flex-row-reverse'}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {getInitials(message.sender)}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col ${message.isOwn ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {message.sender}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                      message.isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-secondary-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-white px-6 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="پیام خود را بنویسید..."
                className="resize-none border-2 focus:border-primary transition-colors"
                autoFocus
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            برای ارسال پیام Enter را فشار دهید
          </div>
        </div>
      </div>
    </div>
  )
}

export default App