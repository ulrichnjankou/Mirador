import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { MainMenu } from "./components/MainMenu";
import { TransparencyBanner } from "./components/TransparencyBanner";
import { Accueil } from "./components/Accueil";
import { ComparateurModern } from "./components/ComparateurModern";
import { ComparateurRefonte } from "./components/ComparateurRefonte";
import { Signature } from "./components/Signature";
import { Avantages } from "./components/Avantages";
import { EspaceClient } from "./components/EspaceClient";
import { EspaceAdmin } from "./components/EspaceAdmin";
import type { User, UserType } from "./types";

// Composant principal qui gère l'état et les routes
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userType, setUserType] = useState<UserType | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [hasComparedOffers, setHasComparedOffers] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [useRefonteComparator, setUseRefonteComparator] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<string>("auto");

  // Récupération de la section actuelle depuis l'URL
  const activeSection = location.pathname.split('/')[1] || 'accueil';

  // Persistance de l'état dans sessionStorage pour éviter la perte lors du refresh
  useEffect(() => {
    // Sauvegarde de l'état
    const stateToSave = {
      userType,
      selectedOfferId,
      hasComparedOffers,
      selectedProductType,
      justSubscribed
    };
    sessionStorage.setItem('mirador_state', JSON.stringify(stateToSave));
  }, [userType, selectedOfferId, hasComparedOffers, selectedProductType, justSubscribed]);

  // Restauration de l'état au chargement
  useEffect(() => {
    const savedState = sessionStorage.getItem('mirador_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.userType) setUserType(parsed.userType);
        if (parsed.selectedOfferId) setSelectedOfferId(parsed.selectedOfferId);
        if (parsed.hasComparedOffers) setHasComparedOffers(parsed.hasComparedOffers);
        if (parsed.selectedProductType) setSelectedProductType(parsed.selectedProductType);
        if (parsed.justSubscribed) setJustSubscribed(parsed.justSubscribed);
      } catch (e) {
        console.error("Erreur lors de la restauration de l'état:", e);
      }
    }
  }, []);

  // Synchronisation de l'état utilisateur
  useEffect(() => {
    if (authenticatedUser && !userType && !authenticatedUser.isAdmin) {
      setUserType('particulier');
    }
  }, [authenticatedUser, userType]);

  const handleUserTypeSelect = useCallback((type: UserType) => {
    setUserType(type);
    navigate('/comparer');
  }, [navigate]);

  const handleUserTypeChange = useCallback((type: UserType) => {
    setUserType(type);
  }, []);

  const handleSectionChange = useCallback((section: string) => {
    // Reset du flag de souscription lors de la navigation
    if (section !== 'espace-client') {
      setJustSubscribed(false);
    }

    // Navigation vers la route appropriée
    navigate(`/${section}`);
  }, [navigate]);

  const handleProfileChange = useCallback(() => {
    setUserType(null);
    setAuthenticatedUser(null);
    setSelectedOfferId(null);
    setHasComparedOffers(false);
    setJustSubscribed(false);
    setIsAdminMode(false);
    sessionStorage.removeItem('mirador_state');
    navigate('/');
  }, [navigate]);

  const handleSubscribe = useCallback((offerId: number) => {
    console.log("App - handleSubscribe called with offerId:", offerId);
    setHasComparedOffers(true);
    setSelectedOfferId(offerId);
    navigate('/signature');
  }, [navigate]);

  const handleGoToEspaceClient = useCallback(() => {
    setJustSubscribed(true);
    navigate('/espace-client');
  }, [navigate]);

  const handleUserAuthenticated = useCallback((user: User) => {
    console.log("App - User authenticated:", user);
    setAuthenticatedUser(user);
    
    if (user.isAdmin) {
      setIsAdminMode(true);
      setUserType(null);
    } else if (!userType) {
      setUserType('particulier');
    }
  }, [userType]);

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) {
      const adminUser: User = {
        id: 999,
        email: "admin@mirador.fr",
        firstName: "Sophie",
        lastName: "Martin",
        membershipLevel: "Admin",
        points: 0,
        isAdmin: true
      };
      setAuthenticatedUser(adminUser);
      setUserType(null);
      navigate('/admin');
    } else {
      setAuthenticatedUser(null);
      setUserType(null);
      navigate('/');
    }
  };

  const handleProductSelect = useCallback((userType: UserType, productType: string) => {
    setUserType(userType);
    setSelectedProductType(productType);
    navigate('/comparer');
  }, [navigate]);

  // Déterminer si on doit masquer le menu/bandeau
  const isRefonteComparatorActive = activeSection === 'comparer' && useRefonteComparator;

  return (
    <div className="min-h-screen bg-background" style={{ minHeight: '100vh', height: 'auto' }}>
      {/* Navigation principale unifiée */}
      {!isRefonteComparatorActive && (
        <MainMenu 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          userType={userType}
          isAdmin={isAdminMode}
          authenticatedUser={authenticatedUser}
        />
      )}
      
      {/* Bandeau de transparence persistant */}
      {activeSection !== "admin" && activeSection !== "accueil" && !isRefonteComparatorActive && (
        <TransparencyBanner />
      )}
      
      {/* Barre de contexte utilisateur */}
      {(userType || isAdminMode || (activeSection === "espace-client")) && (
        <div className="border-b bg-muted/30 py-2">
          <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              {userType && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>Profil :</span>
                  <span className="font-medium text-primary capitalize">{userType}</span>
                </div>
              )}
              
              {authenticatedUser && (
                <div className="flex items-center space-x-2 text-sm">
                  {userType && <span>•</span>}
                  <span>Connecté : {authenticatedUser.firstName} {authenticatedUser.lastName}</span>
                  {authenticatedUser.isAdmin ? (
                    <span className="text-orange-600 font-medium">(Administrateur)</span>
                  ) : (
                    <span className="text-muted-foreground">
                      ({authenticatedUser.points} points • {authenticatedUser.membershipLevel})
                    </span>
                  )}
                </div>
              )}
              
              {selectedOfferId && activeSection === "signature" && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>•</span>
                  <span className="text-green-600">
                    🛡️ Souscription sécurisée - Offre #{selectedOfferId}
                  </span>
                </div>
              )}

              {hasComparedOffers && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>•</span>
                  <span className="text-blue-600">
                    ✓ Comparaison effectuée
                  </span>
                </div>
              )}

              {justSubscribed && activeSection === "espace-client" && (
                <div className="flex items-center space-x-2 text-sm">
                  <span>•</span>
                  <span className="text-green-600">
                    🎉 Souscription réussie ! Bienvenue dans votre espace
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleAdminMode}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border"
              >
                {isAdminMode ? "Quitter admin" : "Mode admin"}
              </button>
              
              {(userType || authenticatedUser) && (
                <button 
                  onClick={handleProfileChange}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
                >
                  {authenticatedUser ? "Se déconnecter" : "Changer de profil"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Routes principales */}
      <main className={
        isRefonteComparatorActive
          ? ""
          : activeSection === "comparer"
            ? "w-full px-4 py-8"
            : "container mx-auto px-4 py-8"
      }>
        <Routes>
          {/* Route Accueil */}
          <Route 
            path="/" 
            element={
              <Accueil 
                onUserTypeSelect={handleUserTypeSelect} 
                onProductSelect={handleProductSelect} 
              />
            } 
          />
          
          {/* Route Comparateur */}
          <Route 
            path="/comparer" 
            element={
              useRefonteComparator ? (
                <ComparateurRefonte 
                  onComplete={(subscriptionId) => {
                    console.log("Souscription complétée:", subscriptionId);
                    handleGoToEspaceClient();
                  }}
                  onNavigateHome={() => navigate('/')}
                />
              ) : userType ? (
                <ComparateurModern 
                  onSubscribe={handleSubscribe}
                  userType={userType}
                  initialProduct={selectedProductType}
                  onUserTypeChange={handleUserTypeChange}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Route Signature */}
          <Route 
            path="/signature" 
            element={
              userType ? (
                <Signature 
                  selectedOfferId={selectedOfferId}
                  onReturnToComparator={() => navigate('/comparer')}
                  authenticatedUser={authenticatedUser}
                  onUserAuthenticated={handleUserAuthenticated}
                  onGoToEspaceClient={handleGoToEspaceClient}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Route Avantages */}
          <Route 
            path="/avantages" 
            element={
              userType ? (
                <Avantages 
                  authenticatedUser={authenticatedUser}
                  onUserAuthenticated={handleUserAuthenticated}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Route Espace Client */}
          <Route 
            path="/espace-client" 
            element={
              <EspaceClient 
                onReturnToComparator={() => navigate('/comparer')}
                authenticatedUser={authenticatedUser}
                onUserAuthenticated={handleUserAuthenticated}
                justSubscribed={justSubscribed}
              />
            } 
          />
          
          {/* Route Admin (protégée) */}
          <Route 
            path="/admin" 
            element={
              isAdminMode && authenticatedUser?.isAdmin ? (
                <EspaceAdmin />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Route 404 - Redirection vers l'accueil */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer */}
      {activeSection !== "admin" && (
        <footer className="border-t mt-16 py-8 bg-[#F3F4F6]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-[#6B7280]">
              <a href="#" className="hover:text-[#2563EB] transition-colors">Mentions légales</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-[#2563EB] transition-colors">Données personnelles</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-[#2563EB] transition-colors">Méthodologie</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-[#2563EB] transition-colors">Contact</a>
            </div>
            
            <div className="text-center mt-4 text-xs text-[#6B7280]">
              © 2024 MIRADOR SAS. Tous droits réservés.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// Composant racine avec BrowserRouter
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
