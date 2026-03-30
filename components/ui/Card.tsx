import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tile?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, tile = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          tile && 'tile-card',
          !tile && 'bg-white rounded-xl p-6 shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
