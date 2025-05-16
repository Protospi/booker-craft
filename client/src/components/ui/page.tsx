import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  side: "left" | "right";
  index: number;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ className, children, active = false, side, index, ...props }, ref) => {
    const isRight = side === "right";
    
    // Animation variants for page turning
    const variants = {
      initial: {
        rotateY: isRight ? 0 : -180, 
        zIndex: 10 - index
      },
      flip: {
        rotateY: isRight ? -180 : 0,
        zIndex: 20 + index,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "page-turn absolute inset-0 w-full h-full bg-white rounded-r shadow-md",
          isRight ? "origin-left" : "origin-right",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        initial="initial"
        animate={active ? "flip" : "initial"}
        variants={variants}
        {...props}
      >
        <div 
          className={cn(
            "absolute inset-0 w-full h-full p-6 sm:p-10 overflow-hidden",
            isRight ? "page-content-front" : "page-content-back"
          )}
        >
          {children}
        </div>
      </motion.div>
    );
  }
);

Page.displayName = "Page";

export { Page };
