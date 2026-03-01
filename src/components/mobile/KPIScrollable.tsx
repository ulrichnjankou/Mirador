import { ReactNode, useRef, useEffect, useState } from 'react';
import { Euro, Shield, TrendingUp, Calendar, LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

interface KPI {
  id: string;
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

interface KPIScrollableProps {
  kpis: KPI[];
  variant?: 'mobile' | 'desktop';
}

export function KPIScrollable({ kpis, variant = 'mobile' }: KPIScrollableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightIndicator, setShowRightIndicator] = useState(true);

  const colorClasses = {
    blue: {
      bg: 'bg-[#2563EB]/10',
      icon: 'text-[#2563EB]',
      value: 'text-[#2563EB]'
    },
    green: {
      bg: 'bg-[#10B981]/10',
      icon: 'text-[#10B981]',
      value: 'text-[#10B981]'
    },
    orange: {
      bg: 'bg-[#F59E0B]/10',
      icon: 'text-[#F59E0B]',
      value: 'text-[#F59E0B]'
    },
    purple: {
      bg: 'bg-[#8B5CF6]/10',
      icon: 'text-[#8B5CF6]',
      value: 'text-[#8B5CF6]'
    }
  };

  // Détecter si on peut encore scroller à droite
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowRightIndicator(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [kpis]);

  // Variante Mobile : Scroll horizontal
  if (variant === 'mobile') {
    return (
      <div className="relative md:hidden">
        {/* Container scrollable */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 py-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const colors = colorClasses[kpi.color || 'blue'];

            return (
              <div
                key={kpi.id}
                className="flex-shrink-0 w-[280px] snap-start"
              >
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
                      <Icon className={cn("h-5 w-5", colors.icon)} />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-[#6B7280] font-medium">
                      {kpi.label}
                    </p>
                    <p className={cn("text-2xl font-bold", colors.value)}>
                      {kpi.value}
                    </p>
                    {kpi.subValue && (
                      <p className="text-xs text-[#6B7280]">
                        {kpi.subValue}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Padding à droite pour l'indicateur visuel */}
          <div className="flex-shrink-0 w-4" />
        </div>

        {/* Indicateur de scroll (gradient à droite) */}
        {showRightIndicator && (
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#F9FAFB] to-transparent pointer-events-none" />
        )}

        {/* Indicateurs de pagination (points) */}
        <div className="flex justify-center gap-1.5 mt-3">
          {kpis.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === 0
                  ? "w-6 bg-[#2563EB]"
                  : "w-1.5 bg-[#E5E7EB]"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // Variante Desktop : Grille traditionnelle
  return (
    <div className="hidden md:grid md:grid-cols-3 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const colors = colorClasses[kpi.color || 'blue'];

        return (
          <div
            key={kpi.id}
            className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colors.bg)}>
                <Icon className={cn("h-6 w-6", colors.icon)} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-[#6B7280] font-medium">
                {kpi.label}
              </p>
              <p className={cn("text-3xl font-bold", colors.value)}>
                {kpi.value}
              </p>
              {kpi.subValue && (
                <p className="text-sm text-[#6B7280]">
                  {kpi.subValue}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Composant wrapper responsive
export function ResponsiveKPIs({ kpis }: { kpis: KPI[] }) {
  return (
    <>
      {/* Mobile : Scroll horizontal */}
      <KPIScrollable kpis={kpis} variant="mobile" />
      
      {/* Desktop : Grille */}
      <KPIScrollable kpis={kpis} variant="desktop" />
    </>
  );
}

// Exemple d'utilisation
export function KPIExample() {
  const kpis: KPI[] = [
    {
      id: 'total-primes',
      label: 'Total Primes',
      value: '3 168€',
      subValue: 'par an • 264€/mois',
      icon: Euro,
      color: 'blue'
    },
    {
      id: 'contrats-actifs',
      label: 'Contrats Actifs',
      value: '3',
      subValue: 'sur 3 contrats',
      icon: Shield,
      color: 'green'
    },
    {
      id: 'economie',
      label: 'Économies réalisées',
      value: '420€',
      subValue: 'vs offres initiales',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      id: 'prochain-prelevement',
      label: 'Prochain prélèvement',
      value: '12 Nov',
      subValue: '112€ - MAIF Auto',
      icon: Calendar,
      color: 'purple'
    }
  ];

  return <ResponsiveKPIs kpis={kpis} />;
}
