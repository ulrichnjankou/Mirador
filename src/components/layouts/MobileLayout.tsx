import { ReactNode } from 'react';
import { Home, FileText, AlertTriangle, Gift, User } from 'lucide-react';
import { cn } from '../ui/utils';

interface MobileLayoutProps {
  children: ReactNode;
  activeTab?: 'accueil' | 'contrats' | 'sinistres' | 'avantages' | 'profil';
  onTabChange?: (tab: string) => void;
  showTabBar?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
  onBack?: () => void;
  user?: {
    firstName: string;
    avatar?: string;
  };
}

export function MobileLayout({
  children,
  activeTab = 'accueil',
  onTabChange,
  showTabBar = true,
  showHeader = true,
  headerTitle,
  onBack,
  user
}: MobileLayoutProps) {
  const tabs = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'contrats', label: 'Contrats', icon: FileText },
    { id: 'sinistres', label: 'Sinistres', icon: AlertTriangle },
    { id: 'avantages', label: 'Avantages', icon: Gift },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] md:hidden">
      {/* Header Mobile - Sticky Top */}
      {showHeader && (
        <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Gauche : Logo ou Bouton Retour */}
            <div className="flex items-center space-x-3">
              {onBack ? (
                <button
                  onClick={onBack}
                  className="p-2 -ml-2 hover:bg-[#F9FAFB] rounded-lg transition-colors"
                  aria-label="Retour"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="font-semibold text-[#111827]">MIRADOR</span>
                </div>
              )}
            </div>

            {/* Centre : Titre optionnel */}
            {headerTitle && (
              <h1 className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-[#111827]">
                {headerTitle}
              </h1>
            )}

            {/* Droite : Avatar utilisateur */}
            <button className="flex items-center space-x-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#2563EB]" />
                </div>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Contenu principal - Scrollable */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Tab Bar - Sticky Bottom */}
      {showTabBar && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50">
          <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg transition-all",
                    "active:scale-95",
                    isActive
                      ? "text-[#2563EB]"
                      : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 mb-1 transition-transform",
                      isActive && "scale-110"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isActive && "font-semibold"
                    )}
                  >
                    {tab.label}
                  </span>
                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="absolute -top-0.5 w-12 h-1 bg-[#2563EB] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
