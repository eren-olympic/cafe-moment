'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRight, ChevronLeft, Send } from 'lucide-react'

type TimePeriod = 'dawn' | 'afternoon' | 'night'

interface Message {
  id: string
  content: string
  timestamp: Date
  visitorName: string
}

interface MessageBoardProps {
  period: TimePeriod
}

// 詩意的訪客名稱池
const visitorNames = [
  '路過的貓', '午後的風', '夜晚的星', '晨光中的鳥', '雨後的虹',
  '靜謐的湖', '漂泊的雲', '溫暖的光', '輕柔的雨', '深夜的月',
  '咖啡香氣', '書頁翻動', '時光旅人', '微笑的陌生人', '遠方來客',
  '黃昏散步者', '清晨跑者', '夢中訪客', '城市漫遊者', '靜心的人'
]

// 預設的溫暖留言
const defaultMessages: Message[] = [
  {
    id: '1',
    content: '這裡真的很溫暖，就像回到家一樣。',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    visitorName: '路過的貓'
  },
  {
    id: '2', 
    content: '咖啡的香氣讓我想起了童年的午後。',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    visitorName: '午後的風'
  },
  {
    id: '3',
    content: '在這裡找到了久違的寧靜。',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    visitorName: '夜晚的星'
  }
]

export function MessageBoard({ period }: MessageBoardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState<Message[]>(defaultMessages)
  const [newMessage, setNewMessage] = useState('')
  const [canSendMessage, setCanSendMessage] = useState(true)

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('cafe-messages')
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      const messagesWithDates = parsed.map((msg: { id: string; content: string; timestamp: string; visitorName: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
      
      // Filter messages from last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const recentMessages = messagesWithDates.filter(
        (msg: Message) => msg.timestamp > oneDayAgo
      )
      
      if (recentMessages.length > 0) {
        setMessages(recentMessages)
      }
    }
  }, [])

  // Check if user can send message (rate limiting)
  useEffect(() => {
    const lastMessageTime = localStorage.getItem('cafe-last-message-time')
    if (lastMessageTime) {
      const timeDiff = Date.now() - parseInt(lastMessageTime)
      const tenMinutes = 10 * 60 * 1000
      
      if (timeDiff < tenMinutes) {
        setCanSendMessage(false)
        const timeLeft = tenMinutes - timeDiff
        
        setTimeout(() => {
          setCanSendMessage(true)
        }, timeLeft)
      }
    }
  }, [])

  const getRandomVisitorName = () => {
    return visitorNames[Math.floor(Math.random() * visitorNames.length)]
  }

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (minutes < 1) return '剛剛'
    if (minutes < 60) return `${minutes}分鐘前`
    if (hours < 24) return `${hours}小時前`
    return '很久以前'
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !canSendMessage) return
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      timestamp: new Date(),
      visitorName: getRandomVisitorName()
    }
    
    const updatedMessages = [message, ...messages].slice(0, 20) // Keep only 20 messages
    setMessages(updatedMessages)
    setNewMessage('')
    setCanSendMessage(false)
    
    // Save to localStorage
    localStorage.setItem('cafe-messages', JSON.stringify(updatedMessages))
    localStorage.setItem('cafe-last-message-time', Date.now().toString())
    
    // Reset rate limit after 10 minutes
    setTimeout(() => {
      setCanSendMessage(true)
    }, 10 * 60 * 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`
      fixed right-4 top-1/2 transform -translate-y-1/2 z-30
      transition-all duration-500 ease-in-out
      ${isExpanded ? 'translate-x-0' : 'translate-x-80'}
      sm:translate-x-0
    `}>
      {/* Toggle Button for Mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2
          bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white
          sm:hidden
        `}
      >
        {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>

      {/* Message Board Card */}
      <Card className={`
        w-80 h-96 bg-white/10 backdrop-blur-md border-white/20
        ${period === 'night' ? 'text-gray-100' : 'text-gray-800'}
      `}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-handwriting flex items-center justify-between">
            留言板
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex text-inherit hover:bg-white/10"
            >
              {isExpanded ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 h-full flex flex-col">
          {/* Messages List */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className="bg-white/20 rounded-lg p-3 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2"
                >
                  <p className="text-sm font-handwriting leading-relaxed">
                    {message.content}
                  </p>
                  <div className="mt-2 flex justify-between items-center text-xs opacity-70">
                    <span>{message.visitorName}</span>
                    <span>{formatRelativeTime(message.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="space-y-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="分享你的心情..."
              maxLength={100}
              rows={2}
              className="bg-white/20 border-white/30 text-inherit placeholder:text-inherit/60 font-handwriting resize-none"
              disabled={!canSendMessage}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-60">
                {newMessage.length}/100
              </span>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !canSendMessage}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-inherit border-white/30"
                variant="outline"
              >
                <Send size={14} className="mr-1" />
                發送
              </Button>
            </div>
            {!canSendMessage && (
              <p className="text-xs opacity-60">
                請等待 10 分鐘後再發送留言
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}