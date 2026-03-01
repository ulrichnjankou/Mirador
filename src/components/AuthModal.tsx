import { useState } from "react";
import { User, Mail, Lock, UserPlus, LogIn, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  membershipLevel: string;
  points: number;
  isAdmin?: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: User) => void;
  title?: string;
}

// Utilisateurs de test pour simulation
const mockUsers: User[] = [
  {
    id: 1,
    email: "jean.dupont@email.com",
    firstName: "Jean",
    lastName: "Dupont",
    phone: "06 12 34 56 78",
    membershipLevel: "Gold",
    points: 2540
  },
  {
    id: 2,
    email: "marie.martin@email.com",
    firstName: "Marie",
    lastName: "Martin",
    phone: "06 98 76 54 32",
    membershipLevel: "Silver",
    points: 850
  },
  {
    id: 3,
    email: "pierre.bernard@email.com",
    firstName: "Pierre",
    lastName: "Bernard",
    phone: "06 11 22 33 44",
    membershipLevel: "Platinum",
    points: 5200
  }
];

export function AuthModal({ isOpen, onClose, onAuthenticated, title = "Connexion" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulation d'authentification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Recherche de l'utilisateur par email
    const user = mockUsers.find(u => u.email.toLowerCase() === loginData.email.toLowerCase());
    
    if (user && loginData.password === "password") {
      onAuthenticated(user);
      setLoginData({ email: "", password: "" });
      onClose();
    } else {
      setError("Email ou mot de passe incorrect");
    }
    
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }
    
    // Simulation d'inscription
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Date.now(),
      email: registerData.email,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      phone: registerData.phone,
      membershipLevel: "Silver",
      points: 0
    };
    
    onAuthenticated(newUser);
    setRegisterData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    });
    onClose();
    setIsLoading(false);
  };

  const handleQuickLogin = (user: User) => {
    onAuthenticated(user);
    onClose();
  };

  const handleClose = () => {
    setError("");
    setLoginData({ email: "", password: "" });
    setRegisterData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            Connectez-vous ou créez votre compte MIRADOR pour accéder à tous vos avantages
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    type="email"
                    placeholder="exemple@email.com"
                    className="pl-10 transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="login-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center">
              <Button variant="link" className="text-sm">
                Mot de passe oublié ?
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="register-firstName">Prénom</Label>
                  <Input
                    id="register-firstName"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Jean"
                    className="transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="register-lastName">Nom</Label>
                  <Input
                    id="register-lastName"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Dupont"
                    className="transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="pl-10 transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="register-phone">Téléphone (optionnel)</Label>
                <Input
                  id="register-phone"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                  className="transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
              
              <div>
                <Label htmlFor="register-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="pl-10 pr-10 transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="register-confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="pl-10 transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-4" />
        
        {/* Connexion rapide pour test */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Connexion rapide (démonstration)</p>
          <div className="grid gap-2">
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin(user)}
                className="justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                <span>{user.firstName} {user.lastName}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {user.membershipLevel}
                </span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Mot de passe de test : <code className="bg-muted px-1 rounded">password</code>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}