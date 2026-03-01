import { useState, useCallback, useEffect } from "react";
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

export default function App() {
  const [activeSection, setActiveSection] = useState("accueil");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [hasComparedOffers, setHasComparedOffers] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [useRefonteComparator, setUseRefonteComparator] = useState(true); // Toggle pour la refonte
  
  // Mode admin simulé (en production, ceci viendrait de l'authentification)
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Synchronisation de l'état utilisateur
  useEffect(() => {
    // Si un utilisateur est connecté et qu'aucun profil n'est défini, on définit par défaut "particulier"
    if (authenticatedUser && !userType && !authenticatedUser.isAdmin) {
      setUserType('particulier');
    }
  }, [authenticatedUser, userType]);

  const handleUserTypeSelect = useCallback((type: UserType) => {
    setUserType(type);
    setActiveSection("comparer");
  }, []);

  // Gestion du changement de profil par l'IA
  const handleUserTypeChange = useCallback((type: UserType) => {
    setUserType(type);
  }, []);

  const handleSectionChange = useCallback((section: string) => {
    // Mapping des sections pour le nouveau système de navigation
    const sectionMapping: { [key: string]: string } = {
      "comparer": "comparer",
      "signature": "signature", 
      "avantages": "avantages",
      "espace-client": "espace-client",
      "admin": "admin",
      "accueil": "accueil"
    };

    const mappedSection = sectionMapping[section] || section;
    
    // L'espace admin ne nécessite pas de type d'utilisateur
    if (mappedSection === "admin") {
      setActiveSection(mappedSection);
      return;
    }
    
    // Navigation intelligente vers l'espace client
    if (mappedSection === "espace-client") {
      // L'EspaceClient gère maintenant sa propre authentification
      setActiveSection(mappedSection);
      setJustSubscribed(false); // Reset du flag de souscription
      return;
    }

    // Si on essaie d'aller à une section autre que l'accueil sans avoir choisi de type d'utilisateur
    if (mappedSection !== "accueil" && !userType && !authenticatedUser?.isAdmin) {
      setActiveSection("accueil");
      return;
    }
    setActiveSection(mappedSection);
  }, [userType, authenticatedUser]);

  const handleProfileChange = useCallback(() => {
    setUserType(null);
    setActiveSection("accueil");
    setAuthenticatedUser(null);
    setSelectedOfferId(null);
    setHasComparedOffers(false);
    setJustSubscribed(false);
    setIsAdminMode(false);
  }, []);

  const handleSubscribe = useCallback((offerId: number) => {
    console.log("App.tsx - handleSubscribe called with offerId:", offerId);
    // Marquer qu'une comparaison a été faite
    setHasComparedOffers(true);
    setSelectedOfferId(offerId);
    setActiveSection("signature");
  }, []);

  // Nouvelle fonction pour aller à l'espace client après souscription
  const handleGoToEspaceClient = useCallback(() => {
    setJustSubscribed(true); // Marquer qu'on vient de souscrire
    setActiveSection("espace-client");
  }, []);

  // Gestion centralisée de l'authentification
  const handleUserAuthenticated = useCallback((user: User) => {
    console.log("App.tsx - User authenticated:", user);
    setAuthenticatedUser(user);
    
    // Si c'est un admin, on active le mode admin
    if (user.isAdmin) {
      setIsAdminMode(true);
      setUserType(null); // Les admins n'ont pas de userType
    } else if (!userType) {
      // Si c'est un utilisateur normal sans profil défini, on met "particulier" par défaut
      setUserType('particulier');
    }
  }, [userType]);

  // Fonction pour basculer en mode admin (pour test)
  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) {
      // Simulation d'un utilisateur admin
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
      setUserType(null); // Les admins n'ont pas de userType
    } else {
      setAuthenticatedUser(null);
      setUserType(null);
    }
  };

  const [selectedProductType, setSelectedProductType] = useState<string>("auto");

  const handleProductSelect = useCallback((userType: UserType, productType: string) => {
    setUserType(userType);
    setSelectedProductType(productType);
    setActiveSection("comparer");
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "accueil":
        return <Accueil onUserTypeSelect={handleUserTypeSelect} onProductSelect={handleProductSelect} />;
      case "comparer":
        // Basculer entre ancien et nouveau comparateur
        if (useRefonteComparator) {
          return (
            <ComparateurRefonte 
              onComplete={(subscriptionId) => {
                console.log("Souscription complétée:", subscriptionId);
                handleGoToEspaceClient();
              }}
              onNavigateHome={() => setActiveSection("accueil")}
            />
          );
        }
        return userType ? (
          <ComparateurModern 
            onSubscribe={handleSubscribe}
            userType={userType}
            initialProduct={selectedProductType}
            onUserTypeChange={handleUserTypeChange}
          />
        ) : (
          <Accueil onUserTypeSelect={handleUserTypeSelect} onProductSelect={handleProductSelect} />
        );
      case "signature":
        return userType ? (
          <Signature 
            selectedOfferId={selectedOfferId}
            onReturnToComparator={() => setActiveSection("comparer")}
            authenticatedUser={authenticatedUser}
            onUserAuthenticated={handleUserAuthenticated}
            onGoToEspaceClient={handleGoToEspaceClient} // Nouvelle prop
          />
        ) : (
          <Accueil onUserTypeSelect={handleUserTypeSelect} onProductSelect={handleProductSelect} />
        );
      case "avantages":
        return userType ? (
          <Avantages 
            authenticatedUser={authenticatedUser}
            onUserAuthenticated={handleUserAuthenticated}
          />
        ) : (
          <Accueil onUserTypeSelect={handleUserTypeSelect} onProductSelect={handleProductSelect} />
        );
      case "espace-client":
        // L'espace client gère maintenant sa propre authentification
        return (
          <EspaceClient 
            onReturnToComparator={() => setActiveSection("comparer")}
            authenticatedUser={authenticatedUser}
            onUserAuthenticated={handleUserAuthenticated}
            justSubscribed={justSubscribed} // Nouvelle prop pour indiquer si on vient de souscrire
          />
        );
      case "admin":
        return isAdminMode && authenticatedUser?.isAdmin ? (
          <EspaceAdmin />
        ) : (
          <Accueil onUserTypeSelect={handleUserTypeSelect} onProductSelect={handleProductSelect} />
        );
      default:
        return <Accueil onUserTypeSelect={handleUserTypeSelect} onProductSelect={handleProductSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ minHeight: '100vh', height: 'auto' }}>
      {/* Navigation principale unifiée - masquée pour ComparateurRefonte */}
      {!(activeSection === "comparer" && useRefonteComparator) && (
        <MainMenu 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          userType={userType}
          isAdmin={isAdminMode}
          authenticatedUser={authenticatedUser}
        />
      )}
      
      {/* Bandeau de transparence persistant - masqué en mode admin et ComparateurRefonte */}
      {activeSection !== "admin" && activeSection !== "accueil" && !(activeSection === "comparer" && useRefonteComparator) && (
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
              {/* Bouton de bascule admin pour test */}
              <button 
                onClick={toggleAdminMode}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border"
              >
                {isAdminMode ? "Quitter admin" : "Mode admin"}
              </button>
              
              {/* Bouton de changement de profil - plus intelligent */}
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
      
      {/* Contenu principal - Adapté pour le nouveau layout */}
      <main className={
        activeSection === "comparer" && useRefonteComparator
          ? "" // Le ComparateurRefonte gère son propre layout complet
          : activeSection === "comparer"
            ? "w-full px-4 py-8" // Pour l'ancien comparateur
            : "container mx-auto px-4 py-8" // Pour les autres sections
      }>
        {renderSection()}
      </main>
      
      {/* Footer enrichi - masqué en mode admin */}
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