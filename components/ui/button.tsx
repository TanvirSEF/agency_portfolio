'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import Magnet from '@/components/Magnet';

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-[#8C52FF] text-white hover:bg-[#8C52FF] hover:text-white',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  magnetDisabled = false,
  glareDisabled = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    magnetDisabled?: boolean;
    glareDisabled?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Magnet magnetStrength={4} disabled={magnetDisabled} padding={80}>
      <div className="group relative inline-block overflow-hidden rounded-full">
        {!glareDisabled && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(-45deg,transparent_60%,rgba(255,255,255,0.35)_70%,transparent_80%,transparent_100%)] bg-[length:180%_180%] bg-no-repeat bg-[-100%_-100%] transition-[background-position] duration-1000 ease-out group-hover:bg-[100%_100%]"
          />
        )}
        <Comp
          data-slot="button"
          className={cn(buttonVariants({ variant, size, className }), 'relative z-10')}
          {...props}
        />
      </div>
    </Magnet>
  );
}

export { Button, buttonVariants };
