import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, required, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={cn('label-text', required && 'label-required')}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'input-field',
            error && 'input-error',
            className
          )}
          {...props}
        />
        {error && (
          <div className="error-message">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
