import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-sm hover:shadow-md [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-300 border-0",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-200 hover:from-red-700 hover:to-red-800 focus:ring-red-300 border-0",
        outline:
          "border-2 border-gray-300 bg-white text-gray-700 shadow-gray-100 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-300",
        secondary:
          "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-gray-200 hover:from-gray-700 hover:to-gray-800 focus:ring-gray-300 border-0",
        success:
          "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-200 hover:from-green-700 hover:to-green-800 focus:ring-green-300 border-0",
        warning:
          "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200 hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-300 border-0",
        ghost:
          "text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-300 shadow-none hover:shadow-md",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-800 shadow-none",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm has-[>svg]:px-5",
        sm: "h-9 px-4 py-2 text-xs has-[>svg]:px-3",
        lg: "h-13 px-8 py-4 text-base has-[>svg]:px-7",
        xl: "h-16 px-10 py-5 text-lg has-[>svg]:px-9",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
