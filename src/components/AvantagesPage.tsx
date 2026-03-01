import { useState } from "react";
import { 
  Star, Gift, TrendingUp, Award, Zap, Settings, History,
  Car, Home, Heart, PiggyBank, ShoppingBag, ChevronRight,
  Calendar, FileText, Calculator, Bell, CheckCircle, 
  ExternalLink, Filter, ArrowRight, Sparkles, Shield
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface User {
  firstName: string;
  loyaltyStatus: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
}

interface Partner {
  id: string;
  name: string;
  category: string;
  universe: string[];
  description: string;
  pointsRequired: number;
  discount: string;
  validity: string;
  logo?: string;
  isPremium?: boolean;
}

interface AvantagesPageProps {
  user?: User;
}

export function AvantagesPage({ user }: AvantagesPageProps) {
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("tous");

  // Données utilisateur par défaut
  const currentUser = user || {
    firstName: "Sophie",
    loyaltyStatus: 'gold' as const,
    points: 8500
  };

  // Configuration des statuts de fidélité
  const loyaltyLevels = {
    bronze: { min: 0, max: 2999, color: '#CD7F32', next: 'silver', pointsNeeded: 3000 },
    silver: { min: 3000, max: 6999, color: '#C0C0C0', next: 'gold', pointsNeeded: 7000 },
    gold: { min: 7000, max: 14999, color: '#FFD700', next: 'platinum', pointsNeeded: 15000 },
    platinum: { min: 15000, max: Infinity, color: '#E5E4E2', next: null, pointsNeeded: null }
  };

  const currentLevel = loyaltyLevels[currentUser.loyaltyStatus];
  const progressPercent = currentLevel.next 
    ? ((currentUser.points - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100
    : 100;

  // Univers d'assurance
  const universes = [
    {
      id: 'auto',
      name: 'Auto',
      icon: Car,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      description: 'Avantages automobile'
    },
    {
      id: 'habitation',
      name: 'Habitation',
      icon: Home,
      color: '#10B981',
      bgColor: '#F0FDF4',
      description: 'Avantages logement'
    },
    {
      id: 'sante',
      name: 'Santé & Bien-être',
      icon: Heart,
      color: '#EC4899',
      bgColor: '#FDF2F8',
      description: 'Santé et prévention'
    },
    {
      id: 'epargne',
      name: 'Vie & Épargne',
      icon: PiggyBank,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      description: 'Investissement et patrimoine'
    },
    {
      id: 'services',
      name: 'Services quotidiens',
      icon: ShoppingBag,
      color: '#F59E0B',
      bgColor: '#FFF8EE',
      description: 'Vie quotidienne'
    }
  ];

  // 50 Partenaires répartis dans les univers
  const partners: Partner[] = [
    // AUTO (10 partenaires)
    { id: 'p1', name: 'Total Energies', category: 'Carburant', universe: ['auto'], description: '10% de réduction sur vos pleins', pointsRequired: 500, discount: '-10%', validity: 'Valable 3 mois' },
    { id: 'p2', name: 'Norauto', category: 'Entretien', universe: ['auto'], description: 'Révision complète à prix réduit', pointsRequired: 800, discount: '-15%', validity: 'Valable 6 mois' },
    { id: 'p3', name: 'Michelin', category: 'Pneumatiques', universe: ['auto'], description: 'Pneus premium à prix coûtant', pointsRequired: 1200, discount: '-20%', validity: 'Valable 1 an', isPremium: true },
    { id: 'p4', name: 'Carglass', category: 'Pare-brise', universe: ['auto'], description: 'Réparation offerte', pointsRequired: 300, discount: 'Gratuit', validity: 'Valable 2 mois' },
    { id: 'p5', name: 'Europcar', category: 'Location', universe: ['auto'], description: 'Location véhicule -25%', pointsRequired: 1500, discount: '-25%', validity: 'Valable 6 mois' },
    { id: 'p6', name: 'Autolib', category: 'Parking', universe: ['auto'], description: 'Abonnement parking -30%', pointsRequired: 2000, discount: '-30%', validity: 'Valable 1 an', isPremium: true },
    { id: 'p7', name: 'Midas', category: 'Réparation', universe: ['auto'], description: 'Diagnostics gratuits', pointsRequired: 400, discount: 'Gratuit', validity: 'Valable 3 mois' },
    { id: 'p8', name: 'BP', category: 'Carburant', universe: ['auto'], description: 'Carte fidélité premium', pointsRequired: 600, discount: '-8%', validity: 'Valable 6 mois' },
    { id: 'p9', name: 'Feu Vert', category: 'Entretien', universe: ['auto'], description: 'Pack entretien annuel', pointsRequired: 1000, discount: '-18%', validity: 'Valable 1 an' },
    { id: 'p10', name: 'Sixt', category: 'Location', universe: ['auto'], description: 'Location premium -20%', pointsRequired: 1800, discount: '-20%', validity: 'Valable 6 mois', isPremium: true },

    // HABITATION (10 partenaires)
    { id: 'p11', name: 'Leroy Merlin', category: 'Bricolage', universe: ['habitation'], description: 'Carte cadeau 100€', pointsRequired: 2500, discount: '100€', validity: 'Valable 1 an', isPremium: true },
    { id: 'p12', name: 'Castorama', category: 'Rénovation', universe: ['habitation'], description: 'Réduction sur travaux', pointsRequired: 1500, discount: '-15%', validity: 'Valable 6 mois' },
    { id: 'p13', name: 'EDF', category: 'Énergie', universe: ['habitation'], description: 'Audit énergétique offert', pointsRequired: 800, discount: 'Gratuit', validity: 'Valable 3 mois' },
    { id: 'p14', name: 'Engie', category: 'Énergie', universe: ['habitation'], description: 'Réduction abonnement -10%', pointsRequired: 1000, discount: '-10%', validity: 'Valable 1 an' },
    { id: 'p15', name: 'Ikea', category: 'Ameublement', universe: ['habitation'], description: 'Bon d\'achat 50€', pointsRequired: 1200, discount: '50€', validity: 'Valable 6 mois' },
    { id: 'p16', name: 'Maison du Monde', category: 'Décoration', universe: ['habitation'], description: 'Collection exclusive -20%', pointsRequired: 1800, discount: '-20%', validity: 'Valable 6 mois', isPremium: true },
    { id: 'p17', name: 'Homeserve', category: 'Dépannage', universe: ['habitation'], description: 'Service prioritaire gratuit', pointsRequired: 2000, discount: 'Gratuit', validity: 'Valable 1 an', isPremium: true },
    { id: 'p18', name: 'Verisure', category: 'Sécurité', universe: ['habitation'], description: 'Installation alarme -25%', pointsRequired: 3000, discount: '-25%', validity: 'Valable 1 an', isPremium: true },
    { id: 'p19', name: 'But', category: 'Ameublement', universe: ['habitation'], description: 'Carte fidélité gold', pointsRequired: 1400, discount: '-12%', validity: 'Valable 6 mois' },
    { id: 'p20', name: 'Boulanger', category: 'Électroménager', universe: ['habitation'], description: 'Extension garantie gratuite', pointsRequired: 1600, discount: 'Gratuit', validity: 'Valable 2 ans' },

    // SANTÉ & BIEN-ÊTRE (10 partenaires)
    { id: 'p21', name: 'Doctolib', category: 'Santé', universe: ['sante'], description: 'Consultation télémédecine offerte', pointsRequired: 500, discount: 'Gratuit', validity: 'Valable 3 mois' },
    { id: 'p22', name: 'Alan', category: 'Mutuelle', universe: ['sante'], description: 'Premier mois offert', pointsRequired: 2500, discount: '1 mois', validity: 'Nouveaux clients', isPremium: true },
    { id: 'p23', name: 'Decathlon', category: 'Sport', universe: ['sante'], description: 'Équipement fitness -15%', pointsRequired: 800, discount: '-15%', validity: 'Valable 6 mois' },
    { id: 'p24', name: 'Basic Fit', category: 'Fitness', universe: ['sante'], description: 'Abonnement 3 mois -30%', pointsRequired: 1500, discount: '-30%', validity: 'Valable 2 mois' },
    { id: 'p25', name: 'Yuka', category: 'Nutrition', universe: ['sante'], description: 'Abonnement Premium 6 mois', pointsRequired: 600, discount: '6 mois', validity: 'Valable 1 an' },
    { id: 'p26', name: 'Pharmacie Lafayette', category: 'Pharmacie', universe: ['sante'], description: 'Carte fidélité platine', pointsRequired: 1000, discount: '-10%', validity: 'Valable 1 an' },
    { id: 'p27', name: 'Optical Center', category: 'Optique', universe: ['sante'], description: 'Seconde paire offerte', pointsRequired: 2000, discount: 'Gratuit', validity: 'Valable 6 mois', isPremium: true },
    { id: 'p28', name: 'Keep Cool', category: 'Fitness', universe: ['sante'], description: 'Coaching personnalisé offert', pointsRequired: 1200, discount: 'Gratuit', validity: 'Valable 3 mois' },
    { id: 'p29', name: 'Qare', category: 'Téléconsultation', universe: ['sante'], description: '5 consultations offertes', pointsRequired: 1800, discount: '5 séances', validity: 'Valable 6 mois', isPremium: true },
    { id: 'p30', name: 'Clarins', category: 'Bien-être', universe: ['sante'], description: 'Soin spa -40%', pointsRequired: 2500, discount: '-40%', validity: 'Valable 3 mois', isPremium: true },

    // VIE & ÉPARGNE (10 partenaires)
    { id: 'p31', name: 'Boursorama', category: 'Banque', universe: ['epargne'], description: 'Frais de gestion offerts 1 an', pointsRequired: 3000, discount: '1 an', validity: 'Nouveaux clients', isPremium: true },
    { id: 'p32', name: 'Trade Republic', category: 'Investissement', universe: ['epargne'], description: 'Actions offertes à l\'ouverture', pointsRequired: 2000, discount: '20€', validity: 'Nouveaux clients', isPremium: true },
    { id: 'p33', name: 'Yomoni', category: 'Gestion pilotée', universe: ['epargne'], description: 'Frais réduits à vie', pointsRequired: 5000, discount: '-50%', validity: 'À vie', isPremium: true },
    { id: 'p34', name: 'Linxea', category: 'Assurance vie', universe: ['epargne'], description: 'Frais d\'entrée offerts', pointsRequired: 2500, discount: 'Gratuit', validity: 'Valable 6 mois', isPremium: true },
    { id: 'p35', name: 'Fortuneo', category: 'Banque', universe: ['epargne'], description: 'Carte bancaire premium gratuite', pointsRequired: 1500, discount: 'Gratuit', validity: 'Valable 2 ans' },
    { id: 'p36', name: 'Nalo', category: 'Épargne', universe: ['epargne'], description: 'Audit patrimonial offert', pointsRequired: 1000, discount: 'Gratuit', validity: 'Valable 1 an' },
    { id: 'p37', name: 'Ramify', category: 'Investissement', universe: ['epargne'], description: 'Formation investissement offerte', pointsRequired: 800, discount: 'Gratuit', validity: 'Valable 6 mois' },
    { id: 'p38', name: 'Finary', category: 'Patrimoine', universe: ['epargne'], description: 'Abonnement Pro 1 an', pointsRequired: 2200, discount: '1 an', validity: 'Valable 3 mois', isPremium: true },
    { id: 'p39', name: 'Meilleurtaux', category: 'Crédit', universe: ['epargne'], description: 'Simulation personnalisée offerte', pointsRequired: 500, discount: 'Gratuit', validity: 'Valable 6 mois' },
    { id: 'p40', name: 'Goodvest', category: 'Épargne responsable', universe: ['epargne'], description: 'Investissement vert -0,5%', pointsRequired: 3500, discount: '-0,5%', validity: 'Valable 2 ans', isPremium: true },

    // SERVICES QUOTIDIENS (10 partenaires)
    { id: 'p41', name: 'Uber', category: 'Transport', universe: ['services'], description: 'Code promo 20€', pointsRequired: 1000, discount: '20€', validity: 'Valable 2 mois' },
    { id: 'p42', name: 'Deliveroo', category: 'Livraison', universe: ['services'], description: 'Livraison gratuite 3 mois', pointsRequired: 1200, discount: '3 mois', validity: 'Valable 1 mois' },
    { id: 'p43', name: 'Amazon Prime', category: 'E-commerce', universe: ['services'], description: '6 mois offerts', pointsRequired: 3000, discount: '6 mois', validity: 'Nouveaux membres', isPremium: true },
    { id: 'p44', name: 'Netflix', category: 'Streaming', universe: ['services'], description: 'Abonnement 3 mois -50%', pointsRequired: 2500, discount: '-50%', validity: 'Valable 2 mois', isPremium: true },
    { id: 'p45', name: 'Spotify', category: 'Musique', universe: ['services'], description: 'Premium 6 mois offerts', pointsRequired: 1800, discount: '6 mois', validity: 'Valable 3 mois', isPremium: true },
    { id: 'p46', name: 'Le Monde', category: 'Presse', universe: ['services'], description: 'Abonnement digital 1 an -40%', pointsRequired: 1500, discount: '-40%', validity: 'Valable 6 mois' },
    { id: 'p47', name: 'Fnac', category: 'Culture', universe: ['services'], description: 'Carte Fnac+ 2 ans offerts', pointsRequired: 2000, discount: '2 ans', validity: 'Valable 3 mois', isPremium: true },
    { id: 'p48', name: 'Carrefour', category: 'Courses', universe: ['services'], description: 'Bon d\'achat 30€', pointsRequired: 800, discount: '30€', validity: 'Valable 2 mois' },
    { id: 'p49', name: 'Air France', category: 'Voyage', universe: ['services'], description: 'Miles Flying Blue x2', pointsRequired: 5000, discount: 'x2 miles', validity: 'Valable 1 vol', isPremium: true },
    { id: 'p50', name: 'Blablacar', category: 'Covoiturage', universe: ['services'], description: 'Trajet offert', pointsRequired: 600, discount: '15€', validity: 'Valable 3 mois' },
  ];

  // Contenu pédagogique par univers
  const pedagogyContent = {
    auto: [
      { title: 'Votre calendrier de révisions', description: 'Ne manquez jamais une échéance d\'entretien', icon: Calendar },
      { title: 'Contrôle technique : guide complet', description: 'Tout savoir sur le CT 2024', icon: CheckCircle },
      { title: 'Conduire en hiver', description: 'Conseils et équipements obligatoires', icon: Shield }
    ],
    habitation: [
      { title: 'Checklist hiver', description: 'Préparez votre logement au froid', icon: Calendar },
      { title: 'Économies d\'énergie', description: 'Réduisez votre facture de 30%', icon: Zap },
      { title: 'Sécurité incendie', description: 'Les bons gestes de prévention', icon: Shield }
    ],
    sante: [
      { title: 'Prévention annuelle', description: 'Calendrier des examens de santé', icon: Calendar },
      { title: 'Bien choisir votre mutuelle', description: 'Comparateur et conseils experts', icon: CheckCircle },
      { title: 'Téléconsultation mode d\'emploi', description: 'Comment ça marche ?', icon: FileText }
    ],
    epargne: [
      { title: 'Fiscalité assurance vie', description: 'Optimisez votre imposition', icon: FileText },
      { title: 'Comprendre les UC', description: 'Guide des unités de compte', icon: TrendingUp },
      { title: 'Diversification patrimoniale', description: 'Construire un portefeuille équilibré', icon: Shield }
    ],
    services: [
      { title: 'Budget familial', description: 'Outil de gestion mensuelle', icon: Calculator },
      { title: 'Alertes consommation', description: 'Suivez vos dépenses en temps réel', icon: Bell },
      { title: 'Astuces économies', description: '50 façons de réduire vos charges', icon: Sparkles }
    ]
  };

  // Services utiles par univers
  const servicesContent = {
    auto: [
      { title: 'Simulateur bonus-malus', icon: Calculator },
      { title: 'Rappel révision', icon: Bell },
      { title: 'Carnet d\'entretien digital', icon: FileText }
    ],
    habitation: [
      { title: 'Calculateur valeur mobilier', icon: Calculator },
      { title: 'Inventaire assisté', icon: FileText },
      { title: 'Alertes météo', icon: Bell }
    ],
    sante: [
      { title: 'Suivi remboursements', icon: Calculator },
      { title: 'Carnet de santé digital', icon: FileText },
      { title: 'Rappels vaccins', icon: Bell }
    ],
    epargne: [
      { title: 'Simulateur retraite', icon: Calculator },
      { title: 'Projection patrimoine', icon: TrendingUp },
      { title: 'Alertes opportunités', icon: Bell }
    ],
    services: [
      { title: 'Comparateur offres', icon: Calculator },
      { title: 'Gestionnaire abonnements', icon: FileText },
      { title: 'Alertes promotions', icon: Bell }
    ]
  };

  const filteredPartners = partners.filter(partner => {
    const matchesCategory = filterCategory === 'tous' || partner.universe.includes(filterCategory);
    const matchesUniverse = !selectedUniverse || partner.universe.includes(selectedUniverse);
    return matchesCategory && matchesUniverse;
  });

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🥉';
    }
  };

  if (selectedUniverse) {
    const universe = universes.find(u => u.id === selectedUniverse)!;
    const Icon = universe.icon;
    const pedagogy = pedagogyContent[selectedUniverse as keyof typeof pedagogyContent] || [];
    const services = servicesContent[selectedUniverse as keyof typeof servicesContent] || [];

    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Header univers */}
        <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedUniverse(null)}
                  className="text-[#6B7280] hover:text-[#111827]"
                >
                  ← Retour aux univers
                </Button>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: universe.bgColor }}
                  >
                    <Icon className="h-6 w-6" style={{ color: universe.color }} />
                  </div>
                  <h1 className="text-2xl font-semibold text-[#111827]">{universe.name}</h1>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="h-4 w-4 text-[#F59E0B]" fill="#F59E0B" />
                <span className="font-medium text-[#111827]">{currentUser.points} points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 space-y-12">
          {/* Section 1 - Pédagogie */}
          <section>
            <h2 className="text-xl font-semibold text-[#111827] mb-6">Comprendre & prévenir</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pedagogy.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <Card key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: universe.bgColor }}>
                        <div className="w-full h-full flex items-center justify-center">
                          <ItemIcon className="h-6 w-6" style={{ color: universe.color }} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-[#111827] mb-2">{item.title}</h3>
                      <p className="text-sm text-[#6B7280] mb-4">{item.description}</p>
                      <Button 
                        variant="ghost" 
                        className="text-[#2563EB] hover:text-[#1d4ed8] p-0 h-auto"
                      >
                        Voir plus <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Section 2 - Services utiles */}
          <section>
            <h2 className="text-xl font-semibold text-[#111827] mb-6">Outils pratiques</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <Card key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                          <ItemIcon className="h-6 w-6 text-[#2563EB]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#111827]">{item.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-[#2563EB] hover:text-[#1d4ed8] p-0 h-auto mt-1"
                          >
                            Utiliser <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Section 3 - Avantages partenaires */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#111827]">Offres du moment</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={filterCategory === 'tous' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory('tous')}
                  className={filterCategory === 'tous' ? 'bg-[#2563EB]' : ''}
                >
                  Tous
                </Button>
                <Button
                  variant={filterCategory === selectedUniverse ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(selectedUniverse)}
                  className={filterCategory === selectedUniverse ? 'bg-[#2563EB]' : ''}
                >
                  {universe.name}
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    {partner.isPremium && (
                      <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20 mb-3">
                        ⭐ Premium
                      </Badge>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#111827] mb-1">{partner.name}</h3>
                        <p className="text-xs text-[#6B7280] mb-2">{partner.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-[#F59E0B]">
                          <Star className="h-4 w-4" fill="#F59E0B" />
                          <span className="text-sm font-semibold">{partner.pointsRequired}</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">points</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-3">{partner.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
                        {partner.discount}
                      </Badge>
                      <span className="text-xs text-[#6B7280]">{partner.validity}</span>
                    </div>
                    <Button 
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
                      disabled={currentUser.points < partner.pointsRequired}
                    >
                      {currentUser.points < partner.pointsRequired ? 'Points insuffisants' : 'Échanger'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Dashboard fidélité */}
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-6 md:space-y-0">
              {/* Gauche - Infos utilisateur */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-[#111827] mb-2">
                  Bonjour {currentUser.firstName} ! 👋
                </h2>
                <div className="flex items-center space-x-3 mb-4">
                  <Badge 
                    className="text-white border-0"
                    style={{ backgroundColor: currentLevel.color }}
                  >
                    {getStatusIcon(currentUser.loyaltyStatus)} {getStatusLabel(currentUser.loyaltyStatus)}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-[#F59E0B]" fill="#F59E0B" />
                    <span className="font-semibold text-[#111827]">{currentUser.points} points</span>
                  </div>
                </div>

                {/* Barre de progression */}
                {currentLevel.next && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">Progression vers {getStatusLabel(currentLevel.next)}</span>
                      <span className="font-medium text-[#111827]">
                        {currentUser.points} / {currentLevel.pointsNeeded}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-[#6B7280]">
                      Plus que {currentLevel.pointsNeeded! - currentUser.points} points pour atteindre {getStatusLabel(currentLevel.next)}
                    </p>
                  </div>
                )}
              </div>

              {/* Droite - Actions rapides */}
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>Historique</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Paramètres</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation univers */}
        <section>
          <h2 className="text-xl font-semibold text-[#111827] mb-6">Vos univers d'avantages</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {universes.map((universe) => {
              const Icon = universe.icon;
              return (
                <Card
                  key={universe.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
                  onClick={() => setSelectedUniverse(universe.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div 
                      className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: universe.bgColor }}
                    >
                      <Icon className="h-8 w-8" style={{ color: universe.color }} />
                    </div>
                    <h3 className="font-semibold text-[#111827] mb-1">{universe.name}</h3>
                    <p className="text-xs text-[#6B7280] mb-3">{universe.description}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-[#2563EB] hover:text-[#1d4ed8] p-0 h-auto"
                    >
                      Explorer <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Aperçu offres premium */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#111827]">Offres Premium du moment</h2>
              <p className="text-sm text-[#6B7280] mt-1">Les meilleures opportunités pour vous</p>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {partners
              .filter(p => p.isPremium)
              .slice(0, 6)
              .map((partner) => (
                <Card key={partner.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20 mb-3">
                      ⭐ Premium
                    </Badge>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#111827] mb-1">{partner.name}</h3>
                        <p className="text-xs text-[#6B7280] mb-2">{partner.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-[#F59E0B]">
                          <Star className="h-4 w-4" fill="#F59E0B" />
                          <span className="text-sm font-semibold">{partner.pointsRequired}</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">points</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-3">{partner.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
                        {partner.discount}
                      </Badge>
                      <span className="text-xs text-[#6B7280]">{partner.validity}</span>
                    </div>
                    <Button 
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
                      disabled={currentUser.points < partner.pointsRequired}
                    >
                      {currentUser.points < partner.pointsRequired ? 'Points insuffisants' : 'Échanger'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
