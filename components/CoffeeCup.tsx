'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'

type TimePeriod = 'dawn' | 'afternoon' | 'night'

interface CoffeeCupProps {
  period: TimePeriod
  onClick: () => void
  coffeeCount: number
}

export function CoffeeCup({ period, onClick, coffeeCount }: CoffeeCupProps) {
  const [isPouring, setIsPouring] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    setIsPouring(true)
    onClick()
    
    // Reset pouring animation after 3 seconds
    setTimeout(() => {
      setIsPouring(false)
    }, 3000)
  }

  // Cup styling based on time period
  const cupStyles = {
    dawn: {
      cup: '#FFE5CC',
      saucer: '#FFD700',
      coffee: '#8B4513',
      steam: '#FFFFFF'
    },
    afternoon: {
      cup: '#FFF8DC',
      saucer: '#D2691E',
      coffee: '#654321',
      steam: '#FFFFFF'
    },
    night: {
      cup: '#C0C0C0',
      saucer: '#A0A0A0',
      coffee: '#2F1B14',
      steam: '#FFFACD'
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Coffee Cup Container */}
      <div 
        className={`
          relative cursor-pointer transition-all duration-300 transform
          ${isHovered ? 'scale-110 rotate-1' : 'scale-100'}
          ${isPouring ? 'animate-pulse' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Steam Effect */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute opacity-60 animate-bounce
                w-1 h-8 rounded-full
                ${period === 'night' ? 'bg-yellow-200' : 'bg-white'}
              `}
              style={{
                left: `${i * 8 - 8}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Coffee Cup SVG */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="drop-shadow-lg"
        >
          {/* Saucer */}
          <ellipse
            cx="60"
            cy="100"
            rx="45"
            ry="8"
            fill={cupStyles[period].saucer}
            className="opacity-80"
          />
          
          {/* Cup Body */}
          <path
            d="M25 45 Q25 85 60 85 Q95 85 95 45 L90 35 Q90 25 60 25 Q30 25 30 35 Z"
            fill={cupStyles[period].cup}
            stroke={cupStyles[period].saucer}
            strokeWidth="2"
          />
          
          {/* Coffee Surface */}
          <ellipse
            cx="60"
            cy="35"
            rx="28"
            ry="6"
            fill={cupStyles[period].coffee}
            className={isPouring ? 'animate-pulse' : ''}
          />
          
          {/* Cup Handle */}
          <path
            d="M95 50 Q110 50 110 65 Q110 80 95 80"
            fill="none"
            stroke={cupStyles[period].saucer}
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Pouring Animation Coffee */}
          {isPouring && (
            <path
              d="M60 35 Q65 20 70 10"
              fill="none"
              stroke={cupStyles[period].coffee}
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-bounce"
            />
          )}
        </svg>

        {/* Decorative Elements around Cup */}
        <div className="absolute -bottom-4 -left-8">
          <div 
            className={`
              w-3 h-3 rounded-full opacity-60
              ${period === 'dawn' ? 'bg-amber-300' : 
                period === 'afternoon' ? 'bg-orange-400' : 'bg-gray-300'}
            `}
          />
        </div>
        <div className="absolute -bottom-2 -right-6">
          <div 
            className={`
              w-2 h-2 rounded-full opacity-40
              ${period === 'dawn' ? 'bg-amber-300' : 
                period === 'afternoon' ? 'bg-orange-400' : 'bg-gray-300'}
            `}
          />
        </div>

        {/* Small Spoon */}
        <div className="absolute bottom-4 right-8 transform rotate-45">
          <div 
            className={`
              w-8 h-1 rounded-full
              ${period === 'night' ? 'bg-gray-300' : 'bg-amber-600'}
            `}
          />
          <div 
            className={`
              w-2 h-3 rounded-full -mt-1 ml-6
              ${period === 'night' ? 'bg-gray-300' : 'bg-amber-600'}
            `}
          />
        </div>
      </div>

      {/* Coffee Counter */}
      <Card className="mt-8 bg-white/80 backdrop-blur-sm">
        <div className="px-4 py-2 text-center">
          <p className="text-sm text-gray-600 font-mono">
            今日咖啡: {coffeeCount} 杯
          </p>
        </div>
      </Card>

      {/* Interaction Hint */}
      {!isHovered && coffeeCount === 0 && (
        <div className="mt-4 text-center">
          <p className="text-white/70 text-sm font-handwriting animate-pulse">
            點擊品嚐一杯咖啡
          </p>
        </div>
      )}
    </div>
  )
}