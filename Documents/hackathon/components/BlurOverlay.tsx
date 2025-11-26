import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlurOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BlurOverlay({ isVisible, onClose, children }: BlurOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 bg-zinc-900/20" 
              aria-hidden="true"
              onClick={onClose}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="inline-block align-middle bg-white rounded-xl text-left sm:my-8 sm:max-w-lg sm:w-full border border-zinc-200 relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
