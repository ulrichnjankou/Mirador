import { useState } from "react";
import { Users, Building2, FileText, BarChart3, Settings, Shield, Plus, Edit, Trash2, Search, Filter, Download, Upload, Eye, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'compliance' | 'produit' | 'support';
  lastLogin: string;
  status: 'active' | 'inactive';
}

interface Insurer {
  id: number;
  name: string;
  logo: string;
  status: 'active' | 'inactive' | 'pending';
  contractDate: string;
  commissionRate: number;
  productsCount: number;
  lastUpdate: string;
}

interface Product {
  id: number;
  insurerId: number;
  insurerName: string;
  name: string;
  type: 'auto' | 'habitation' | 'sante' | 'vie';
  price: number;
  coverageScore: number;
  serviceScore: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdate: string;
  hasIPID: boolean;
  hasCG: boolean;
}

interface Partner {
  id: number;
  name: string;
  category: string;
  region: string;
  discount: string;
  status: 'active' | 'inactive';
  contactEmail: string;
  phone: string;
}

const mockAdminUsers: AdminUser[] = [
  {
    id: 1,
    email: "admin@mirador.fr",
    firstName: "Sophie",
    lastName: "Martin",
    role: "super_admin",
    lastLogin: "2024-01-15T14:30:00Z",
    status: "active"
  },
  {
    id: 2,
    email: "compliance@mirador.fr", 
    firstName: "Marc",
    lastName: "Dubois",
    role: "compliance",
    lastLogin: "2024-01-15T09:15:00Z",
    status: "active"
  }
];

const mockInsurers: Insurer[] = [
  {
    id: 1,
    name: "AXA",
    logo: "/logos/axa.svg",
    status: "active",
    contractDate: "2023-06-15",
    commissionRate: 8.5,
    productsCount: 12,
    lastUpdate: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Groupama",
    logo: "/logos/groupama.svg", 
    status: "active",
    contractDate: "2023-08-20",
    commissionRate: 7.8,
    productsCount: 8,
    lastUpdate: "2024-01-14T15:45:00Z"
  },
  {
    id: 3,
    name: "Direct Assurance",
    logo: "/logos/direct.svg",
    status: "pending",
    contractDate: "2024-01-10",
    commissionRate: 9.0,
    productsCount: 0,
    lastUpdate: "2024-01-10T11:20:00Z"
  }
];

const mockProducts: Product[] = [
  {
    id: 1,
    insurerId: 1,
    insurerName: "AXA",
    name: "Auto Essentiel",
    type: "auto",
    price: 480,
    coverageScore: 85,
    serviceScore: 84,
    status: "active",
    lastUpdate: "2024-01-15T10:30:00Z",
    hasIPID: true,
    hasCG: true
  },
  {
    id: 2,
    insurerId: 1,
    insurerName: "AXA",
    name: "Habitation Plus",
    type: "habitation",
    price: 320,
    coverageScore: 88,
    serviceScore: 86,
    status: "draft",
    lastUpdate: "2024-01-12T14:20:00Z",
    hasIPID: false,
    hasCG: true
  }
];

const mockPartners: Partner[] = [
  {
    id: 1,
    name: "Speedy",
    category: "Automobile",
    region: "Nationale",
    discount: "15%",
    status: "active",
    contactEmail: "partenariat@speedy.fr",
    phone: "01 23 45 67 89"
  },
  {
    id: 2,
    name: "Optic 2000",
    category: "Santé",
    region: "Nationale", 
    discount: "20%",
    status: "active",
    contactEmail: "corporate@optic2000.fr",
    phone: "01 98 76 54 32"
  }
];

export function EspaceAdmin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // États pour les formulaires
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "support" as const,
    password: ""
  });

  const [newInsurer, setNewInsurer] = useState({
    name: "",
    commissionRate: 8,
    contactEmail: "",
    contractDate: "",
    logo: ""
  });

  const [newProduct, setNewProduct] = useState({
    insurerId: 0,
    name: "",
    type: "auto" as const,
    price: 0,
    coverageScore: 80,
    serviceScore: 80
  });

  const [newPartner, setNewPartner] = useState({
    name: "",
    category: "",
    region: "",
    discount: "",
    contactEmail: "",
    phone: ""
  });

  const handleAddUser = () => {
    console.log("Ajout utilisateur:", newUser);
    setNewUser({ email: "", firstName: "", lastName: "", role: "support", password: "" });
    setShowAddModal(false);
  };

  const handleAddInsurer = () => {
    console.log("Ajout assureur:", newInsurer);
    setNewInsurer({ name: "", commissionRate: 8, contactEmail: "", contractDate: "", logo: "" });
    setShowAddModal(false);
  };

  const handleAddProduct = () => {
    console.log("Ajout produit:", newProduct);
    setNewProduct({ insurerId: 0, name: "", type: "auto", price: 0, coverageScore: 80, serviceScore: 80 });
    setShowAddModal(false);
  };

  const handleAddPartner = () => {
    console.log("Ajout partenaire:", newPartner);
    setNewPartner({ name: "", category: "", region: "", discount: "", contactEmail: "", phone: "" });
    setShowAddModal(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'inactive': 
      case 'archived': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'inactive':
      case 'archived': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      super_admin: "Super Admin",
      compliance: "Compliance",
      produit: "Produit",
      support: "Support"
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administration MIRADOR</h1>
          <p className="text-muted-foreground">Gestion du back-office et des données</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Shield className="h-3 w-3 mr-1" />
          Espace sécurisé
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
          <TabsTrigger value="assureurs">Assureurs</TabsTrigger>
          <TabsTrigger value="produits">Produits</TabsTrigger>
          <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-xs text-green-600">+12% ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assureurs partenaires</p>
                    <p className="text-2xl font-bold">30</p>
                    <p className="text-xs text-green-600">+2 ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Offres disponibles</p>
                    <p className="text-2xl font-bold">127</p>
                    <p className="text-xs text-orange-600">En attente: 8</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taux conversion</p>
                    <p className="text-2xl font-bold">12.3%</p>
                    <p className="text-xs text-green-600">+0.8% vs mois dernier</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nouvel assureur validé</p>
                      <p className="text-xs text-muted-foreground">Direct Assurance - il y a 2h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Mise à jour tarifs</p>
                      <p className="text-xs text-muted-foreground">AXA Auto - il y a 4h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Document IPID manquant</p>
                      <p className="text-xs text-muted-foreground">Groupama Habitation - il y a 6h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes système</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">API Groupama indisponible</p>
                      <p className="text-xs text-red-600">Depuis 45 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-800">Quota API MAIF atteint</p>
                      <p className="text-xs text-orange-600">Limite journalière</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">Sauvegarde automatique</p>
                      <p className="text-xs text-blue-600">Dernière: 03:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilisateurs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un utilisateur</DialogTitle>
                  <DialogDescription>
                    Créez un nouveau compte utilisateur avec les permissions appropriées pour accéder au système.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={newUser.role} onValueChange={(value: any) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="produit">Produit</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="password">Mot de passe temporaire</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddUser}>Créer</Button>
                    <Button variant="outline" onClick={() => setShowAddModal(false)}>Annuler</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="produit">Produit</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLogin).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <Badge className={getStatusColor(user.status)}>
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="assureurs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gestion des assureurs</h2>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel assureur
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assureur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Dernière MAJ</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInsurers.map((insurer) => (
                  <TableRow key={insurer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{insurer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Contrat depuis {new Date(insurer.contractDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(insurer.status)}
                        <Badge className={getStatusColor(insurer.status)}>
                          {insurer.status === 'active' ? 'Actif' : 
                           insurer.status === 'pending' ? 'En attente' : 'Inactif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{insurer.commissionRate}%</TableCell>
                    <TableCell>{insurer.productsCount}</TableCell>
                    <TableCell>
                      {new Date(insurer.lastUpdate).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="produits" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Gestion des produits</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau produit
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Assureur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Scores</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          MAJ: {new Date(product.lastUpdate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.insurerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type}</Badge>
                    </TableCell>
                    <TableCell>{product.price}€/an</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>Couverture: {product.coverageScore}/100</div>
                        <div>Service: {product.serviceScore}/100</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Badge variant={product.hasIPID ? "default" : "destructive"} className="text-xs">
                          IPID
                        </Badge>
                        <Badge variant={product.hasCG ? "default" : "destructive"} className="text-xs">
                          CG
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status === 'active' ? 'Actif' : 
                         product.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="partenaires" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Réseau partenaires</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau partenaire
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partenaire</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Remise</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <p className="font-medium">{partner.name}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{partner.category}</Badge>
                    </TableCell>
                    <TableCell>{partner.region}</TableCell>
                    <TableCell>{partner.discount}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>{partner.contactEmail}</div>
                        <div>{partner.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(partner.status)}
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Rapports et analytics</h2>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Comparaisons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Ce mois</span>
                    <span className="font-medium">4,253</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taux conversion</span>
                    <span className="font-medium text-green-600">12.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Économie moyenne</span>
                    <span className="font-medium">284€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Souscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Volume</span>
                    <span className="font-medium">523</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taux abandon</span>
                    <span className="font-medium text-orange-600">18.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">CA généré</span>
                    <span className="font-medium">145K€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">NPS global</span>
                    <span className="font-medium text-green-600">+67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Note moyenne</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sinistres traités</span>
                    <span className="font-medium">127</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top produits par volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge>1</Badge>
                    <span>AXA Auto Essentiel</span>
                  </div>
                  <span className="font-medium">127 souscriptions</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge>2</Badge>
                    <span>MAIF Habitation Tranquillité</span>
                  </div>
                  <span className="font-medium">98 souscriptions</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge>3</Badge>
                    <span>Groupama Santé Plus</span>
                  </div>
                  <span className="font-medium">76 souscriptions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}