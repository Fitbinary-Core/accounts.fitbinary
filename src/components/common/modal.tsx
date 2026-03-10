import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?:
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "screen";
}

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  screen: "sm:max-w-[95vw]",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  maxWidth = "lg",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent
        className={cn(
          maxWidthClasses[maxWidth],
          "p-0 overflow-hidden border-none shadow-2xl bg-white",
          className,
        )}
        aria-describedby={undefined}
      >
        {title ? (
          <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-white">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.3)]" />
              <div className="flex-1">{title}</div>
            </DialogTitle>
          </DialogHeader>
        ) : (
          <DialogTitle className="sr-only">Dialog</DialogTitle>
        )}
        <div className="px-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white text-gray-800">
          {children}
        </div>
        {footer && (
          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 sm:justify-end gap-3">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
