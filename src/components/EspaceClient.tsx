import { useState, useEffect } from "react";
import { 
  User, Shield, Award, TrendingUp, Calendar, FileText, 
  CreditCard, Settings, LogOut, Bell, Download, Eye,
  RefreshCw, AlertTriangle, CheckCircle, Clock, 
  Star, Euro, ChevronRight, Plus, Search, Filter,
  BarChart3, Target, Gift, Car, Home, Heart, Building,
  Sparkles, PartyPopper, ChevronDown, ChevronUp, Edit, X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { AuthModal } from "./AuthModal";
import { AttestationDownload } from "./AttestationDownload";
import { SinistresManager } from "./SinistresManager";
import type { User as UserType } from "../types";

interface EspaceClientProps {
  onReturnToComparator: () => void;
  authenticatedUser?: UserType | null;
  onUserAuthenticated: (user: UserType) => void;
  justSubscribed?: boolean;
}

// Mock data pour les contrats
const mockContrats = [
  {
    id: 1,
    type: "auto",
    assureur: "MAIF",
    produit: "Auto Sociétaire",
    vehicule: "Peugeot 308 (AB-123-CD)",
    primeAnnuelle: 1344,
    primeMensuelle: 112,
    dateEcheance: "2025-11-12",
    prochainPrelevement: "2025-11-12",
    statut: "Actif",
    franchise: 300,
    numeroContrat: "MAIF-AUTO-2024-001234",
    dernierPaiement: "2024-10-12",
    garanties: ["Responsabilité civile", "Tous risques", "Assistance 0km", "Protection juridique"],
    documents: ["Conditions générales", "IPID", "Attestation d'assurance"],
    icon: Car,
    color: "text-[#2563EB]"
  },
  {
    id: 2,
    type: "habitation",
    assureur: "Groupama",
    produit: "Multirisque Habitation",
    logement: "Appartement T3 - 75 m²",
    primeAnnuelle: 384,
    primeMensuelle: 32,
    dateEcheance: "2025-12-05",
    prochainPrelevement: "2025-12-05",
    statut: "Actif",
    franchise: 150,
    numeroContrat: "GP-MRH-2024-005678",
    dernierPaiement: "2024-11-05",
    garanties: ["Incendie", "Dégâts des eaux", "Vol", "Responsabilité civile vie privée"],
    documents: ["Conditions générales", "IPID", "Inventaire mobilier"],
    icon: Home,
    color: "text-[#10B981]"
  },
  {
    id: 3,
    type: "sante",
    assureur: "Harmonie Mutuelle",
    produit: "Santé Famille Plus",
    beneficiaires: "2 adultes + 1 enfant",
    primeAnnuelle: 1440,
    primeMensuelle: 120,
    dateEcheance: "2024-12-31",
    prochainPrelevement: "2024-11-26",
    statut: "À renouveler",
    franchise: 0,
    numeroContrat: "HM-SANTE-2024-009876",
    dernierPaiement: "2024-10-26",
    garanties: ["Hospitalisation", "Soins courants", "Optique", "Dentaire"],
    documents: ["Conditions générales", "Tableau des garanties", "Cartes de tiers payant"],
    icon: Heart,
    color: "text-[#2563EB]"
  }
];

const mockSinistres = [
  {
    id: 1,
    contratId: 1,
    type: "auto",
    description: "Accrochage parking - Rayure portière droite",
    dateDeclaration: "2024-01-15",
    statut: "Indemnisé",
    montantDemande: 450,
    montantIndemnise: 350,
    franchise: 100,
    numeroSinistre: "SIN-2024-001234"
  },
  {
    id: 2,
    contratId: 2,
    type: "habitation",
    description: "Dégât des eaux - Fuite canalisation cuisine",
    dateDeclaration: "2024-01-28",
    statut: "En cours",
    montantDemande: 1200,
    montantIndemnise: 0,
    franchise: 150,
    numeroSinistre: "SIN-2024-002345"
  }
];

export function EspaceClient({ 
  onReturnToComparator, 
  authenticatedUser, 
  onUserAuthenticated,
  justSubscribed = false 
}: EspaceClientProps) {
  const [activeSection, setActiveSection] = useState("vue-ensemble");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("tous");
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(justSubscribed);
  const [expandedContractId, setExpandedContractId] = useState<number | null>(null); // Nouveau state pour les accordéons

  // Rediriger vers l'authentification si pas connecté
  useEffect(() => {
    if (!authenticatedUser) {
      setShowAuthModal(true);
    }
  }, [authenticatedUser]);

  // Gérer l'animation de bienvenue
  useEffect(() => {
    if (justSubscribed) {
      setShowWelcomeAnimation(true);
      // Cacher l'animation après 5 secondes
      const timer = setTimeout(() => {
        setShowWelcomeAnimation(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [justSubscribed]);

  if (!authenticatedUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Accès à votre espace client</CardTitle>
            <p className="text-muted-foreground">
              Connectez-vous pour accéder à vos contrats, sinistres et avantages
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAuthModal(true)} 
              className="w-full"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={onUserAuthenticated}
          title="Connexion Espace Client"
        />
      </div>
    );
  }

  const filteredContrats = mockContrats.filter(contrat => {
    const matchesSearch = searchTerm === "" || 
      contrat.assureur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.numeroContrat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "tous" || contrat.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Actif":
        return <Badge className="bg-green-100 text-green-800 border-green-200">✓ Actif</Badge>;
      case "À renouveler":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">📊 À renouveler</Badge>;
      case "Expiré":
        return <Badge variant="destructive">⚠️ Expiré</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const totalPrimes = mockContrats.reduce((sum, c) => sum + c.primeAnnuelle, 0);
  const convratsActifs = mockContrats.filter(c => c.statut === "Actif").length;
  const contratsARecoter = mockContrats.filter(c => c.statut === "À renouveler").length;

  return (
    <div className="space-y-6">
      {/* Animation de bienvenue pour nouveaux souscripteurs */}
      {showWelcomeAnimation && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <PartyPopper className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-800 mb-1">
                     Bienvenue dans votre espace client !
                  </h2>
                  <p className="text-green-700">
                    Votre souscription est confirmée. Découvrez toutes les fonctionnalités disponibles.
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-green-600">
                    <span>✓ Documents disponibles</span>
                    <span>✓ +500 points fidélité</span>
                    <span>✓ Assistance 24h/7j</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowWelcomeAnimation(false)}
                className="text-green-600 hover:text-green-700"
              >
                ✕
              </Button>
            </div>
            {/* Confettis animés */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-1/4 animate-pulse">🎊</div>
              <div className="absolute top-4 right-1/3 animate-bounce">✨</div>
              <div className="absolute bottom-4 left-1/3 animate-pulse">🌟</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header avec informations utilisateur */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-100 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Bonjour {authenticatedUser.firstName} !
                </h1>
                <p className="text-muted-foreground">
                  Gérez vos contrats et profitez de vos avantages fidélité
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {authenticatedUser.membershipLevel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {authenticatedUser.points} points fidélité
                  </span>
                  {justSubscribed && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Nouveau client !
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation principale - REMONTÉ */}
      <Card>
        <CardContent className="p-6 bg-[#2563EB]/5 rounded-lg">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
              <TabsTrigger 
                value="vue-ensemble" 
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contrats" 
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Contrats</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sinistres" 
                className="flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Sinistres</span>
              </TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="vue-ensemble" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Primes</CardTitle>
                    <Euro className="h-4 w-4 ml-auto text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalPrimes}€</div>
                    <p className="text-xs text-muted-foreground">
                      par an • {Math.round(totalPrimes/12)}€/mois
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
                    <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{convratsActifs}</div>
                    <p className="text-xs text-muted-foreground">
                      sur {mockContrats.length} contrats
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Évaluer mes contrats</CardTitle>
                    <RefreshCw className="h-4 w-4 ml-auto text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contratsARecoter}</div>
                    <p className="text-xs text-muted-foreground">
                      Optimisez vos tarifs
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions rapides - Couleur bleue appliquée */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#2563EB]/5 hover:border-[#2563EB] text-[#111827]"
                      onClick={onReturnToComparator}
                    >
                      <Search className="h-6 w-6 mb-2 text-[#2563EB]" />
                      Nouvelle comparaison
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#2563EB]/5 hover:border-[#2563EB] text-[#111827]"
                    >
                      <Download className="h-6 w-6 mb-2 text-[#2563EB]" />
                      Télécharger documents
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#2563EB]/5 hover:border-[#2563EB] text-[#111827]"
                      onClick={() => setActiveSection("sinistres")}
                    >
                      <Plus className="h-6 w-6 mb-2 text-[#2563EB]" />
                      Déclarer sinistre
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#2563EB]/5 hover:border-[#2563EB] text-[#111827]"
                    >
                      <Gift className="h-6 w-6 mb-2 text-[#2563EB]" />
                      Mes avantages
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* NOUVEAU : Échéancier des prélèvements */}
              <Card className="border-[#E5E7EB] bg-white rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-[#111827]">
                    <Calendar className="h-5 w-5 text-[#2563EB]" />
                    <span>Échéancier des prélèvements</span>
                  </CardTitle>
                  <p className="text-sm text-[#6B7280]">Vos prochains paiements à venir</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockContrats
                      .sort((a, b) => new Date(a.prochainPrelevement).getTime() - new Date(b.prochainPrelevement).getTime())
                      .map((contrat) => {
                        const Icon = contrat.icon;
                        const datePrelevement = new Date(contrat.prochainPrelevement);
                        return (
                          <div key={contrat.id} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:bg-white transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#2563EB]/10">
                                <Calendar className="h-6 w-6 text-[#2563EB]" />
                              </div>
                              <div>
                                <div className="font-semibold text-[#111827]">
                                  {datePrelevement.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                </div>
                                <div className="text-sm text-[#6B7280] flex items-center space-x-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{contrat.assureur} {contrat.produit}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#2563EB]">
                                {contrat.primeMensuelle}€
                              </div>
                              <div className="text-xs text-[#6B7280]">/mois</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* NOUVEAU : Contrats bientôt à renouveler */}
              {contratsARecoter > 0 && (
                <Card className="border-[#2563EB]/20 bg-[#EFF6FF] rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-[#111827]">
                      <RefreshCw className="h-5 w-5 text-[#2563EB]" />
                      <span>Contrats bientôt à renouveler</span>
                      <Badge className="bg-[#2563EB] text-white ml-auto">
                        {contratsARecoter}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-[#6B7280]">Profitez-en pour optimiser vos tarifs</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockContrats
                        .filter(c => c.statut === "À renouveler")
                        .map((contrat) => {
                          const Icon = contrat.icon;
                          const dateEcheance = new Date(contrat.dateEcheance);
                          const joursRestants = Math.ceil((dateEcheance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <div key={contrat.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E5E7EB]">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#2563EB]/10">
                                  <Icon className="h-6 w-6 text-[#2563EB]" />
                                </div>
                                <div>
                                  <div className="font-semibold text-[#111827]">
                                    {contrat.assureur} – {contrat.produit}
                                  </div>
                                  <div className="text-sm text-[#6B7280]">
                                    {contrat.primeAnnuelle}€/an • échéance {dateEcheance.toLocaleDateString('fr-FR')}
                                  </div>
                                  <Badge className="mt-1 bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20">
                                    Bientôt à échéance ({joursRestants} jours)
                                  </Badge>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={onReturnToComparator}
                                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Revoir mes options
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Contrats */}
            <TabsContent value="contrats" className="space-y-6 mt-6">
              {/* Barre de recherche et filtres */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Rechercher un contrat par assureur, produit ou numéro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les contrats</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="habitation">Habitation</SelectItem>
                    <SelectItem value="sante">Santé</SelectItem>
                    <SelectItem value="vie">Épargne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Liste des contrats en accordéons */}
              <div className="space-y-4">
                {filteredContrats.map((contrat) => {
                  const Icon = contrat.icon;
                  const isExpanded = expandedContractId === contrat.id;
                  const dateEcheance = new Date(contrat.dateEcheance);
                  
                  return (
                    <Card key={contrat.id} className="overflow-hidden bg-white border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      {/* Bandeau synthétique (toujours visible) */}
                      <CardContent className="p-0">
                        <button
                          onClick={() => setExpandedContractId(isExpanded ? null : contrat.id)}
                          className="w-full p-6 text-left hover:bg-[#F9FAFB] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              {/* Logo/Icône */}
                              <div className="w-12 h-12 rounded-lg bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-6 w-6 text-[#2563EB]" />
                              </div>
                              
                              {/* Infos principales */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-1">
                                  <h3 className="font-semibold text-[#111827]">{contrat.assureur}</h3>
                                  {getStatutBadge(contrat.statut)}
                                </div>
                                <p className="text-sm text-[#6B7280]">
                                  {contrat.produit}
                                </p>
                                <p className="text-xs text-[#6B7280] mt-1">
                                  N° {contrat.numeroContrat}
                                </p>
                              </div>
                            </div>
                            
                            {/* Prix et échéance */}
                            <div className="text-right mx-6">
                              <div className="text-lg font-bold text-[#2563EB]">
                                {contrat.primeMensuelle}€
                                <span className="text-sm font-normal text-[#6B7280]">/mois</span>
                              </div>
                              <div className="text-sm text-[#6B7280]">
                                {contrat.primeAnnuelle}€/an
                              </div>
                              <div className="text-xs text-[#6B7280] mt-1 flex items-center justify-end space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Échéance: {dateEcheance.toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                            
                            {/* Flèche pour plier/déplier */}
                            <div className="flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-[#6B7280] transition-transform" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-[#6B7280] transition-transform" />
                              )}
                            </div>
                          </div>
                        </button>
                        
                        {/* Contenu détaillé (mode déplié) */}
                        {isExpanded && (
                          <div className="border-t border-[#E5E7EB] bg-[#F9FAFB]/50 p-6 space-y-6 transition-all duration-200">
                            {/* Bloc A : Synthèse des garanties */}
                            <div>
                              <h4 className="font-semibold text-[#111827] mb-3 flex items-center space-x-2">
                                <Shield className="h-4 w-4 text-[#2563EB]" />
                                <span>Garanties incluses</span>
                              </h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                {contrat.garanties.map((garantie, idx) => (
                                  <div key={idx} className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0" />
                                    <span className="text-[#111827]">{garantie}</span>
                                  </div>
                                ))}
                              </div>
                              {contrat.franchise > 0 && (
                                <div className="mt-3 text-sm text-[#6B7280]">
                                  <span className="font-medium">Franchise applicable :</span> {contrat.franchise}€
                                </div>
                              )}
                            </div>
                            
                            {/* Bloc B : Documents & Attestations */}
                            <div>
                              <h4 className="font-semibold text-[#111827] mb-3 flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-[#2563EB]" />
                                <span>Documents contractuels</span>
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                <AttestationDownload 
                                  contratId={contrat.id}
                                  assureur={contrat.assureur}
                                  produit={contrat.produit}
                                />
                                <Button variant="outline" size="sm" className="bg-white">
                                  <Download className="h-4 w-4 mr-2" />
                                  Documents contractuels
                                </Button>
                              </div>
                              <p className="text-xs text-[#6B7280] mt-2">
                                Documents envoyés le {new Date(contrat.dernierPaiement).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            
                            {/* Bloc C : Sinistres */}
                            <div>
                              <h4 className="font-semibold text-[#111827] mb-3 flex items-center space-x-2">
                                <AlertTriangle className="h-4 w-4 text-[#2563EB]" />
                                <span>Gestion des sinistres</span>
                              </h4>
                              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E5E7EB]">
                                <div>
                                  <p className="text-sm font-medium text-[#111827]">Dernier sinistre déclaré</p>
                                  <p className="text-xs text-[#6B7280]">
                                    {mockSinistres.find(s => s.contratId === contrat.id) 
                                      ? `${mockSinistres.find(s => s.contratId === contrat.id)?.statut} - ${mockSinistres.find(s => s.contratId === contrat.id)?.description}`
                                      : "Aucun sinistre déclaré"}
                                  </p>
                                </div>
                                <Button 
                                  size="sm" 
                                  className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                                  onClick={() => setActiveSection("sinistres")}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Déclarer un sinistre
                                </Button>
                              </div>
                            </div>
                            
                            {/* Bloc D : Modifier / Résilier */}
                            <div>
                              <h4 className="font-semibold text-[#111827] mb-3 flex items-center space-x-2">
                                <Settings className="h-4 w-4 text-[#2563EB]" />
                                <span>Gérer mon contrat</span>
                              </h4>
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-3">
                                  <Button variant="outline" size="sm" className="bg-white">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier RIB
                                  </Button>
                                  <Button variant="outline" size="sm" className="bg-white">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Mettre à jour mes informations
                                  </Button>
                                  {contrat.statut === "À renouveler" && (
                                    <Button 
                                      size="sm" 
                                      onClick={onReturnToComparator}
                                      className="bg-[#FBBF24] hover:bg-[#F59E0B] text-white"
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Évaluer mes options
                                    </Button>
                                  )}
                                </div>
                                
                                {/* Section résiliation */}
                                <div className="p-4 bg-white rounded-lg border border-[#E5E7EB]">
                                  <p className="text-sm font-medium text-[#111827] mb-2">
                                    Résilier ce contrat – Votre situation évolue ?
                                  </p>
                                  <p className="text-xs text-[#6B7280] mb-3">
                                    Nous pouvons vous proposer des alternatives adaptées à vos nouveaux besoins.
                                  </p>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-[#6B7280] hover:text-[#111827]"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Demander une résiliation
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Sinistres */}
            <TabsContent value="sinistres" className="mt-6">
              <SinistresManager 
                sinistres={mockSinistres}
                contrats={mockContrats}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}