import { useState } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Avatar, AvatarFallback } from './components/ui/avatar'
import { Send, MessageCircle, Users, Circle } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: {
    username: string
  }
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isActive: boolean
}

function App() {
  // Sample data that would come from Django backend
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      title: 'چت محصول لپ‌تاپ گیمینگ',
      lastMessage: 'آیا این لپ‌تاپ برای بازی مناسب است؟',
      timestamp: new Date(Date.now() - 300000),
      unreadCount: 2,
      isActive: true
    },
    {
      id: '2', 
      title: 'چت محصول گوشی هوشمند',
      lastMessage: 'قیمت نهایی چقدر می‌شود؟',
      timestamp: new Date(Date.now() - 1800000),
      unreadCount: 0,
      isActive: false
    },
    {
      id: '3',
      title: 'چت محصول هدفون بلوتوث',
      lastMessage: 'کیفیت صدا چطور است؟',
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 1,
      isActive: false
    }
  ])

  const [messages] = useState<Message[]>([
    {
      id: '1',
      text: 'سلام، در مورد این محصول سوال داشتم',
      sender: { username: 'علی احمدی' },
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '2',
      text: 'بله، چه سوالی دارید؟',
      sender: { username: 'پشتیبانی' },
      timestamp: new Date(Date.now() - 1500000)
    },
    {
      id: '3',
      text: 'آیا این لپ‌تاپ برای بازی‌های سنگین مناسب است؟',
      sender: { username: 'علی احمدی' },
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: '4',
      text: 'بله، این لپ‌تاپ با کارت گرافیک RTX 4060 برای اکثر بازی‌ها مناسب است',
      sender: { username: 'پشتیبانی' },
      timestamp: new Date(Date.now() - 900000)
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [activeChat, setActiveChat] = useState(chats[0])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'همین الان'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ساعت پیش`
    } else {
      return date.toLocaleDateString('fa-IR')
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    // In real Django app, this would submit to the backend
    console.log('Submitting message:', newMessage)
    setNewMessage('')
  }

  return (
    <div className="h-screen bg-background flex" dir="rtl">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-l border-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            لیست چت‌ها
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {chats.length} چت فعال
          </p>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-secondary/50 ${
                chat.isActive ? 'bg-primary/5 border-r-2 border-r-primary' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {chat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {chat.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(chat.timestamp)}
                  </p>
                </div>
                
                {chat.unreadCount > 0 && (
                  <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-border px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  چت درباره {activeChat.title.replace('چت محصول ', '')}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Circle className="w-2 h-2 text-accent fill-current" />
                  آنلاین
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">2 نفر</span>
            </div>
          </div>
        </div>

        {/* Messages Container - Django Template Style */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div 
            id="chat-box" 
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
            style={{
              border: '1px solid #ccc',
              height: '300px',
              overflowY: 'scroll',
              padding: '10px',
              marginBottom: '10px'
            }}
          >
            {/* Django template loop: {% for msg in messages %} */}
            {messages.map((msg) => (
              <p key={msg.id} className="text-sm leading-relaxed">
                <strong>{msg.sender.username}:</strong> {msg.text}
                <span className="text-xs text-muted-foreground mr-2">
                  {formatTime(msg.timestamp)}
                </span>
              </p>
            ))}
            {/* {% endfor %} */}
          </div>

          {/* Message Input Form - Django Template Style */}
          <div className="border-t border-border bg-white px-6 py-4">
            <form method="post" onSubmit={handleSubmit} className="flex gap-3 items-end">
              {/* {% csrf_token %} - Django CSRF token would go here */}
              <input type="hidden" name="csrfmiddlewaretoken" value="[CSRF_TOKEN]" />
              
              <Input
                type="text"
                name="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="پیام خود را بنویسید"
                className="flex-1 border-2 focus:border-primary transition-colors"
                style={{ width: '80%' }}
                autoFocus
              />
              
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                ارسال
              </Button>
            </form>
            
            <div className="mt-2 text-xs text-muted-foreground">
              برای ارسال پیام Enter را فشار دهید یا روی دکمه ارسال کلیک کنید
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App