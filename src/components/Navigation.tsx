import { Search, FileText, Gift, User, Eye } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const sections = [
    { id: 'comparer', label: 'Comparer', icon: Search },
    { id: 'signature', label: 'Signature', icon: FileText },
    { id: 'avantages', label: 'Avantages', icon: Gift },
    { id: 'espace-client', label: 'Espace Client', icon: User },
  ];

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold text-primary">MIRADOR</h1>
              <p className="text-xs text-muted-foreground">L'assurance à la portée de tous</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  onClick={() => onSectionChange(section.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Se connecter</Button>
          </div>
        </div>
      </div>
    </header>
  );
}