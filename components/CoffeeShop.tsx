'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Volume2, VolumeX } from 'lucide-react'
import { CoffeeCup } from './CoffeeCup'
import { MessageBoard } from './MessageBoard'

type TimePeriod = 'dawn' | 'afternoon' | 'night'

export function CoffeeShop() {
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>('afternoon')
  const [isMuted, setIsMuted] = useState(false)
  const [coffeeCount, setCoffeeCount] = useState(0)

  // Smart time detection based on local time
  useEffect(() => {
    const detectCurrentPeriod = (): TimePeriod => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 11) return 'dawn'
      if (hour >= 11 && hour < 18) return 'afternoon'
      return 'night'
    }

    setCurrentPeriod(detectCurrentPeriod())
  }, [])

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedMuted = localStorage.getItem('cafe-sound-muted')
    const savedCoffeeCount = localStorage.getItem('cafe-coffee-count')
    const lastDate = localStorage.getItem('cafe-last-date')
    const today = new Date().toDateString()

    if (savedMuted) {
      setIsMuted(JSON.parse(savedMuted))
    }

    // Reset coffee count daily
    if (lastDate !== today) {
      localStorage.setItem('cafe-last-date', today)
      localStorage.setItem('cafe-coffee-count', '0')
      setCoffeeCount(0)
    } else if (savedCoffeeCount) {
      setCoffeeCount(parseInt(savedCoffeeCount))
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('cafe-sound-muted', JSON.stringify(isMuted))
  }, [isMuted])

  useEffect(() => {
    localStorage.setItem('cafe-coffee-count', coffeeCount.toString())
  }, [coffeeCount])

  const handlePeriodChange = (period: TimePeriod) => {
    setCurrentPeriod(period)
  }

  const handleCoffeeClick = () => {
    setCoffeeCount(prev => prev + 1)
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  // Color schemes for different periods
  const periodStyles = {
    dawn: {
      background: 'linear-gradient(135deg, #FFE5CC 0%, #FFD700 100%)',
      text: '#8B4513',
      accent: '#87CEEB'
    },
    afternoon: {
      background: 'linear-gradient(135deg, #FFF8DC 0%, #D2691E 100%)',
      text: '#8B4513',
      accent: '#8B4513'
    },
    night: {
      background: 'linear-gradient(135deg, #191970 0%, #000080 100%)',
      text: '#C0C0C0',
      accent: '#FFFACD'
    }
  }

  const periodNames = {
    dawn: '清晨',
    afternoon: '午後',
    night: '深夜'
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-all duration-1000 ease-in-out"
      style={{ background: periodStyles[currentPeriod].background }}
    >
      {/* Time Period Selector */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex gap-4 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
          {(['dawn', 'afternoon', 'night'] as TimePeriod[]).map((period) => (
            <Button
              key={period}
              variant={currentPeriod === period ? 'default' : 'ghost'}
              onClick={() => handlePeriodChange(period)}
              className={`
                px-6 py-2 rounded-full font-serif text-lg transition-all duration-300
                ${currentPeriod === period 
                  ? 'bg-white/90 text-gray-800 shadow-lg scale-105' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {periodNames[period]}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Scene */}
        <div className="absolute inset-0 opacity-30">
          {/* Scene elements will be added here */}
        </div>

        {/* Coffee Cup - Main Interactive Element */}
        <div className="relative z-10">
          <CoffeeCup 
            period={currentPeriod}
            onClick={handleCoffeeClick}
            coffeeCount={coffeeCount}
          />
        </div>

        {/* Coffee Count Warning */}
        {coffeeCount >= 5 && (
          <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-20">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 font-handwriting">
                  也許該休息一下了... ☕
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Message Board */}
      <MessageBoard period={currentPeriod} />

      {/* Footer Controls */}
      <div className="fixed bottom-8 left-8 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
      </div>

      <div className="fixed bottom-8 right-8 z-20">
        <Button
          variant="ghost"
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm"
        >
          關於
        </Button>
      </div>
    </div>
  )
}