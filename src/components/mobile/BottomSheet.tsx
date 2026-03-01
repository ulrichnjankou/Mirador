import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  height?: 'full' | 'half' | 'auto';
  showHandle?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
  showHandle = true
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Empêcher le scroll du body quand le sheet est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const heightClasses = {
    full: 'h-[95vh]',
    half: 'h-[50vh]',
    auto: 'max-h-[85vh]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-white z-50 md:hidden",
              "rounded-t-[20px] shadow-2xl",
              heightClasses[height]
            )}
          >
            {/* Handle (poignée de glissement) */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-[#E5E7EB] rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5 text-[#6B7280]" />
                </button>
              </div>
            )}

            {/* Contenu scrollable */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Composant spécialisé pour les filtres
interface FiltersBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  children: ReactNode;
  filterCount?: number;
}

export function FiltersBottomSheet({
  isOpen,
  onClose,
  onApply,
  children,
  filterCount = 0
}: FiltersBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filtres"
      height="full"
    >
      {/* Contenu des filtres */}
      <div className="space-y-6 pb-24">
        {children}
      </div>

      {/* Barre d'action sticky en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 safe-area-inset-bottom">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-[#E5E7EB] rounded-lg font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors"
          >
            Appliquer{filterCount > 0 && ` (${filterCount})`}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

// Sticky Bottom Bar pour déclencher les filtres
interface StickyBottomBarProps {
  onFilterClick: () => void;
  onSortClick: () => void;
  filterCount?: number;
}

export function StickyBottomBar({
  onFilterClick,
  onSortClick,
  filterCount = 0
}: StickyBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 z-30 md:hidden safe-area-inset-bottom">
      <div className="flex gap-3">
        <button
          onClick={onFilterClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#2563EB] text-[#2563EB] rounded-lg font-medium hover:bg-[#2563EB]/5 transition-colors relative"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filtrer</span>
          {filterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#2563EB] text-white text-xs font-bold rounded-full flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
        
        <button
          onClick={onSortClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#E5E7EB] rounded-lg font-medium text-[#111827] hover:bg-[#F9FAFB] transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3m0 0l3-3m-3 3V4" />
          </svg>
          <span>Trier</span>
        </button>
      </div>
    </div>
  );
}
