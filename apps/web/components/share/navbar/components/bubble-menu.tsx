"use client"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button"
import {
  cloneElement,
  createContext,
  isValidElement,
  ReactNode,
  useContext,
  useState,
} from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BubbleContext {
  open: boolean
  onToggle(): void
}

const bubbleContext = createContext<BubbleContext>({
  open: false,
  onToggle() {},
})

// ---------------------------------------------------------------------------
// BubbleMenu
// ---------------------------------------------------------------------------

interface BubbleMenuProps {
  open?: boolean
  onToggle?(): void
  children: ReactNode
}

export function BubbleMenu({ open, onToggle, children }: BubbleMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  if (open !== undefined && onToggle) {
    return (
      <bubbleContext.Provider value={{ open, onToggle }}>
        {children}
      </bubbleContext.Provider>
    )
  }

  return (
    <bubbleContext.Provider
      value={{ open: isOpen, onToggle: () => setIsOpen((v) => !v) }}
    >
      {children}
    </bubbleContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// BubbleTrigger
// ---------------------------------------------------------------------------

interface TriggerProps {
  children: ReactNode
  asChild?: boolean
  className?: string
}

export function BubbleTrigger({ children, asChild, className }: TriggerProps) {
  const { onToggle } = useContext(bubbleContext)

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children as React.ReactElement<{
        onClick?: () => void
        className?: string
      }>,
      {
        onClick: onToggle,
        className: cn(
          (children as React.ReactElement<{ className?: string }>).props
            .className,
          className
        ),
      }
    )
  }

  return (
    <Button type="button" className={className} onClick={onToggle}>
      {children}
    </Button>
  )
}

// ---------------------------------------------------------------------------
// BubbleMenuList — animates open/closed via CSS grid-rows trick
// ---------------------------------------------------------------------------

interface ListProps {
  children: ReactNode
}

export function BubbleMenuList({ children }: ListProps) {
  const { open } = useContext(bubbleContext)

  return (
    <div
      className={cn(
        "absolute inset-x-0 top-full z-50 grid transition-all duration-300 ease-in-out",
        open
          ? "grid-rows-[1fr] opacity-100"
          : "pointer-events-none grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div className="container mx-auto flex flex-col items-stretch gap-6 px-6 pt-4 pb-8 md:hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BubblePillItem — large pill that is a Link or a button
// ---------------------------------------------------------------------------

const pillVariants = cva(
  "inline-flex w-full cursor-pointer items-center justify-center rounded-full px-8 py-5 text-xl font-semibold transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        outline: "border border-border bg-background hover:bg-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface PillItemProps extends VariantProps<typeof pillVariants> {
  href?: string
  onClick?(): void
  /** Rotation in degrees — positive tilts right, negative tilts left */
  rotate?: number
  className?: string
  children: ReactNode
}

export function BubblePillItem({
  href,
  onClick,
  variant,
  rotate = 0,
  className,
  children,
}: PillItemProps) {
  const { onToggle } = useContext(bubbleContext)

  const style = rotate !== 0 ? { transform: `rotate(${rotate}deg)` } : undefined

  const handleClick = () => {
    onClick?.()
    onToggle()
  }

  const pillClass = cn(pillVariants({ variant }), className)

  if (href) {
    return (
      <Link href={href} className={pillClass} style={style} onClick={onToggle}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={pillClass}
      style={style}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
