import { ReactNode } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  variant?: 'mobile' | 'desktop';
}

export function FullScreenModal({
  isOpen,
  onClose,
  onBack,
  title,
  children,
  footer,
  showCloseButton = true,
  variant = 'mobile'
}: FullScreenModalProps) {
  // Variante Mobile : Plein écran
  if (variant === 'mobile') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed inset-0 z-50 bg-white flex flex-col md:hidden"
          >
            {/* Header sticky */}
            <header className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Bouton Retour ou Fermer */}
                <button
                  onClick={onBack || onClose}
                  className="p-2 -ml-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                  aria-label={onBack ? 'Retour' : 'Fermer'}
                >
                  {onBack ? (
                    <ChevronLeft className="h-6 w-6 text-[#111827]" />
                  ) : (
                    <X className="h-6 w-6 text-[#111827]" />
                  )}
                </button>

                {/* Titre centré */}
                <h1 className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-[#111827]">
                  {title}
                </h1>

                {/* Bouton fermer (optionnel) */}
                {showCloseButton && onBack && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5 text-[#6B7280]" />
                  </button>
                )}
                {!onBack && <div className="w-10" />}
              </div>
            </header>

            {/* Contenu scrollable */}
            <main className="flex-1 overflow-y-auto pb-24">
              {children}
            </main>

            {/* Footer sticky (si fourni) */}
            {footer && (
              <footer className="sticky bottom-0 z-10 bg-white border-t border-[#E5E7EB] p-4 safe-area-inset-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                {footer}
              </footer>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Variante Desktop : Modal classique (overlay)
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 hidden md:block"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full z-50 bg-white rounded-xl shadow-2xl hidden md:flex md:flex-col max-h-[90vh]"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 -ml-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-[#111827]" />
                </button>
              )}
              <h2 className={cn("font-semibold text-lg text-[#111827]", !onBack && "ml-0")}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-[#6B7280]" />
              </button>
            </header>

            {/* Contenu scrollable */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>

            {/* Footer (si fourni) */}
            {footer && (
              <footer className="px-6 py-4 border-t border-[#E5E7EB]">
                {footer}
              </footer>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Composant spécialisé pour la fiche produit (ProductDataSheet)
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  assureur: string;
  produit: string;
  prix: number;
  onSubscribe: () => void;
  children: ReactNode;
  variant?: 'mobile' | 'desktop';
}

export function ProductModal({
  isOpen,
  onClose,
  assureur,
  produit,
  prix,
  onSubscribe,
  children,
  variant = 'mobile'
}: ProductModalProps) {
  const footer = (
    <div className="space-y-3">
      {/* Récapitulatif prix */}
      <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg">
        <div>
          <p className="text-sm text-[#6B7280]">Votre tarif</p>
          <p className="font-semibold text-[#111827]">{assureur} - {produit}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#2563EB]">{prix}€</p>
          <p className="text-sm text-[#6B7280]">/mois</p>
        </div>
      </div>

      {/* Bouton CTA */}
      <button
        onClick={onSubscribe}
        className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold py-4 px-6 rounded-xl transition-colors active:scale-[0.98] shadow-lg"
      >
        Souscrire - {prix}€/mois
      </button>

      <p className="text-xs text-center text-[#6B7280]">
        Sans engagement • Résiliable à tout moment
      </p>
    </div>
  );

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Votre tarif"
      footer={footer}
      variant={variant}
    >
      {children}
    </FullScreenModal>
  );
}

// Composant wrapper responsive
export function ResponsiveProductModal(props: ProductModalProps) {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <ProductModal {...props} variant="mobile" />
      </div>
      
      {/* Desktop */}
      <div className="hidden md:block">
        <ProductModal {...props} variant="desktop" />
      </div>
    </>
  );
}
