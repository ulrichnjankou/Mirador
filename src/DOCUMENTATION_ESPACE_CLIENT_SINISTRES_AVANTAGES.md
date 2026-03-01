# Documentation Complète - Espace Client, Gestion des Sinistres & Écosystème Avantages

## Vue d'ensemble

Cette documentation détaille trois sections majeures de la plateforme MIRADOR :

1. **Espace Client** - Gestion centralisée des contrats d'assurance
2. **Gestion des Sinistres** - Workflow complet de déclaration et suivi des sinistres
3. **Écosystème Avantages** - Programme de fidélité multi-univers avec 50 partenaires

---

## 1. ESPACE CLIENT

### 1.1 Vue d'ensemble

L'Espace Client offre une interface centralisée pour gérer l'ensemble des contrats d'assurance d'un utilisateur. Il implémente un design minimaliste premium avec une hiérarchie visuelle claire et des interactions fluides.

**Fichier principal** : `/components/EspaceClient.tsx`

### 1.2 Architecture et navigation

#### Système d'onglets principal
L'espace client s'organise autour de 3 onglets principaux :

```typescript
<Tabs value={activeSection} onValueChange={setActiveSection}>
  <TabsList>
    <TabsTrigger value="vue-ensemble">Vue d'ensemble</TabsTrigger>
    <TabsTrigger value="contrats">Contrats</TabsTrigger>
    <TabsTrigger value="sinistres">Sinistres</TabsTrigger>
  </TabsList>
</Tabs>
```

### 1.3 Authentification et sécurité

#### Système d'authentification
- **Composant** : `AuthModal` (intégré)
- **Contrôle d'accès** : Redirection automatique si non authentifié
- **Props requises** :
  - `authenticatedUser`: Utilisateur connecté
  - `onUserAuthenticated`: Callback après connexion réussie

#### Flow d'authentification
```typescript
useEffect(() => {
  if (!authenticatedUser) {
    setShowAuthModal(true);
  }
}, [authenticatedUser]);
```

**État non connecté** :
- Affichage d'une carte d'invitation à la connexion
- Bouton "Se connecter" déclenchant l'ouverture de l'AuthModal
- Blocage de l'accès aux données sensibles

### 1.4 Vue d'ensemble (Dashboard)

#### KPIs principaux
Trois cartes d'indicateurs clés affichent :

**1. Total Primes**
- Montant annuel total de toutes les primes
- Conversion automatique en mensualité
- Icône : `Euro`
```typescript
const totalPrimes = mockContrats.reduce((sum, c) => sum + c.primeAnnuelle, 0);
```

**2. Contrats Actifs**
- Nombre de contrats en cours
- Ratio sur le total des contrats
- Icône : `CheckCircle` (vert)
```typescript
const contratsActifs = mockContrats.filter(c => c.statut === "Actif").length;
```

**3. Contrats à renouveler**
- Nombre de contrats arrivant à échéance
- Opportunité d'optimisation tarifaire
- Icône : `RefreshCw` (orange)
```typescript
const contratsARecoter = mockContrats.filter(c => c.statut === "À renouveler").length;
```

#### Actions rapides
Quatre actions principales sont mises en avant :

1. **Nouvelle comparaison** 
   - Retour au comparateur
   - Icône : `Search`
   - Action : `onReturnToComparator()`

2. **Télécharger documents**
   - Accès rapide aux documents contractuels
   - Icône : `Download`

3. **Déclarer sinistre**
   - Navigation vers l'onglet Sinistres
   - Icône : `Plus`
   - Action : `setActiveSection("sinistres")`

4. **Mes avantages**
   - Accès au programme de fidélité
   - Icône : `Gift`

**Design système** :
- Couleur de fond : `bg-[#F9FAFB]`
- Bordure : `border-[#E5E7EB]`
- Hover : `hover:bg-[#2563EB]/5 hover:border-[#2563EB]`
- Icônes : `text-[#2563EB]`

#### Échéancier des prélèvements
Liste chronologique des prochains paiements :

**Informations affichées** :
- Date du prélèvement (format français long)
- Assureur et produit
- Montant mensuel
- Icône du type d'assurance

**Tri automatique** :
```typescript
mockContrats.sort((a, b) => 
  new Date(a.prochainPrelevement).getTime() - 
  new Date(b.prochainPrelevement).getTime()
)
```

**UI** :
- Card par prélèvement
- Fond `bg-[#F9FAFB]` avec transition `hover:bg-white`
- Icône calendrier en badge bleu
- Prix mis en avant (taille XL, couleur primaire)

#### Contrats bientôt à renouveler
Section conditionnelle (affichée uniquement si `contratsARecoter > 0`) :

**Caractéristiques** :
- Fond bleu clair : `bg-[#EFF6FF]`
- Bordure bleue subtile : `border-[#2563EB]/20`
- Badge compteur en haut à droite
- Calcul automatique des jours restants
- Bouton CTA "Revoir mes options" (retour comparateur)

**Calcul des jours restants** :
```typescript
const joursRestants = Math.ceil(
  (dateEcheance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
);
```

### 1.5 Gestion des Contrats

#### Système de recherche et filtrage

**Barre de recherche** :
- Placeholder : "Rechercher un contrat par assureur, produit ou numéro..."
- Recherche en temps réel sur :
  - Nom de l'assureur
  - Nom du produit
  - Numéro de contrat
- Icône : `Search` (positionnée à gauche)

**Filtre par type** :
- Dropdown avec 5 options :
  - Tous les contrats
  - Auto
  - Habitation
  - Santé
  - Épargne (Vie)

**Logique de filtrage** :
```typescript
const filteredContrats = mockContrats.filter(contrat => {
  const matchesSearch = searchTerm === "" || 
    contrat.assureur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.numeroContrat.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesFilter = filterType === "tous" || contrat.type === filterType;
  
  return matchesSearch && matchesFilter;
});
```

#### Architecture en accordéons

Chaque contrat est représenté par une **Card accordéon** avec deux états :

##### État replié (Bandeau synthétique)
Toujours visible, affiche :

**Partie gauche** :
- Icône du type d'assurance (12x12, fond bleu clair)
- Nom de l'assureur (titre)
- Badge de statut (voir section Badges)
- Nom du produit (sous-titre)
- Numéro de contrat (petite taille)

**Partie centrale-droite** :
- Prix mensuel (grand, bleu primaire)
- Prix annuel (petit, gris)
- Date d'échéance avec icône calendrier

**Partie droite** :
- Icône chevron (up/down selon l'état)

**Interaction** :
- Clic sur tout le bandeau pour déplier/replier
- Effet hover : `hover:bg-[#F9FAFB]`
- Transition fluide

##### État déplié (Contenu détaillé)
Affiche 4 blocs d'informations :

**BLOC A : Garanties incluses**
- Titre avec icône `Shield`
- Liste en grille 2 colonnes
- Icône `CheckCircle` verte par garantie
- Mention de la franchise si applicable

```typescript
<div className="grid md:grid-cols-2 gap-3">
  {contrat.garanties.map((garantie, idx) => (
    <div key={idx} className="flex items-center space-x-2 text-sm">
      <CheckCircle className="h-4 w-4 text-[#10B981]" />
      <span>{garantie}</span>
    </div>
  ))}
</div>
```

**BLOC B : Documents & Attestations**
- Titre avec icône `FileText`
- Composant `AttestationDownload` intégré
- Bouton "Documents contractuels"
- Date d'envoi des documents

**BLOC C : Gestion des sinistres**
- Titre avec icône `AlertTriangle`
- Affichage du dernier sinistre (ou "Aucun sinistre déclaré")
- Bouton CTA "Déclarer un sinistre" (navigation vers onglet Sinistres)

```typescript
{mockSinistres.find(s => s.contratId === contrat.id) 
  ? `${mockSinistres.find(s => s.contratId === contrat.id)?.statut} - ${mockSinistres.find(s => s.contratId === contrat.id)?.description}`
  : "Aucun sinistre déclaré"}
```

**BLOC D : Gérer mon contrat**
- Titre avec icône `Settings`
- Actions possibles :
  - Modifier RIB (bouton outline)
  - Mettre à jour mes informations (bouton outline)
  - Évaluer mes options (si statut "À renouveler", bouton jaune)
- **Section résiliation** :
  - Message informatif sur les alternatives
  - Bouton "Demander une résiliation" (style ghost, discret)

**Design du contenu déplié** :
- Fond : `bg-[#F9FAFB]/50`
- Bordure supérieure : `border-t border-[#E5E7EB]`
- Padding : `p-6`
- Espacement entre blocs : `space-y-6`
- Animation : `transition-all duration-200`

#### Badges de statut

Fonction `getStatutBadge()` :

```typescript
const getStatutBadge = (statut: string) => {
  switch (statut) {
    case "Actif":
      return <Badge className="bg-green-100 text-green-800 border-green-200">
        ✓ Actif
      </Badge>;
    case "À renouveler":
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">
        📊 À renouveler
      </Badge>;
    case "Expiré":
      return <Badge variant="destructive">⚠️ Expiré</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};
```

#### Modèle de données Contrat

```typescript
interface Contrat {
  id: number;
  type: "auto" | "habitation" | "sante" | "vie";
  assureur: string;
  produit: string;
  // Informations spécifiques selon le type
  vehicule?: string;        // Pour auto
  logement?: string;        // Pour habitation
  beneficiaires?: string;   // Pour santé/vie
  // Tarification
  primeAnnuelle: number;
  primeMensuelle: number;
  franchise: number;
  // Dates
  dateEcheance: string;           // Format ISO
  prochainPrelevement: string;    // Format ISO
  dernierPaiement: string;        // Format ISO
  // Statut
  statut: "Actif" | "À renouveler" | "Expiré";
  numeroContrat: string;
  // Couverture
  garanties: string[];
  documents: string[];
  // UI
  icon: LucideIcon;
  color: string;
}
```

### 1.6 Animation de bienvenue (nouveaux souscripteurs)

Si `justSubscribed={true}` est passé en prop :

**Caractéristiques** :
- Card avec gradient vert : `from-green-50 to-emerald-50`
- Icône `PartyPopper` avec animation bounce
- Message de bienvenue personnalisé
- Points clés :
  - ✓ Documents disponibles
  - ✓ +500 points fidélité
  - ✓ Assistance 24h/7j
- Confettis animés en overlay (emojis avec animations CSS)
- Bouton de fermeture (croix)
- Auto-disparition après 5 secondes

```typescript
useEffect(() => {
  if (justSubscribed) {
    setShowWelcomeAnimation(true);
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [justSubscribed]);
```

### 1.7 Header utilisateur

Toujours visible en haut de l'espace client :

**Informations affichées** :
- Avatar (cercle avec icône `User`)
- Message personnalisé : "Bonjour {firstName} !"
- Description : "Gérez vos contrats et profitez de vos avantages fidélité"
- Badge du niveau de fidélité (Bronze/Silver/Gold/Platinum)
- Compteur de points fidélité
- Badge "Nouveau client !" si `justSubscribed` (avec animation pulse)

**Boutons d'action** :
- Notifications (icône `Bell`)
- Paramètres (icône `Settings`)

**Design** :
- Fond gradient : `from-primary/5 to-blue-100`
- Bordure subtile : `border-primary/20`

---

## 2. GESTION DES SINISTRES

### 2.1 Vue d'ensemble

Le module de gestion des sinistres offre un workflow complet en 4 étapes pour la déclaration et le suivi des sinistres. Il implémente un design minimaliste premium cohérent avec l'espace client.

**Fichier principal** : `/components/SinistresManager.tsx`

### 2.2 Props et intégration

```typescript
interface SinistresManagerProps {
  sinistres: any[];      // Liste des sinistres existants
  contrats: Contrat[];   // Liste des contrats pour référence
}
```

**Utilisation** :
```typescript
<SinistresManager 
  sinistres={mockSinistres}
  contrats={mockContrats}
/>
```

### 2.3 Interface utilisateur

#### Header de section
- Titre : "Gestion des sinistres"
- Bouton "Réinitialiser" (icône `RotateCcw`)
  - Reset de la recherche et des filtres
- Bouton CTA "Nouveau sinistre" (bleu primaire)
  - Icône `Plus`
  - Action : Ouverture du formulaire de déclaration

#### Barre de recherche et filtres

**Recherche** :
- Champ avec icône `Search` à gauche
- Placeholder : "Rechercher par numéro, description ou assureur..."
- Recherche en temps réel sur :
  - Numéro de sinistre
  - Description
  - Nom de l'assureur
- Fond : `bg-[#F9FAFB]`

**Filtre par statut** :
Dropdown avec 5 options :
1. Tous les statuts
2. En cours
3. En expertise
4. Urgent
5. Résolu

**Logique de filtrage** :
```typescript
const filteredSinistres = mockSinistres.filter(sinistre => {
  const matchesSearch = 
    sinistre.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sinistre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sinistre.assureur.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesFilter = filterStatus === "tous" || sinistre.status === filterStatus;
  
  return matchesSearch && matchesFilter;
});
```

### 2.4 Cartes de sinistres

Chaque sinistre est représenté par une **Card détaillée** structurée en 3 blocs :

#### BLOC 1 : Bandeau synthèse
Toujours visible en haut de la card :

**Partie gauche** :
- Icône du type de sinistre (12x12)
  - Auto → `Car` (bleu)
  - Habitation → `Home` (vert)
  - Santé → `Heart` (bleu)
- Numéro de sinistre (titre)
- Badge de statut (voir section Badges)
- Date de déclaration
- Assureur • Numéro de contrat

**Partie droite** :
- "Montant estimé" (label gris)
- Montant en grand (XL, bleu, avec icône `Euro`)

**Design** :
- Bordure inférieure : `border-b border-[#E5E7EB]`
- Padding : `p-6`

#### BLOC 2 : Description détaillée
- Titre : "Description du sinistre" (avec icône `FileText`)
- Texte de description complet
- Badge de garantie concernée
- Fond : `bg-[#F9FAFB]/50`
- Padding : `p-6`

#### BLOC 3 : Workflow & Actions
Section interactive avec timeline et actions :

**Timeline de traitement** (4 étapes) :
Voir section 2.5 pour le détail complet

**Actions disponibles** :
- Boutons contextuels selon le statut
- Exemples :
  - "Télécharger rapport expertise"
  - "Contacter l'expert"
  - "Voir les détails"
  - "Ajouter documents"

### 2.5 Workflow de traitement (4 étapes)

Le workflow visualise les 4 étapes du traitement d'un sinistre :

#### Étape 1 : Déclaration
- Icône : `FileText`
- Titre : "Déclaration"
- Description : "Sinistre déclaré le [date]"
- Statut : Toujours complété (vert)

#### Étape 2 : Traitement initial
- Icône : `Clock`
- Titre : "Traitement"
- Description : "Dossier en cours d'instruction"
- Statut : 
  - Complété (vert) si statut ≥ "en_cours"
  - En cours si statut actuel
  - Non commencé (gris) sinon

#### Étape 3 : Expertise (optionnelle)
- Icône : `Search` (ou `AlertCircle` si urgent)
- Titre : "Expertise"
- Description contextuelle selon le statut
- Statut :
  - Complété si statut = "resolu"
  - En cours si statut = "expertise" ou "urgent"
  - Non commencé sinon
- Peut afficher un badge "Urgent" en rouge

#### Étape 4 : Paiement
- Icône : `CheckCircle` ou `Euro`
- Titre : "Indemnisation"
- Description : "Virement effectué le [date]" ou "En attente de validation"
- Statut :
  - Complété (vert) si statut = "resolu"
  - En cours sinon

**Représentation visuelle** :
- Connexion entre les étapes : lignes verticales
- États visuels :
  - Complété : Fond vert `bg-[#10B981]`, Icône blanche
  - En cours : Fond bleu `bg-[#2563EB]`, Icône blanche, animation pulse
  - Non commencé : Fond gris `bg-[#E5E7EB]`, Icône grise

**Prochaine étape** :
Affichage d'une alerte informative sous la timeline :
```typescript
<Alert className="bg-[#EFF6FF] border-[#2563EB]/20">
  <AlertCircle className="h-4 w-4 text-[#2563EB]" />
  <AlertDescription>
    <span className="font-medium">Prochaine étape :</span> {sinistre.prochaine_etape}
  </AlertDescription>
</Alert>
```

### 2.6 Badges de statut

Fonction `getStatusBadge()` :

```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'en_cours':
      return <Badge className="bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20">
        En cours
      </Badge>;
    case 'expertise':
      return <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20">
        En expertise
      </Badge>;
    case 'urgent':
      return <Badge className="bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20">
        Urgent
      </Badge>;
    case 'resolu':
      return <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
        Résolu
      </Badge>;
    default:
      return <Badge className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">
        {status}
      </Badge>;
  }
};
```

### 2.7 Icônes par type

Fonction `getTypeIcon()` :

```typescript
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
```

### 2.8 Modèle de données Sinistre

```typescript
interface Sinistre {
  id: string;
  numero: string;               // Format: "2024-AUTO-001234"
  type: string;                 // "Automobile", "Habitation", "Santé"
  status: 'en_cours' | 'expertise' | 'urgent' | 'resolu';
  dateDeclaration: string;      // Format ISO
  dateSinistre: string;         // Format ISO
  description: string;          // Description détaillée
  montantEstime?: number;       // Montant estimé des dégâts
  assureur: string;             // Nom de l'assureur
  contrat: string;              // Numéro du contrat associé
  garantie?: string;            // Garantie concernée
  prochaine_etape?: string;     // Description de la prochaine action
}
```

### 2.9 Modal de workflow détaillé

État géré par :
```typescript
const [showWorkflowModal, setShowWorkflowModal] = useState(false);
const [selectedSinistre, setSelectedSinistre] = useState<Sinistre | null>(null);
```

**Contenu de la modal** :
- Header avec numéro de sinistre et badge de statut
- Timeline complète et détaillée
- Historique des actions
- Documents associés
- Notes et commentaires
- Actions contextuelles

**Déclenchement** :
Clic sur un bouton "Voir les détails" dans une carte de sinistre

---

## 3. ÉCOSYSTÈME AVANTAGES & PARTENAIRES

### 3.1 Vue d'ensemble

L'écosystème de fidélité MIRADOR est inspiré du système Flying Blue (Air France-KLM). Il propose un programme multi-niveaux avec 5 univers d'assurance et **50 partenaires intégrés**.

**Fichier principal** : `/components/AvantagesPage.tsx`

### 3.2 Système de fidélité

#### 4 niveaux de statut

Configuration des niveaux :

```typescript
const loyaltyLevels = {
  bronze: { 
    min: 0, 
    max: 2999, 
    color: '#CD7F32', 
    next: 'silver', 
    pointsNeeded: 3000 
  },
  silver: { 
    min: 3000, 
    max: 6999, 
    color: '#C0C0C0', 
    next: 'gold', 
    pointsNeeded: 7000 
  },
  gold: { 
    min: 7000, 
    max: 14999, 
    color: '#FFD700', 
    next: 'platinum', 
    pointsNeeded: 15000 
  },
  platinum: { 
    min: 15000, 
    max: Infinity, 
    color: '#E5E4E2', 
    next: null, 
    pointsNeeded: null 
  }
};
```

**Icônes de statut** :
- Bronze : 🥉
- Silver : 🥈
- Gold : 🥇
- Platinum : 💎

#### Progression entre niveaux

Calcul automatique du pourcentage de progression :

```typescript
const progressPercent = currentLevel.next 
  ? ((currentUser.points - currentLevel.min) / 
     (currentLevel.max - currentLevel.min)) * 100
  : 100;
```

**Affichage visuel** :
- Barre de progression avec `<Progress />`
- Texte : "X points sur Y pour atteindre [niveau suivant]"
- Couleur de la barre adaptée au niveau actuel

### 3.3 Les 5 univers d'assurance

Chaque univers a sa propre identité visuelle :

#### 1. Auto
- ID : `auto`
- Icône : `Car`
- Couleur : `#2563EB` (Bleu primaire)
- Fond : `#EFF6FF` (Bleu très clair)
- Description : "Avantages automobile"

#### 2. Habitation
- ID : `habitation`
- Icône : `Home`
- Couleur : `#10B981` (Vert)
- Fond : `#F0FDF4` (Vert très clair)
- Description : "Avantages logement"

#### 3. Santé & Bien-être
- ID : `sante`
- Icône : `Heart`
- Couleur : `#EC4899` (Rose)
- Fond : `#FDF2F8` (Rose très clair)
- Description : "Santé et prévention"

#### 4. Vie & Épargne
- ID : `epargne`
- Icône : `PiggyBank`
- Couleur : `#8B5CF6` (Violet)
- Fond : `#F5F3FF` (Violet très clair)
- Description : "Investissement et patrimoine"

#### 5. Services quotidiens
- ID : `services`
- Icône : `ShoppingBag`
- Couleur : `#F59E0B` (Orange)
- Fond : `#FFF8EE` (Orange très clair)
- Description : "Vie quotidienne"

### 3.4 Les 50 partenaires

Répartition : **10 partenaires par univers**

#### AUTO (10 partenaires)
1. **Total Energies** - Carburant
   - 500 pts → -10% sur pleins
   - Validité : 3 mois

2. **Norauto** - Entretien
   - 800 pts → -15% révision complète
   - Validité : 6 mois

3. **Michelin** - Pneumatiques ⭐ Premium
   - 1200 pts → -20% pneus premium
   - Validité : 1 an

4. **Carglass** - Pare-brise
   - 300 pts → Réparation offerte
   - Validité : 2 mois

5. **Europcar** - Location
   - 1500 pts → -25% location véhicule
   - Validité : 6 mois

6. **Autolib** - Parking ⭐ Premium
   - 2000 pts → -30% abonnement parking
   - Validité : 1 an

7. **Midas** - Réparation
   - 400 pts → Diagnostics gratuits
   - Validité : 3 mois

8. **BP** - Carburant
   - 600 pts → -8% carte fidélité premium
   - Validité : 6 mois

9. **Feu Vert** - Entretien
   - 1000 pts → -18% pack entretien annuel
   - Validité : 1 an

10. **Sixt** - Location ⭐ Premium
    - 1800 pts → -20% location premium
    - Validité : 6 mois

#### HABITATION (10 partenaires)
1. **Leroy Merlin** - Bricolage ⭐ Premium
   - 2500 pts → Carte cadeau 100€
   - Validité : 1 an

2. **Castorama** - Rénovation
   - 1500 pts → -15% sur travaux
   - Validité : 6 mois

3. **EDF** - Énergie
   - 800 pts → Audit énergétique offert
   - Validité : 3 mois

4. **Engie** - Énergie
   - 1000 pts → -10% réduction abonnement
   - Validité : 1 an

5. **Ikea** - Ameublement
   - 1200 pts → Bon d'achat 50€
   - Validité : 6 mois

6. **Maison du Monde** - Décoration ⭐ Premium
   - 1800 pts → -20% collection exclusive
   - Validité : 6 mois

7. **Homeserve** - Dépannage ⭐ Premium
   - 2000 pts → Service prioritaire gratuit
   - Validité : 1 an

8. **Verisure** - Sécurité ⭐ Premium
   - 3000 pts → -25% installation alarme
   - Validité : 1 an

9. **But** - Ameublement
   - 1400 pts → Carte fidélité gold
   - Validité : 6 mois

10. **Boulanger** - Électroménager
    - 1600 pts → Extension garantie gratuite
    - Validité : 2 ans

#### SANTÉ & BIEN-ÊTRE (10 partenaires)
1. **Doctolib** - Santé
   - 500 pts → Consultation télémédecine offerte
   - Validité : 3 mois

2. **Alan** - Mutuelle ⭐ Premium
   - 2500 pts → Premier mois offert
   - Nouveaux clients

3. **Decathlon** - Sport
   - 800 pts → -15% équipement fitness
   - Validité : 6 mois

4. **Basic Fit** - Fitness
   - 1500 pts → -30% abonnement 3 mois
   - Validité : 2 mois

5. **Yuka** - Nutrition
   - 600 pts → Abonnement Premium 6 mois
   - Validité : 1 an

6. **Pharmacie Lafayette** - Pharmacie
   - 1000 pts → Carte fidélité platine
   - Validité : 1 an

7. **Optical Center** - Optique ⭐ Premium
   - 2000 pts → Seconde paire offerte
   - Validité : 6 mois

8. **Keep Cool** - Fitness
   - 1200 pts → Coaching personnalisé offert
   - Validité : 3 mois

9. **Qare** - Téléconsultation ⭐ Premium
   - 1800 pts → 5 consultations offertes
   - Validité : 6 mois

10. **Clarins** - Bien-être ⭐ Premium
    - 2500 pts → -40% soin spa
    - Validité : 3 mois

#### VIE & ÉPARGNE (10 partenaires)
1. **Boursorama** - Banque ⭐ Premium
   - 3000 pts → Frais de gestion offerts 1 an
   - Nouveaux clients

2. **Trade Republic** - Investissement ⭐ Premium
   - 2000 pts → 20€ actions offertes
   - Nouveaux clients

3. **Yomoni** - Gestion pilotée ⭐ Premium
   - 5000 pts → -50% frais réduits à vie
   - À vie

4. **Linxea** - Assurance vie ⭐ Premium
   - 2500 pts → Frais d'entrée offerts
   - Validité : 6 mois

5. **Fortuneo** - Banque
   - 1500 pts → Carte bancaire premium gratuite
   - Validité : 2 ans

6. **Nalo** - Épargne
   - 1000 pts → Audit patrimonial offert
   - Validité : 1 an

7. **Ramify** - Investissement
   - 800 pts → Formation investissement offerte
   - Validité : 6 mois

8. **Finary** - Patrimoine ⭐ Premium
   - 2200 pts → Abonnement Pro 1 an
   - Validité : 3 mois

9. **Meilleurtaux** - Crédit
   - 500 pts → Simulation personnalisée offerte
   - Validité : 6 mois

10. **Goodvest** - Épargne responsable ⭐ Premium
    - 3500 pts → -0,5% investissement vert
    - Validité : 2 ans

#### SERVICES QUOTIDIENS (10 partenaires)
1. **Uber** - Transport
   - 1000 pts → Code promo 20€
   - Validité : 2 mois

2. **Deliveroo** - Livraison
   - 1200 pts → Livraison gratuite 3 mois
   - Validité : 1 mois

3. **Amazon Prime** - E-commerce ⭐ Premium
   - 3000 pts → 6 mois offerts
   - Nouveaux membres

4. **Netflix** - Streaming ⭐ Premium
   - 2500 pts → -50% abonnement 3 mois
   - Validité : 2 mois

5. **Spotify** - Musique ⭐ Premium
   - 1800 pts → Premium 6 mois offerts
   - Validité : 3 mois

6. **Le Monde** - Presse
   - 1500 pts → -40% abonnement digital 1 an
   - Validité : 6 mois

7. **Fnac** - Culture ⭐ Premium
   - 2000 pts → Carte Fnac+ 2 ans offerts
   - Validité : 3 mois

8. **Carrefour** - Courses
   - 800 pts → Bon d'achat 30€
   - Validité : 2 mois

9. **Air France** - Voyage ⭐ Premium
   - 5000 pts → Miles Flying Blue x2
   - Validité : 1 vol

10. **Blablacar** - Covoiturage
    - 600 pts → Trajet offert 15€
    - Validité : 3 mois

### 3.5 Modèle de données Partenaire

```typescript
interface Partner {
  id: string;
  name: string;
  category: string;           // Catégorie (ex: "Carburant", "Banque")
  universe: string[];         // Peut appartenir à plusieurs univers
  description: string;        // Description courte de l'offre
  pointsRequired: number;     // Nombre de points nécessaires
  discount: string;           // Réduction (ex: "-10%", "Gratuit", "50€")
  validity: string;           // Durée de validité
  logo?: string;              // URL du logo (optionnel)
  isPremium?: boolean;        // Avantage premium (marqué ⭐)
}
```

### 3.6 Navigation par univers

#### Vue principale (tous les univers)
Affichage en grille des 5 univers :

**Design des cartes univers** :
- Grande taille (h-32)
- Icône colorée en haut à gauche
- Nom de l'univers
- Description
- Flèche `ChevronRight` en hover
- Fond de la couleur de l'univers (très clair)
- Effet hover avec légère élévation

**Interaction** :
Clic sur une carte → Navigation vers l'univers détaillé
```typescript
onClick={() => setSelectedUniverse(universe.id)}
```

#### Vue univers détaillé

Quand un univers est sélectionné (`selectedUniverse !== null`) :

**Header sticky** :
- Bouton retour "← Retour aux univers"
- Icône + Nom de l'univers
- Compteur de points (coin droit)
- Fond blanc, bordure inférieure

**3 sections principales** :

##### Section 1 : Comprendre & prévenir (Pédagogie)
Contenu éducatif spécifique à l'univers :

**Exemples Auto** :
- Votre calendrier de révisions
- Contrôle technique : guide complet
- Conduire en hiver

**Exemples Habitation** :
- Checklist hiver
- Économies d'énergie
- Sécurité incendie

**Exemples Santé** :
- Prévention annuelle
- Bien choisir votre mutuelle
- Téléconsultation mode d'emploi

**Exemples Épargne** :
- Fiscalité assurance vie
- Comprendre les UC
- Diversification patrimoniale

**Exemples Services** :
- Budget familial
- Alertes consommation
- Astuces économies

**Design** :
- Grille 3 colonnes (responsive)
- Card avec icône dans badge coloré
- Titre + description
- Bouton "Découvrir"

##### Section 2 : Partenaires & Avantages
Grille de tous les partenaires de l'univers :

**Card partenaire** :
- Badge "Premium" si `isPremium`
- Nom du partenaire
- Catégorie (petite taille, gris)
- Description de l'offre
- Badge avec le discount (couleur de l'univers)
- Points requis avec icône `Star`
- Validité avec icône `Clock`
- Bouton CTA :
  - "Utiliser X points" (si assez de points)
  - "Il vous manque Y points" (sinon, désactivé)

**Filtrage** :
Les partenaires affichés sont filtrés par :
```typescript
const filteredPartners = partners.filter(partner => 
  partner.universe.includes(selectedUniverse)
);
```

**Tri** :
Par défaut par nombre de points (croissant)

##### Section 3 : Services utiles
Outils et services pratiques liés à l'univers :

**Exemples Auto** :
- Simulateur bonus-malus
- Rappel révision
- Carnet d'entretien digital

**Exemples Habitation** :
- Calculateur valeur mobilier
- Inventaire assisté
- Alertes météo

**Exemples Santé** :
- Suivi remboursements
- Carnet de santé digital
- Rappels vaccins

**Exemples Épargne** :
- Simulateur retraite
- Projection patrimoine
- Alertes opportunités

**Exemples Services** :
- Comparateur offres
- Gestionnaire abonnements
- Alertes promotions

**Design** :
- Grille 3 colonnes
- Card simple avec icône + titre
- Hover avec élévation
- Icônes : `Calculator`, `Bell`, `FileText`, etc.

### 3.7 Système de rachat d'avantages

#### Vérification des points
Avant d'afficher le bouton d'action :

```typescript
const canAfford = currentUser.points >= partner.pointsRequired;
const pointsNeeded = partner.pointsRequired - currentUser.points;
```

#### Boutons contextuels
```typescript
{canAfford ? (
  <Button className="w-full" style={{ backgroundColor: universe.color }}>
    <Star className="h-4 w-4 mr-2" />
    Utiliser {partner.pointsRequired} points
  </Button>
) : (
  <Button className="w-full" disabled variant="outline">
    <Star className="h-4 w-4 mr-2" />
    Il vous manque {pointsNeeded} points
  </Button>
)}
```

#### Modal de confirmation
Après clic sur "Utiliser X points" :

**Contenu** :
- Récapitulatif de l'avantage
- Code promo ou instructions d'utilisation
- Nouveau solde de points
- Date d'expiration de l'avantage
- Conditions d'utilisation

### 3.8 Intégration avec l'Espace Client

L'écosystème Avantages est accessible depuis plusieurs points :

**1. Depuis l'Espace Client** :
- Bouton "Mes avantages" dans les Actions rapides
- Affichage du statut et points dans le header utilisateur
- Badge sur le niveau de fidélité

**2. Navigation** :
Intégration dans le menu principal de la plateforme

**3. Gains de points** :
- +500 points à la souscription
- Points mensuels selon le montant des primes
- Bonus lors du renouvellement de contrats
- Points pour le parrainage

---

## 4. DESIGN SYSTEM COMMUN

### 4.1 Palette de couleurs

**Couleurs principales** :
- Primaire (Bleu) : `#2563EB`
- Succès (Vert) : `#10B981`
- Attention (Orange) : `#F59E0B`
- Erreur (Rouge) : `#DC2626`
- Violet : `#8B5CF6`
- Rose : `#EC4899`

**Couleurs neutres** :
- Texte principal : `#111827`
- Texte secondaire : `#6B7280`
- Bordures : `#E5E7EB`
- Fonds : `#F9FAFB`
- Blanc : `#FFFFFF`

### 4.2 Composants UI partagés

Tous importés depuis `/components/ui/` :

- `Button` - Boutons avec variantes (default, outline, ghost, destructive)
- `Card`, `CardContent`, `CardHeader`, `CardTitle` - Structure de cartes
- `Badge` - Badges de statut
- `Input` - Champs de saisie
- `Select` - Menus déroulants
- `Tabs` - Navigation par onglets
- `Progress` - Barres de progression
- `Dialog` - Modales
- `Alert` - Messages d'alerte

### 4.3 Icônes

Bibliothèque **Lucide React** :

**Principales icônes utilisées** :
- Navigation : `ChevronRight`, `ChevronDown`, `ChevronUp`, `ArrowRight`
- Actions : `Plus`, `Edit`, `X`, `Download`, `Upload`, `Search`, `Filter`
- Statuts : `CheckCircle`, `AlertCircle`, `AlertTriangle`, `Clock`
- Types : `Car`, `Home`, `Heart`, `Shield`, `PiggyBank`, `ShoppingBag`
- Utilitaires : `Calendar`, `FileText`, `Euro`, `Star`, `Gift`, `Settings`

### 4.4 États interactifs

**Hover** :
- Cards : `hover:shadow-md`
- Boutons outline : `hover:bg-[#2563EB]/5 hover:border-[#2563EB]`
- Fonds : `hover:bg-[#F9FAFB]` ou `hover:bg-white`

**Focus** :
- Champs : Bordure bleue au focus
- Navigation clavier supportée

**Animations** :
- Transitions : `transition-all duration-200`
- Animation bounce : Pour les nouveautés
- Animation pulse : Pour les statuts en cours

### 4.5 Responsive

**Breakpoints** :
- Mobile : par défaut
- Tablette : `md:` (768px+)
- Desktop : `lg:` (1024px+)

**Grilles adaptatives** :
```typescript
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Flexbox responsive** :
```typescript
<div className="flex flex-col md:flex-row gap-4">
```

---

## 5. INTÉGRATION GLOBALE

### 5.1 Flow utilisateur complet

1. **Arrivée sur la plateforme** → Comparateur
2. **Souscription** → Signature avec animations
3. **Redirection vers Espace Client** avec `justSubscribed={true}`
4. **Animation de bienvenue** (5 secondes)
5. **Badge "Nouveau client" + 500 points fidélité**
6. **Exploration** :
   - Vue d'ensemble → KPIs et échéancier
   - Contrats → Gestion détaillée
   - Sinistres → Déclaration et suivi
   - Avantages → Programme de fidélité
7. **Actions récurrentes** :
   - Renouvellement de contrats
   - Déclaration de sinistres
   - Utilisation des avantages
   - Téléchargement de documents

### 5.2 Points d'entrée

**Depuis l'App.tsx** :
```typescript
<EspaceClient
  onReturnToComparator={() => setCurrentView('comparator')}
  authenticatedUser={currentUser}
  onUserAuthenticated={setCurrentUser}
  justSubscribed={justSubscribed}
/>
```

**Navigation interne** :
- Tabs pour changer de section
- Boutons CTA pour actions rapides
- Liens contextuels dans les cards

### 5.3 Gestion d'état

**États locaux** :
- `activeSection` : Section active (vue-ensemble, contrats, sinistres)
- `expandedContractId` : Contrat déplié dans les accordéons
- `selectedSinistre` : Sinistre sélectionné pour détails
- `selectedUniverse` : Univers sélectionné dans Avantages
- `searchTerm` : Terme de recherche
- `filterType` / `filterStatus` : Filtres actifs

**Props partagées** :
- `authenticatedUser` : Informations utilisateur
- `contrats` : Liste des contrats
- `sinistres` : Liste des sinistres

### 5.4 Données de démonstration

**Mock data** :
- 3 contrats types (Auto MAIF, Habitation Groupama, Santé Harmonie Mutuelle)
- 4 sinistres exemples (divers statuts et types)
- 50 partenaires répartis dans 5 univers
- Utilisateur exemple avec statut Gold (8500 points)

**Réalisme** :
- Dates cohérentes
- Montants réalistes
- Descriptions détaillées
- Workflow complet

---

## 6. CONFORMITÉ RÉGLEMENTAIRE

### 6.1 RGPD

**Données personnelles** :
- Authentification sécurisée requise
- Accès restreint aux données sensibles
- Possibilité de modification des informations
- Export de documents contractuels

**Transparence** :
- Mentions légales accessibles
- Politique de confidentialité
- Gestion du consentement

### 6.2 DDA/IDD

**Information précontractuelle** :
- Documents IPID disponibles
- Conditions générales téléchargeables
- Synthèse des garanties claire

**Conseil et vente** :
- Adéquation des besoins vérifiée
- Devoir de conseil respecté
- Droit de rétractation mentionné

### 6.3 AI Act

**Transparence de l'IA** :
- Moteur IA de détection des besoins
- Système de ranking explicable (50% prix, 25% couverture, 25% service)
- Pas de décision automatisée sans intervention humaine possible

---

## 7. ÉVOLUTIONS FUTURES

### 7.1 Fonctionnalités à venir

**Espace Client** :
- Messagerie intégrée avec l'assureur
- Notifications push pour les échéances
- Historique complet des paiements
- Comparateur intégré pour optimisation

**Gestion des Sinistres** :
- Upload de photos du sinistre
- Signature électronique des documents
- Tchat en temps réel avec l'expert
- Géolocalisation pour intervention rapide

**Écosystème Avantages** :
- Partenaires géolocalisés
- Notifications d'offres personnalisées
- Cashback automatique
- Parrainage avec code promo
- Marketplace étendue

### 7.2 Intégrations techniques

**API externes** :
- Connexion aux API des 30 assureurs
- Système de paiement (Stripe, PayPal)
- Service d'authentification (OAuth 2.0)
- Stockage de documents (AWS S3, Azure Blob)

**Backend Supabase** :
- Base de données PostgreSQL
- Authentification utilisateur
- Storage pour documents
- Functions pour logique métier
- Realtime pour notifications

### 7.3 Optimisations UX

**Performance** :
- Lazy loading des images
- Pagination des listes longues
- Cache des données fréquentes
- Optimistic UI updates

**Accessibilité** :
- Support lecteurs d'écran
- Navigation clavier complète
- Contrastes WCAG AA
- Textes alternatifs sur images

---

## 8. GUIDE DE MAINTENANCE

### 8.1 Structure des fichiers

```
/components/
├── EspaceClient.tsx         # Espace client principal
├── SinistresManager.tsx     # Gestion des sinistres
├── AvantagesPage.tsx        # Écosystème avantages
├── AuthModal.tsx            # Authentification
├── AttestationDownload.tsx  # Téléchargement attestation
└── ui/                      # Composants UI réutilisables
```

### 8.2 Ajout d'un nouveau contrat

1. Ajouter l'objet contrat dans `mockContrats`
2. Définir le type, l'icône et la couleur
3. Les filtres et la recherche fonctionneront automatiquement

### 8.3 Ajout d'un nouveau partenaire

1. Créer l'objet `Partner` dans le tableau `partners`
2. Spécifier l'univers (un ou plusieurs)
3. Définir les points requis et la validité
4. Marquer `isPremium: true` si applicable

### 8.4 Modification du workflow sinistres

Le workflow est dynamique et s'adapte au statut :
- Modifier les conditions dans la fonction de rendu
- Ajuster les icônes et textes selon les étapes
- Mettre à jour les actions contextuelles

---

## 9. SUPPORT ET CONTACT

### 9.1 Documentation technique

- Guide d'intégration Supabase
- API Reference des assureurs
- Design System MIRADOR
- Guide de contribution

### 9.2 Ressources

- Figma Design System
- Storybook des composants
- Tests unitaires
- Documentation API

---

**Version** : 1.0  
**Date** : Décembre 2024  
**Auteur** : Équipe MIRADOR  
**Contact** : support@mirador-assurance.fr

---

## Annexes

### A. Glossaire

- **DDA/IDD** : Directive sur la Distribution d'Assurance
- **RGPD** : Règlement Général sur la Protection des Données
- **AI Act** : Régulation européenne sur l'Intelligence Artificielle
- **IPID** : Insurance Product Information Document
- **NPS** : Net Promoter Score
- **KPI** : Key Performance Indicator
- **CTA** : Call To Action
- **UI/UX** : User Interface / User Experience

### B. Exemples de code

#### Ajout d'un nouveau statut de sinistre

```typescript
// Dans SinistresManager.tsx
const getStatusBadge = (status: string) => {
  switch (status) {
    // ... cas existants
    case 'cloture':
      return <Badge className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">
        Clôturé
      </Badge>;
    // ... autres cas
  }
};
```

#### Création d'un nouvel univers d'avantages

```typescript
// Dans AvantagesPage.tsx
const universes = [
  // ... univers existants
  {
    id: 'pro',
    name: 'Professionnel',
    icon: Building,
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
    description: 'Avantages professionnels'
  }
];
```

### C. Checklist de tests

**Tests fonctionnels** :
- [ ] Authentification fonctionne
- [ ] Recherche et filtres opérationnels
- [ ] Accordéons se plient/déplient
- [ ] Téléchargement de documents
- [ ] Navigation entre sections
- [ ] Affichage responsive (mobile, tablette, desktop)
- [ ] Workflow sinistre complet
- [ ] Rachat d'avantages avec points

**Tests de régression** :
- [ ] Données mock correctes
- [ ] Pas d'erreurs console
- [ ] Animations fluides
- [ ] Tous les badges s'affichent
- [ ] Icônes cohérentes

**Tests d'accessibilité** :
- [ ] Navigation au clavier
- [ ] Lecteurs d'écran
- [ ] Contrastes de couleurs
- [ ] Textes alternatifs

---

**FIN DE LA DOCUMENTATION**
