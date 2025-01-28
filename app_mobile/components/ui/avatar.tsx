import * as AvatarPrimitive from "@rn-primitives/avatar";
import * as React from "react";
import { cn } from "@/lib/utils";

const AvatarPrimitiveRoot = AvatarPrimitive.Root;
const AvatarPrimitiveImage = AvatarPrimitive.Image;
const AvatarPrimitiveFallback = AvatarPrimitive.Fallback;

const Avatar = React.forwardRef<
  AvatarPrimitive.RootRef,
  AvatarPrimitive.RootProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitiveRoot
    ref={ref}
    className={cn(
      "flex overflow-hidden relative w-10 h-10 rounded-full shrink-0",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitiveRoot.displayName;

const AvatarImage = React.forwardRef<
  AvatarPrimitive.ImageRef,
  AvatarPrimitive.ImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitiveImage
    ref={ref}
    className={cn("w-full h-full aspect-square", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitiveImage.displayName;

const AvatarFallback = React.forwardRef<
  AvatarPrimitive.FallbackRef,
  AvatarPrimitive.FallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitiveFallback
    ref={ref}
    className={cn(
      "flex justify-center items-center w-full h-full rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitiveFallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
