import { useState, useEffect } from "react";
import { Clock, Bookmark, Search, Filter, ArrowRight, Trash2, Star, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import type { FilterState, UserType } from "../types";

export interface ComparisonHistory {
  id: string;
  timestamp: number;
  userType: UserType;
  product: string;
  filters: FilterState;
  resultsCount: number;
  bestOffer?: {
    insurer: string;
    price: number;
    score: number;
  };
  isFavorite: boolean;
  name?: string; // Nom personnalisé donné par l'utilisateur
}

interface ComparateurHistoryProps {
  onRestoreComparison: (history: ComparisonHistory) => void;
  className?: string;
}

// Clé pour le localStorage
const HISTORY_STORAGE_KEY = "mirador_comparison_history";
const MAX_HISTORY_ITEMS = 10; // Réduit pour éviter les problèmes de performance

export function ComparateurHistory({ onRestoreComparison, className = "" }: ComparateurHistoryProps) {
  const [history, setHistory] = useState<ComparisonHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProduct, setFilterProduct] = useState("tous");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Charger l'historique depuis le localStorage de manière sécurisée
  useEffect(() => {
    const loadHistory = () => {
      try {
        setIsLoading(true);
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const validHistory = parsed
              .filter(item => item && typeof item === 'object' && item.id && item.timestamp)
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, MAX_HISTORY_ITEMS);
            setHistory(validHistory);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
        // Nettoyer en cas d'erreur
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Filtrer l'historique de manière sécurisée
  const filteredHistory = history.filter(item => {
    try {
      if (!item || typeof item !== 'object') return false;
      
      const matchesSearch = !searchTerm || 
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.product && item.product.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.bestOffer && item.bestOffer.insurer && item.bestOffer.insurer.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterProduct === "tous" || item.product === filterProduct;
      
      return matchesSearch && matchesFilter;
    } catch (error) {
      console.error("Erreur lors du filtrage:", error);
      return false;
    }
  });

  const favoriteHistory = filteredHistory.filter(item => item?.isFavorite);
  const recentHistory = filteredHistory.filter(item => item && !item.isFavorite);

  const handleRestore = (historyItem: ComparisonHistory) => {
    try {
      onRestoreComparison(historyItem);
      setIsOpen(false);
    } catch (error) {
      console.error("Erreur lors de la restauration:", error);
    }
  };

  const handleToggleFavorite = (id: string) => {
    try {
      const updatedHistory = history.map(item => 
        item && item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      setHistory(updatedHistory);
      saveToStorage(updatedHistory);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    }
  };

  const handleDelete = (id: string) => {
    try {
      const updatedHistory = history.filter(item => item && item.id !== id);
      setHistory(updatedHistory);
      saveToStorage(updatedHistory);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleClearAll = () => {
    try {
      setHistory([]);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Erreur lors du nettoyage:", error);
    }
  };

  const saveToStorage = (historyData: ComparisonHistory[]) => {
    try {
      const validData = historyData.filter(item => item && typeof item === 'object' && item.id);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(validData));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const getProductLabel = (product: string) => {
    const labels: Record<string, string> = {
      'auto': '🚗 Auto',
      'habitation': '🏠 Habitation',
      'sante': '🏥 Santé',
      'vie': '💰 Vie',
      'per': '📊 PER',
      'prevoyance': '🛡️ Prévoyance'
    };
    return labels[product] || product;
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `Il y a ${diffInMinutes} min`;
      } else if (diffInMinutes < 1440) {
        return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
      } else {
        return date.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      return 'Date invalide';
    }
  };

  const HistoryItem = ({ item }: { item: ComparisonHistory }) => {
    if (!item || typeof item !== 'object') return null;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium">
                  {item.name || `Comparaison ${getProductLabel(item.product)}`}
                </span>
                <Badge variant="outline" className="text-xs">
                  {item.userType}
                </Badge>
                {item.isFavorite && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div>📅 {formatDate(item.timestamp)}</div>
                <div>🔍 {item.resultsCount || 0} offres trouvées</div>
                {item.bestOffer && (
                  <div>🏆 Meilleure: {item.bestOffer.insurer} - {item.bestOffer.price}€</div>
                )}
                <div>⚙️ {Object.keys(item.filters || {}).length} filtres appliqués</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFavorite(item.id)}
                className="h-8 w-8 p-0"
              >
                <Star 
                  className={`h-4 w-4 ${
                    item.isFavorite 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-muted-foreground hover:text-yellow-400'
                  }`} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleRestore(item)}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reprendre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Clock className="h-4 w-4 mr-2" />
          Historique ({history.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Historique des comparaisons</span>
            <Badge variant="secondary">{history.length} comparaisons</Badge>
          </DialogTitle>
          <DialogDescription>
            Reprenez une comparaison précédente avec tous vos filtres et critères sauvegardés.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'historique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les produits</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="habitation">Habitation</SelectItem>
                <SelectItem value="sante">Santé</SelectItem>
                <SelectItem value="vie">Vie</SelectItem>
                <SelectItem value="per">PER</SelectItem>
                <SelectItem value="prevoyance">Prévoyance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                  <p>Chargement de l'historique...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune comparaison sauvegardée</p>
                  <p className="text-sm">Vos comparaisons apparaîtront ici automatiquement</p>
                </div>
              ) : (
                <>
                  {/* Favoris */}
                  {favoriteHistory.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <h4 className="font-medium">Favoris</h4>
                        <Badge variant="outline">{favoriteHistory.length}</Badge>
                      </div>
                      <div className="space-y-3">
                        {favoriteHistory.map((item) => (
                          <HistoryItem key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {favoriteHistory.length > 0 && recentHistory.length > 0 && (
                    <Separator />
                  )}

                  {/* Récentes */}
                  {recentHistory.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">Récentes</h4>
                        <Badge variant="outline">{recentHistory.length}</Badge>
                      </div>
                      <div className="space-y-3">
                        {recentHistory.map((item) => (
                          <HistoryItem key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          {history.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                💡 Les comparaisons sont sauvegardées automatiquement
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tout effacer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Fonction utilitaire pour sauvegarder une comparaison de manière sécurisée
export function saveComparison(
  userType: UserType,
  product: string,
  filters: FilterState,
  resultsCount: number,
  bestOffer?: { insurer: string; price: number; score: number }
): void {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    const existingHistory: ComparisonHistory[] = stored ? JSON.parse(stored) : [];
    
    // Valider que existingHistory est bien un array
    const validHistory = Array.isArray(existingHistory) 
      ? existingHistory.filter(item => item && typeof item === 'object' && item.id)
      : [];
    
    const newComparison: ComparisonHistory = {
      id: `comparison_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      userType,
      product,
      filters: filters || {},
      resultsCount: resultsCount || 0,
      bestOffer,
      isFavorite: false
    };

    const updatedHistory = [newComparison, ...validHistory]
      .slice(0, MAX_HISTORY_ITEMS); // Limiter le nombre d'éléments

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la comparaison:", error);
  }
}