import { useState } from "react";
import { 
  AlertTriangle, RotateCcw, Plus, Search, 
  Eye, MessageSquare, FileText, Clock, CheckCircle,
  Calendar, Car, Home, Heart, Shield, Euro, X,
  Upload, Download, Check, AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Progress } from "./ui/progress";

interface Sinistre {
  id: string;
  numero: string;
  type: string;
  status: 'en_cours' | 'expertise' | 'urgent' | 'resolu';
  dateDeclaration: string;
  dateSinistre: string;
  description: string;
  montantEstime?: number;
  assureur: string;
  contrat: string;
  garantie?: string;
  prochaine_etape?: string;
}

interface Contrat {
  id: number;
  type: string;
  assureur: string;
  produit: string;
  numeroContrat: string;
}

interface SinistresManagerProps {
  sinistres: any[];
  contrats: Contrat[];
}

export function SinistresManager({ sinistres: initialSinistres, contrats }: SinistresManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");
  const [selectedSinistre, setSelectedSinistre] = useState<Sinistre | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  // Données de démonstration enrichies
  const mockSinistres: Sinistre[] = [
    {
      id: "SIN001",
      numero: "2024-AUTO-001234",
      type: "Automobile",
      status: "en_cours",
      dateDeclaration: "2024-01-15",
      dateSinistre: "2024-01-14",
      description: "Collision avec un autre véhicule au carrefour - Dégâts pare-chocs avant",
      montantEstime: 3500,
      assureur: "MAIF",
      contrat: "MAIF-AUTO-2024-001234",
      garantie: "Tous risques",
      prochaine_etape: "Expertise véhicule prévue le 25/01/2024"
    },
    {
      id: "SIN002", 
      numero: "2024-HAB-005678",
      type: "Habitation",
      status: "expertise",
      dateDeclaration: "2024-01-10",
      dateSinistre: "2024-01-09",
      description: "Dégât des eaux suite à rupture canalisation cuisine",
      montantEstime: 2800,
      assureur: "Groupama",
      contrat: "GP-MRH-2024-005678",
      garantie: "Dégâts des eaux",
      prochaine_etape: "Virement indemnisation en cours"
    },
    {
      id: "SIN003",
      numero: "2023-AUTO-009876",
      type: "Automobile", 
      status: "urgent",
      dateDeclaration: "2024-01-20",
      dateSinistre: "2024-01-20",
      description: "Vol de véhicule avec effraction - Parking souterrain",
      montantEstime: 15000,
      assureur: "MAIF",
      contrat: "MAIF-AUTO-2024-001234",
      garantie: "Vol",
      prochaine_etape: "Dépôt de plainte à transmettre sous 48h"
    },
    {
      id: "SIN004",
      numero: "2023-HAB-002341",
      type: "Habitation",
      status: "resolu",
      dateDeclaration: "2023-12-05",
      dateSinistre: "2023-12-04",
      description: "Incendie partiel cuisine - Court-circuit électrique",
      montantEstime: 5200,
      assureur: "Groupama",
      contrat: "GP-MRH-2024-005678",
      garantie: "Incendie",
      prochaine_etape: "Indemnisation versée le 15/12/2023"
    }
  ];

  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("tous");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_cours':
        return <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20">En cours</Badge>;
      case 'expertise':
        return <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20">En expertise</Badge>;
      case 'urgent':
        return <Badge className="bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20">Urgent</Badge>;
      case 'resolu':
        return <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">Résolu</Badge>;
      default:
        return <Badge className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Automobile':
        return <Car className="h-6 w-6 text-[#2563EB]" />;
      case 'Habitation':
        return <Home className="h-6 w-6 text-[#10B981]" />;
      case 'Santé':
        return <Heart className="h-6 w-6 text-[#2563EB]" />;
      default:
        return <Shield className="h-6 w-6 text-[#2563EB]" />;
    }
  };

  const filteredSinistres = mockSinistres.filter(sinistre => {
    const matchesSearch = sinistre.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sinistre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sinistre.assureur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "tous" || sinistre.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Bandeau haut simplifié */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#111827]">Gestion des sinistres</h2>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              
              <Button 
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau sinistre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barre de recherche + filtre */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Rechercher par numéro, description ou assureur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#F9FAFB] border-[#E5E7EB]"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[220px] bg-[#F9FAFB] border-[#E5E7EB]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="expertise">En expertise</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="resolu">Résolu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cartes sinistres */}
      <div className="space-y-8">
        {filteredSinistres.map((sinistre) => {
          const dateSinistre = new Date(sinistre.dateSinistre);
          
          return (
            <Card key={sinistre.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Bloc 1 - Bandeau synthèse */}
                <div className="p-6 border-b border-[#E5E7EB]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Logo + Icône */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#F9FAFB] flex-shrink-0">
                        {getTypeIcon(sinistre.type)}
                      </div>
                      
                      {/* Infos principales */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-[#111827]">{sinistre.numero}</h3>
                          {getStatusBadge(sinistre.status)}
                        </div>
                        <p className="text-sm text-[#6B7280] mb-1">
                          Déclaré le {dateSinistre.toLocaleDateString('fr-FR')}
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium text-[#111827]">{sinistre.assureur}</span>
                          <span className="text-[#6B7280]">•</span>
                          <span className="text-[#6B7280]">{sinistre.contrat}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Montant estimé */}
                    <div className="text-right ml-6">
                      <div className="text-sm text-[#6B7280] mb-1">Montant estimé</div>
                      <div className="text-xl font-bold text-[#2563EB] flex items-center justify-end">
                        <Euro className="h-4 w-4 mr-1" />
                        {sinistre.montantEstime?.toLocaleString()}€
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bloc 2 - Informations essentielles */}
                <div className="p-6 border-b border-[#E5E7EB] bg-[#F9FAFB]/30">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#111827] mb-2">Description</h4>
                    <p className="text-sm text-[#6B7280]">{sinistre.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1">Date sinistre</div>
                      <div className="text-sm font-medium text-[#111827]">
                        {dateSinistre.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1">Type / Catégorie</div>
                      <div className="text-sm font-medium text-[#111827]">{sinistre.type}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1">Assureur</div>
                      <div className="text-sm font-medium text-[#111827]">{sinistre.assureur}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1">Garantie concernée</div>
                      <div className="text-sm font-medium text-[#111827]">{sinistre.garantie || "N/A"}</div>
                    </div>
                  </div>
                </div>

                {/* Bloc 3 - Timeline / Prochaine étape */}
                {sinistre.prochaine_etape && (
                  <div className="p-6 border-b border-[#E5E7EB]">
                    <div className="flex items-start space-x-3 p-4 bg-[#F9FAFB] rounded-xl">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#2563EB]/10 flex-shrink-0">
                        <Calendar className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[#111827] mb-1">Prochaine étape</h4>
                        <p className="text-sm text-[#6B7280]">{sinistre.prochaine_etape}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bloc 4 - Actions rapides */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedSinistre(sinistre);
                        setShowWorkflowModal(true);
                      }}
                      className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white border-0"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Message si aucun sinistre */}
      {filteredSinistres.length === 0 && (
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-[#6B7280]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Aucun sinistre trouvé</h3>
            <p className="text-sm text-[#6B7280]">
              {searchTerm || filterStatus !== "tous" 
                ? "Aucun sinistre ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore déclaré de sinistre."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modale Workflow du sinistre */}
      <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-[#111827]">
                  Suivi du sinistre {selectedSinistre?.numero}
                </DialogTitle>
                <DialogDescription className="text-sm text-[#6B7280] mt-1">
                  {selectedSinistre?.assureur} • {selectedSinistre?.contrat}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWorkflowModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedSinistre && (
            <div className="space-y-6 mt-6">
              {/* Barre de progression visuelle */}
              <Card className="bg-[#F9FAFB] border-[#E5E7EB]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Indicateur de progression */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#111827]">Progression du dossier</span>
                      <span className="text-sm text-[#6B7280]">
                        {selectedSinistre.status === 'resolu' ? '100%' : 
                         selectedSinistre.status === 'expertise' ? '75%' :
                         selectedSinistre.status === 'en_cours' ? '50%' : '25%'}
                      </span>
                    </div>
                    <Progress 
                      value={
                        selectedSinistre.status === 'resolu' ? 100 : 
                        selectedSinistre.status === 'expertise' ? 75 :
                        selectedSinistre.status === 'en_cours' ? 50 : 25
                      }
                      className="h-2"
                    />

                    {/* Timeline visuelle horizontale */}
                    <div className="grid grid-cols-4 gap-2 mt-6">
                      {/* Étape 1 - Déclaration */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          true ? 'bg-[#10B981] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                        }`}>
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-[#111827]">Déclaration</span>
                        <span className="text-xs text-[#6B7280]">Terminé</span>
                      </div>

                      {/* Étape 2 - Traitement */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          selectedSinistre.status !== 'urgent' ? 'bg-[#2563EB] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                        }`}>
                          <Clock className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-[#111827]">Traitement</span>
                        <span className="text-xs text-[#6B7280]">
                          {selectedSinistre.status === 'urgent' ? 'En attente' : 'En cours'}
                        </span>
                      </div>

                      {/* Étape 3 - Expertise (optionnel) */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          selectedSinistre.status === 'expertise' || selectedSinistre.status === 'resolu' 
                            ? 'bg-[#F59E0B] text-white' 
                            : 'bg-[#E5E7EB] text-[#6B7280]'
                        }`}>
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-[#111827]">Expertise</span>
                        <span className="text-xs text-[#6B7280]">
                          {selectedSinistre.status === 'expertise' ? 'En cours' : 
                           selectedSinistre.status === 'resolu' ? 'Terminé' : 'Optionnel'}
                        </span>
                      </div>

                      {/* Étape 4 - Paiement */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          selectedSinistre.status === 'resolu' ? 'bg-[#10B981] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                        }`}>
                          <Euro className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-[#111827]">Paiement</span>
                        <span className="text-xs text-[#6B7280]">
                          {selectedSinistre.status === 'resolu' ? 'Terminé' : 'À venir'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Détails des étapes */}
              <div className="space-y-4">
                {/* Étape 1 - Déclaration */}
                <Card className="border-[#E5E7EB]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#10B981]/10 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-[#10B981]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#111827]">1. Déclaration du sinistre</h4>
                          <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
                            ✓ Complété
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">
                          Votre déclaration a été enregistrée et transmise à votre assureur.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[#6B7280]">Date de déclaration :</span>
                            <span className="font-medium text-[#111827] ml-2">
                              {new Date(selectedSinistre.dateDeclaration).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6B7280]">Date du sinistre :</span>
                            <span className="font-medium text-[#111827] ml-2">
                              {new Date(selectedSinistre.dateSinistre).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-[#6B7280]" />
                            <span className="text-sm text-[#6B7280]">Documents transmis :</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Button variant="outline" size="sm" className="bg-white">
                              <Download className="h-3 w-3 mr-2" />
                              Déclaration initiale
                            </Button>
                            <Button variant="outline" size="sm" className="bg-white">
                              <Download className="h-3 w-3 mr-2" />
                              Photos
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Étape 2 - Traitement */}
                <Card className="border-[#E5E7EB]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                        selectedSinistre.status !== 'urgent' ? 'bg-[#2563EB]/10' : 'bg-[#E5E7EB]'
                      }`}>
                        <Clock className={`h-5 w-5 ${
                          selectedSinistre.status !== 'urgent' ? 'text-[#2563EB]' : 'text-[#6B7280]'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#111827]">2. Traitement du dossier</h4>
                          <Badge className={
                            selectedSinistre.status !== 'urgent' 
                              ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20"
                              : "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20"
                          }>
                            {selectedSinistre.status !== 'urgent' ? '⌛ En cours' : '⏸ En attente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">
                          {selectedSinistre.status !== 'urgent' 
                            ? 'Votre dossier est en cours d\'instruction par nos équipes.'
                            : 'En attente de documents complémentaires.'}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-[#111827]">Dossier reçu et enregistré</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-[#10B981]" />
                            <span className="text-[#111827]">Vérification des garanties</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedSinistre.status !== 'urgent' ? (
                              <Clock className="h-4 w-4 text-[#2563EB]" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                            )}
                            <span className="text-[#111827]">Validation du dossier</span>
                          </div>
                        </div>
                        {selectedSinistre.status === 'urgent' && (
                          <div className="mt-3 p-3 bg-[#FFF8EE] border border-[#F59E0B]/20 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-medium text-[#F59E0B] mb-1">Action requise</p>
                                <p className="text-[#6B7280]">{selectedSinistre.prochaine_etape}</p>
                                <Button size="sm" className="mt-2 bg-[#F59E0B] hover:bg-[#D97706]">
                                  <Upload className="h-3 w-3 mr-2" />
                                  Télécharger document
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Étape 3 - Expertise (conditionnelle) */}
                {(selectedSinistre.status === 'expertise' || selectedSinistre.status === 'resolu') && (
                  <Card className="border-[#E5E7EB]">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                          selectedSinistre.status === 'expertise' ? 'bg-[#F59E0B]/10' : 'bg-[#10B981]/10'
                        }`}>
                          <AlertCircle className={`h-5 w-5 ${
                            selectedSinistre.status === 'expertise' ? 'text-[#F59E0B]' : 'text-[#10B981]'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-[#111827]">3. Expertise (optionnel)</h4>
                            <Badge className={
                              selectedSinistre.status === 'expertise'
                                ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                                : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                            }>
                              {selectedSinistre.status === 'expertise' ? '🔍 En cours' : '✓ Terminé'}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#6B7280] mb-3">
                            {selectedSinistre.status === 'expertise'
                              ? 'Un expert évalue les dommages et établit un rapport.'
                              : 'L\'expertise a été réalisée et le rapport est disponible.'}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-[#6B7280]">Expert assigné :</span>
                              <span className="font-medium text-[#111827] ml-2">Cabinet EXPERTISE+</span>
                            </div>
                            <div>
                              <span className="text-[#6B7280]">Montant évalué :</span>
                              <span className="font-medium text-[#2563EB] ml-2">
                                {selectedSinistre.montantEstime?.toLocaleString()}€
                              </span>
                            </div>
                          </div>
                          {selectedSinistre.status === 'expertise' && (
                            <div className="mt-3 p-3 bg-[#EFF6FF] border border-[#2563EB]/20 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <Calendar className="h-4 w-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                  <p className="font-medium text-[#2563EB] mb-1">Prochaine étape</p>
                                  <p className="text-[#6B7280]">{selectedSinistre.prochaine_etape}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedSinistre.status === 'resolu' && (
                            <Button variant="outline" size="sm" className="bg-white">
                              <Download className="h-3 w-3 mr-2" />
                              Télécharger le rapport d'expertise
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Étape 4 - Paiement */}
                <Card className="border-[#E5E7EB]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${
                        selectedSinistre.status === 'resolu' ? 'bg-[#10B981]/10' : 'bg-[#E5E7EB]'
                      }`}>
                        <Euro className={`h-5 w-5 ${
                          selectedSinistre.status === 'resolu' ? 'text-[#10B981]' : 'text-[#6B7280]'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#111827]">4. Indemnisation</h4>
                          <Badge className={
                            selectedSinistre.status === 'resolu'
                              ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                              : "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20"
                          }>
                            {selectedSinistre.status === 'resolu' ? '✓ Versée' : '⏳ À venir'}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6B7280] mb-3">
                          {selectedSinistre.status === 'resolu'
                            ? 'Votre indemnisation a été versée sur votre compte.'
                            : 'Le paiement sera effectué une fois l\'expertise terminée.'}
                        </p>
                        {selectedSinistre.status === 'resolu' && (
                          <>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-[#6B7280]">Montant indemnisé :</span>
                                <span className="font-medium text-[#10B981] ml-2">
                                  {(selectedSinistre.montantEstime! * 0.85).toLocaleString()}€
                                </span>
                              </div>
                              <div>
                                <span className="text-[#6B7280]">Franchise déduite :</span>
                                <span className="font-medium text-[#111827] ml-2">500€</span>
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-[#F0FDF4] border border-[#10B981]/20 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                  <p className="font-medium text-[#10B981] mb-1">Paiement effectué</p>
                                  <p className="text-[#6B7280]">
                                    Le virement a été effectué le 15/12/2023. Délai bancaire : 2-3 jours ouvrés.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions finales */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5E7EB]">
                <Button variant="outline" onClick={() => setShowWorkflowModal(false)}>
                  Fermer
                </Button>
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contacter l'assureur
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}