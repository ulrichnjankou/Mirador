import { useState } from "react";
import { Menu, X, User, Shield, ChevronDown, Book } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { DefinitionsGuide } from "./DefinitionsGuide";
import type { User as UserType, UserType as UserTypeEnum } from "../types";

interface MainMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userType?: UserTypeEnum | null;
  isAdmin?: boolean;
  authenticatedUser?: UserType | null;
}

export function MainMenu({ 
  activeSection, 
  onSectionChange, 
  userType, 
  isAdmin = false,
  authenticatedUser 
}: MainMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Seulement 4 onglets principaux
  const menuItems = [
    { id: "accueil", label: "Accueil", public: true },
    { id: "comparer", label: "Comparer", requiresUserType: true },
    { id: "avantages", label: "Avantages", requiresUserType: true },
    { id: "espace-client", label: "Espace Client", public: true }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.public) return true;
    if (item.requiresUserType) return userType || isAdmin;
    return true;
  });

  const handleMenuClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo et nom */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => handleMenuClick("accueil")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  MIRADOR
                </h1>
              </div>
            </button>
          </div>

          {/* Menu principal desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredMenuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => handleMenuClick(item.id)}
                className="relative"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Actions utilisateur - simplifié */}
          <div className="flex items-center space-x-2">
            
            {/* Profil utilisateur - simplifié sans niveau platine visible */}
            {authenticatedUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <span className="hidden sm:inline">
                      {authenticatedUser.firstName}
                    </span>
                    <span className="sm:hidden">
                      <User className="h-4 w-4" />
                    </span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {authenticatedUser.firstName} {authenticatedUser.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {authenticatedUser.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleMenuClick("espace-client")}>
                    Mon espace
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuClick("avantages")}>
                    Mes avantages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleMenuClick("espace-client")}>
                Connexion
              </Button>
            )}

            {/* Menu mobile toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="py-4 space-y-2">
              {filteredMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => handleMenuClick(item.id)}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}