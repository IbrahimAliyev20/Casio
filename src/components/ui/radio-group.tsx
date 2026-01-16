"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          role="radiogroup"
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(RadioGroupContext)
    const checked = selectedValue === value

    return (
      <label
        className={cn(
          "flex items-center gap-3 p-4 border border-[#E5E5EA] rounded-[2px] cursor-pointer hover:bg-gray-50 transition-colors",
          checked && "border-black",
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="radio"
            value={value}
            checked={checked}
            onChange={() => onValueChange?.(value)}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 transition-colors",
              checked
                ? "border-black bg-black"
                : "border-[#85858C] bg-transparent"
            )}
          >
            {checked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </div>
        </div>
        <span className="text-base text-black font-medium flex-1">
          {children}
        </span>
      </label>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
