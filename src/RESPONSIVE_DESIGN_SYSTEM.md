# 📱 Système de Design Responsive MIRADOR

## 🎯 Principe fondamental : La Componentisation

**Ne redessinez pas tout.** Transformez vos éléments Desktop en Composants avec des variantes Mobile/Desktop. Si vous changez la couleur du bouton, ça change partout.

---

## 📐 Architecture des composants

### Système de variantes

Chaque composant majeur existe en **deux variantes** :
- `variant="mobile"` - Optimisé pour écrans < 768px
- `variant="desktop"` - Optimisé pour écrans ≥ 768px

**Pattern d'implémentation** :

```typescript
interface ComponentProps {
  variant?: 'mobile' | 'desktop';
  // ... autres props
}

export function Component({ variant = 'mobile', ...props }: ComponentProps) {
  if (variant === 'mobile') {
    return <MobileVersion {...props} />;
  }
  
  return <DesktopVersion {...props} />;
}

// Wrapper responsive automatique
export function ResponsiveComponent(props: Omit<ComponentProps, 'variant'>) {
  return (
    <>
      <div className="md:hidden">
        <Component {...props} variant="mobile" />
      </div>
      <div className="hidden md:block">
        <Component {...props} variant="desktop" />
      </div>
    </>
  );
}
```

---

## 🏗️ Structure de l'espace de travail

### Organisation des fichiers

```
/components/
├── layouts/
│   ├── MobileLayout.tsx       # Layout mobile avec Tab Bar
│   └── DesktopLayout.tsx      # Layout desktop classique
├── mobile/
│   ├── BottomSheet.tsx        # Bottom sheet pour filtres
│   ├── OfferCardMobile.tsx    # Carte d'offre responsive
│   ├── KPIScrollable.tsx      # KPIs avec scroll horizontal
│   ├── DocumentUploadMobile.tsx # Upload avec capture photo
│   └── FullScreenModal.tsx    # Modal plein écran
└── [composants existants]/
```

### Breakpoints Tailwind

```css
/* Mobile-first par défaut */
.class                  /* < 768px (mobile) */
md:class               /* ≥ 768px (tablette/desktop) */
lg:class               /* ≥ 1024px (desktop large) */
xl:class               /* ≥ 1280px (desktop XL) */
```

**Convention MIRADOR** :
- Mobile : iPhone 14/15 Pro (393px de large)
- Desktop : 1440px de large

---

## 📱 1. Navigation Mobile

### A. MobileLayout avec Tab Bar

**Fichier** : `/components/layouts/MobileLayout.tsx`

#### Caractéristiques
- **Header sticky en haut** (60px)
  - Logo MIRADOR à gauche
  - Titre centré (optionnel)
  - Avatar utilisateur à droite
  
- **Tab Bar sticky en bas** (80px)
  - 4 onglets principaux
  - Icônes + labels
  - Indicateur actif (barre bleue)
  - Zone de sécurité iOS (safe-area-inset-bottom)

#### Onglets de la Tab Bar

| Onglet | Icône | Route | Description |
|--------|-------|-------|-------------|
| **Accueil** | `Home` | `/` | Comparateur |
| **Contrats** | `FileText` | `/contrats` | Liste des contrats |
| **Sinistres** | `AlertTriangle` | `/sinistres` | Gestion des sinistres |
| **Avantages** | `Gift` | `/avantages` | Programme de fidélité |

#### Utilisation

```typescript
import { MobileLayout } from './components/layouts/MobileLayout';

<MobileLayout
  activeTab="accueil"
  onTabChange={(tab) => navigate(`/${tab}`)}
  showTabBar={true}
  showHeader={true}
  user={{ firstName: "Sophie" }}
>
  {/* Contenu de la page */}
</MobileLayout>
```

#### Design tokens

```css
/* Couleurs */
Tab active: text-[#2563EB]
Tab inactive: text-[#6B7280]
Background: bg-white
Border: border-[#E5E7EB]

/* Espacements */
Header height: 60px
Tab bar height: 80px
Content padding-bottom: 20px (pb-20)
```

---

## 🔍 2. Le Comparateur Mobile

### A. Panneau de Filtres en Bottom Sheet

**Fichier** : `/components/mobile/BottomSheet.tsx`

#### Le problème Desktop
- Sidebar de filtres à gauche (300px)
- Prend trop de place sur mobile

#### La solution Mobile
- **Bottom Sheet** (panneau qui remonte du bas)
- Déclencheur : **Sticky Bottom Bar** fixée en bas

#### FiltersBottomSheet

**Caractéristiques** :
- Hauteur : 85-95% de l'écran
- Poignée de glissement (handle)
- Overlay semi-transparent
- Animation slide-up fluide
- Boutons "Réinitialiser" + "Appliquer"

**Utilisation** :

```typescript
import { FiltersBottomSheet, StickyBottomBar } from './components/mobile/BottomSheet';

const [showFilters, setShowFilters] = useState(false);
const [filterCount, setFilterCount] = useState(0);

// Sticky Bottom Bar (toujours visible)
<StickyBottomBar
  onFilterClick={() => setShowFilters(true)}
  onSortClick={() => setShowSort(true)}
  filterCount={filterCount}
/>

// Bottom Sheet des filtres
<FiltersBottomSheet
  isOpen={showFilters}
  onClose={() => setShowFilters(false)}
  onApply={applyFilters}
  filterCount={filterCount}
>
  {/* Vos composants de filtres */}
  <FilterComponents />
</FiltersBottomSheet>
```

#### Design tokens

```css
/* Bottom Sheet */
Border radius top: rounded-t-[20px]
Background: bg-white
Shadow: shadow-2xl
Handle: w-12 h-1 bg-[#E5E7EB]

/* Sticky Bottom Bar */
Position: fixed bottom-0
Padding: p-4
Safe area: safe-area-inset-bottom
Button filter: border-2 border-[#2563EB] text-[#2563EB]
Button trier: border border-[#E5E7EB]
Badge count: bg-[#2563EB] absolute -top-2 -right-2
```

---

### B. Grille d'Offres Mobile

**Fichier** : `/components/mobile/OfferCardMobile.tsx`

#### Le problème Desktop
- Grille 3 colonnes
- Carte horizontale avec détails complets

#### La solution Mobile
- **Liste verticale** (1 colonne)
- **Carte épurée** : Logo + Prix + Score + 3 garanties max
- **CTA large** : Bouton "Voir l'offre" pleine largeur

#### OfferCardMobile

**Variante Mobile** :

```typescript
<OfferCardMobile
  variant="mobile"
  assureur="MAIF"
  produit="Auto Sociétaire"
  prix={112}
  scoreMirador={8.5}
  garantiesEssentielles={[
    "Responsabilité civile",
    "Tous risques",
    "Assistance 0km"
  ]}
  onVoir={() => openProductModal()}
/>
```

**Structure de la carte** :

1. **Header** (si meilleure offre)
   - Badge vert "Meilleure offre" avec étoile

2. **Logo + Nom**
   - Logo 48x48px à gauche
   - Nom assureur + produit
   - Score Mirador à droite (badge bleu)

3. **Prix** (centré et gros)
   - 3XL font-bold
   - Économie en vert (si applicable)
   - Bordure top/bottom

4. **Garanties** (max 3 affichées)
   - Bullet point vert
   - Texte sur 1 ligne (line-clamp-1)
   - "+X garanties" si plus de 3

5. **CTA**
   - Bouton pleine largeur
   - Hauteur 48px (py-6)
   - Chevron à droite

#### Design tokens

```css
/* Card */
Width mobile: w-full
Padding: p-4
Border radius: rounded-xl
Border: border-2
Best offer: border-[#10B981] bg-gradient-to-br from-[#10B981]/5

/* Prix */
Font size: text-3xl
Color: text-[#2563EB]
Font weight: font-bold

/* Score */
Background: bg-[#2563EB]/10
Text: text-[#2563EB]
Size: text-xl

/* CTA */
Width: w-full
Height: py-6
Font size: text-base
```

#### Responsive wrapper

```typescript
import { ResponsiveOfferCard } from './components/mobile/OfferCardMobile';

// Affiche automatiquement la bonne variante
<ResponsiveOfferCard {...props} />
```

---

## 📊 3. KPIs avec Scroll Horizontal

**Fichier** : `/components/mobile/KPIScrollable.tsx`

### Le problème Desktop
- 3 KPIs alignés horizontalement
- Prennent toute la largeur

### La solution Mobile
- **Scroll horizontal** (comme Revolut)
- Indicateur visuel de scroll (gradient à droite)
- Points de pagination en bas
- Snap scrolling

### KPIScrollable

**Utilisation** :

```typescript
import { ResponsiveKPIs } from './components/mobile/KPIScrollable';

const kpis = [
  {
    id: 'total-primes',
    label: 'Total Primes',
    value: '3 168€',
    subValue: 'par an • 264€/mois',
    icon: Euro,
    color: 'blue'
  },
  {
    id: 'contrats-actifs',
    label: 'Contrats Actifs',
    value: '3',
    subValue: 'sur 3 contrats',
    icon: Shield,
    color: 'green'
  },
  // ... autres KPIs
];

<ResponsiveKPIs kpis={kpis} />
```

**Comportements** :

| Plateforme | Affichage | Interaction |
|------------|-----------|-------------|
| **Mobile** | Scroll horizontal | Swipe tactile |
| **Desktop** | Grille 3 colonnes | Aucune |

### Design tokens

```css
/* Mobile */
Container: flex gap-3 overflow-x-auto
Snap: snap-x snap-mandatory
Card width: w-[280px]
Scroll behavior: scrollbar-hide
Gradient indicator: w-12 bg-gradient-to-l from-[#F9FAFB]

/* Pagination dots */
Active: w-6 h-1.5 bg-[#2563EB]
Inactive: w-1.5 h-1.5 bg-[#E5E7EB]

/* Desktop */
Layout: grid grid-cols-3 gap-4
```

---

## 📄 4. Tunnel de Souscription Mobile

**Fichier** : `/components/mobile/FullScreenModal.tsx`

### Le problème Desktop
- Slide-over latéral (ProductDataSheet)
- 400px de large à droite

### La solution Mobile
- **Full Screen Modal** (page entière)
- Header avec bouton retour
- CTA sticky en bas

### FullScreenModal

**Caractéristiques** :

1. **Header sticky** (top)
   - Bouton retour (`ChevronLeft`) à gauche
   - Titre centré
   - Bouton fermer (`X`) à droite (optionnel)

2. **Contenu scrollable**
   - Padding bottom pour le footer

3. **Footer sticky** (bottom)
   - Récapitulatif prix
   - Bouton CTA gros et visible
   - Ombre portée vers le haut

**Utilisation** :

```typescript
import { ProductModal } from './components/mobile/FullScreenModal';

<ProductModal
  isOpen={showProduct}
  onClose={() => setShowProduct(false)}
  assureur="MAIF"
  produit="Auto Sociétaire"
  prix={112}
  onSubscribe={handleSubscribe}
  variant="mobile"
>
  {/* Détails de l'offre */}
  <OfferDetails />
</ProductModal>
```

### ProductModal Footer

**Structure** :

```tsx
<footer className="sticky bottom-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
  {/* Récapitulatif */}
  <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg mb-3">
    <div>
      <p className="text-sm text-[#6B7280]">Votre tarif</p>
      <p className="font-semibold">MAIF - Auto Sociétaire</p>
    </div>
    <div className="text-right">
      <p className="text-2xl font-bold text-[#2563EB]">112€</p>
      <p className="text-sm text-[#6B7280]">/mois</p>
    </div>
  </div>

  {/* CTA */}
  <button className="w-full bg-[#2563EB] text-white font-semibold py-4 px-6 rounded-xl">
    Souscrire - 112€/mois
  </button>

  {/* Disclaimer */}
  <p className="text-xs text-center text-[#6B7280] mt-3">
    Sans engagement • Résiliable à tout moment
  </p>
</footer>
```

### Design tokens

```css
/* Modal Mobile */
Position: fixed inset-0 z-50
Background: bg-white
Animation: slide from right (x: 100% → 0)

/* Header */
Height: auto (py-3)
Border: border-b border-[#E5E7EB]
Title position: absolute left-1/2 -translate-x-1/2

/* Footer */
Position: sticky bottom-0
Shadow: shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
Safe area: safe-area-inset-bottom

/* CTA Button */
Width: w-full
Height: py-4
Border radius: rounded-xl
Active state: active:scale-[0.98]
```

---

## 📸 5. Upload de Documents avec Capture Photo

**Fichier** : `/components/mobile/DocumentUploadMobile.tsx`

### Le problème Desktop
- Upload de fichiers depuis le disque dur
- Interface "drag & drop"

### La solution Mobile
- **Bouton "Prendre une photo"** (gros et tactile)
- Accès direct à la caméra
- Option secondaire : "Choisir un fichier"
- Preview de l'image uploadée

### DocumentUploadMobile

**Variante Mobile** :

```typescript
import { ResponsiveDocumentUpload } from './components/mobile/DocumentUploadMobile';

<ResponsiveDocumentUpload
  label="Pièce d'identité"
  description="Photo de votre carte d'identité ou passeport"
  documentType="id"
  required={true}
  onUpload={(file) => handleUpload(file)}
/>
```

**Types de documents** :

| Type | Cadre | Conseils |
|------|-------|----------|
| `id` | Rectangle avec coins | "Bien éclairer le document"<br/>"Éviter les reflets"<br/>"Cadrer l'intégralité" |
| `proof` | Aucun | Conseils génériques |
| `other` | Aucun | Aucun |

### Structure de l'interface

**État initial (pas de fichier)** :

1. **Bouton principal** : "Prendre une photo"
   - Gradient bleu
   - Icône caméra 64x64
   - Hauteur : p-8
   - Active state : scale-[0.98]

2. **Séparateur** "ou"

3. **Bouton secondaire** : "Choisir un fichier"
   - Bordure pointillée
   - Icône upload
   - Moins visible

4. **Conseils** (si type = 'id')
   - Background bleu clair
   - Icône info
   - Liste à puces

**État avec fichier uploadé** :

1. **Preview**
   - Image en miniature (h-48)
   - Bordure verte (border-[#10B981])
   - Badge "Envoyé" en haut à droite

2. **Informations**
   - Nom du fichier (tronqué)
   - Taille en Ko

3. **Bouton supprimer**
   - Rond rouge en haut à droite
   - Visible au hover (group-hover)

### Inputs HTML

```tsx
{/* Caméra */}
<input
  type="file"
  accept="image/*"
  capture="environment"  // ⚠️ Important : déclenche la caméra
  className="hidden"
/>

{/* Fichier */}
<input
  type="file"
  accept="image/*"
  className="hidden"
/>
```

### Design tokens

```css
/* Bouton Photo */
Background: bg-gradient-to-br from-[#2563EB] to-[#1d4ed8]
Text: text-white
Padding: p-8
Shadow: shadow-lg
Icon size: w-16 h-16
Active state: active:scale-[0.98]

/* Bouton Fichier */
Border: border-2 border-dashed border-[#E5E7EB]
Hover: hover:border-[#2563EB]

/* Preview */
Border: border-2 border-[#10B981]
Height: h-48
Object fit: object-cover

/* Badge Envoyé */
Background: bg-[#10B981]
Text: text-white
Position: absolute top-2 right-2
Shadow: shadow-lg

/* Delete button */
Background: bg-[#DC2626]
Size: w-8 h-8
Position: absolute -top-2 -right-2
Opacity: opacity-0 group-hover:opacity-100
```

---

## 🎨 6. Design Tokens Global

### Couleurs

```css
/* Primaire */
--primary: #2563EB;
--primary-hover: #1d4ed8;
--primary-light: #EFF6FF;

/* Succès */
--success: #10B981;
--success-light: #D1FAE5;

/* Warning */
--warning: #F59E0B;

/* Erreur */
--error: #DC2626;

/* Neutre */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-600: #6B7280;
--gray-900: #111827;
```

### Espacements

```css
/* Safe areas iOS */
safe-area-inset-top: env(safe-area-inset-top);
safe-area-inset-bottom: env(safe-area-inset-bottom);

/* Padding standard */
Mobile: px-4 py-3
Desktop: px-6 py-4

/* Gaps */
Petit: gap-2 (8px)
Moyen: gap-3 (12px)
Grand: gap-4 (16px)
```

### Typographie

```css
/* Titres */
H1 mobile: text-xl (20px)
H1 desktop: text-2xl (24px)
H2 mobile: text-lg (18px)
H2 desktop: text-xl (20px)

/* Corps */
Body: text-base (16px)
Small: text-sm (14px)
Tiny: text-xs (12px)

/* Poids */
Normal: font-normal (400)
Medium: font-medium (500)
Semibold: font-semibold (600)
Bold: font-bold (700)
```

### Bordures

```css
/* Radius */
Small: rounded-lg (8px)
Medium: rounded-xl (12px)
Large: rounded-[20px]
Full: rounded-full

/* Borders */
Default: border border-[#E5E7EB]
Active: border-2 border-[#2563EB]
Success: border-2 border-[#10B981]
```

### Ombres

```css
/* Cards */
Small: shadow-sm
Medium: shadow-md
Large: shadow-lg
XL: shadow-2xl

/* Shadow custom (footer) */
Top shadow: shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
```

### Animations

```css
/* Transitions */
Default: transition-all
Duration: duration-200
Easing: ease-in-out

/* Active states */
Scale down: active:scale-[0.98]
Scale up: hover:scale-110

/* Motion */
Spring: type: 'spring', damping: 30, stiffness: 300
```

---

## 📋 7. Checklist d'implémentation

### Étape 1 : Créer les variantes Mobile

- [ ] MobileLayout avec Tab Bar
- [ ] BottomSheet pour filtres
- [ ] OfferCardMobile épurée
- [ ] KPIScrollable horizontal
- [ ] DocumentUploadMobile avec caméra
- [ ] FullScreenModal

### Étape 2 : Wrapper les composants existants

- [ ] Créer ResponsiveComponent pour chaque composant clé
- [ ] Utiliser `className="md:hidden"` et `className="hidden md:block"`
- [ ] Tester sur mobile (< 768px) et desktop (≥ 768px)

### Étape 3 : Adapter les pages

- [ ] Page Comparateur
- [ ] Page Signature
- [ ] Espace Client
- [ ] Page Avantages
- [ ] Gestion Sinistres

### Étape 4 : Optimisations mobiles

- [ ] Touch targets ≥ 48x48px
- [ ] Scroll momentum (`-webkit-overflow-scrolling: touch`)
- [ ] Safe areas iOS
- [ ] Désactiver zoom (`user-scalable=no` si nécessaire)
- [ ] Tester sur vrais devices

### Étape 5 : Performance

- [ ] Lazy loading des images
- [ ] Optimiser les animations (CSS > JS)
- [ ] Réduire les re-renders
- [ ] Code splitting par route

---

## 🧪 8. Tests cross-device

### Devices à tester

**Mobile** :
- [ ] iPhone 14/15 Pro (393px)
- [ ] iPhone SE (375px)
- [ ] Samsung Galaxy S23 (360px)
- [ ] Pixel 7 (412px)

**Tablette** :
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)

**Desktop** :
- [ ] 1280px
- [ ] 1440px
- [ ] 1920px

### Checklist de tests

**Navigation** :
- [ ] Tab Bar visible et cliquable
- [ ] Transitions fluides entre onglets
- [ ] Header sticky fonctionne
- [ ] Safe areas iOS respectées

**Filtres** :
- [ ] Bottom Sheet s'ouvre/ferme
- [ ] Animation slide-up fluide
- [ ] Overlay cliquable
- [ ] Poignée visible

**Cartes d'offres** :
- [ ] Toutes les infos visibles
- [ ] CTA facilement cliquable
- [ ] Prix lisible et gros
- [ ] Score visible

**KPIs** :
- [ ] Scroll horizontal fonctionne
- [ ] Snap scrolling activé
- [ ] Indicateur de scroll visible
- [ ] Pagination cohérente

**Upload** :
- [ ] Caméra se déclenche
- [ ] Preview s'affiche
- [ ] Bouton supprimer fonctionne
- [ ] Conseils visibles

**Modal** :
- [ ] Plein écran sur mobile
- [ ] Bouton retour fonctionne
- [ ] CTA sticky visible
- [ ] Scroll fluide

---

## 🚀 9. Best Practices

### A. Performance mobile

```typescript
// ✅ Bon : Lazy loading
const MobileLayout = lazy(() => import('./components/layouts/MobileLayout'));

// ✅ Bon : Debounce des scroll events
const handleScroll = useMemo(
  () => debounce(() => {
    // Logic
  }, 100),
  []
);

// ❌ Mauvais : Re-render à chaque scroll
const handleScroll = () => {
  setScrollY(window.scrollY); // Re-render!
};
```

### B. Touch targets

```css
/* ✅ Bon : 48x48px minimum */
.button {
  min-width: 48px;
  min-height: 48px;
  padding: 12px 16px;
}

/* ❌ Mauvais : Trop petit */
.icon-button {
  width: 24px;
  height: 24px;
}
```

### C. Scroll momentum

```css
/* ✅ Activer le smooth scroll iOS */
.scrollable {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ✅ Cacher la scrollbar */
.scrollable {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
}
.scrollable::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
```

### D. Active states

```typescript
// ✅ Bon : Feedback visuel au touch
<button className="active:scale-[0.98] transition-transform">
  Cliquez-moi
</button>

// ✅ Bon : Désactiver le highlight iOS
<button className="tap-highlight-transparent">
  Bouton
</button>
```

### E. Viewport meta tag

```html
<!-- ✅ Bon : Responsive et zoomable -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

<!-- ⚠️ À éviter : Pas de zoom (accessibilité) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

---

## 📚 10. Ressources

### Documentation
- [Tailwind CSS Responsive](https://tailwindcss.com/docs/responsive-design)
- [Framer Motion](https://www.framer.com/motion/)
- [iOS Safe Areas](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

### Inspirations
- **Revolut** : KPIs scrollables horizontalement
- **Airbnb** : Bottom Sheet pour filtres
- **Uber** : Full screen modals
- **N26** : Tab Bar navigation

### Outils
- [Responsive Viewer](https://chrome.google.com/webstore/detail/responsive-viewer) - Chrome extension
- [BrowserStack](https://www.browserstack.com/) - Tests cross-device
- [Figma](https://www.figma.com/) - Design & prototypage

---

## ✅ Conclusion

**Principe clé** : Une source de vérité, deux variantes.

Chaque composant existe en version `mobile` et `desktop`, wrappé dans un `ResponsiveComponent` qui affiche automatiquement la bonne version selon la taille d'écran.

**Résultat** :
- Code DRY (Don't Repeat Yourself)
- Maintenance facilitée
- UX optimale sur chaque device
- Performance préservée

**Next steps** :
1. Implémenter les composants mobiles
2. Wrapper les composants existants
3. Tester sur devices réels
4. Optimiser les performances
5. Déployer progressivement

---

**Version** : 1.0  
**Date** : Décembre 2024  
**Statut** : ✅ Architecture définie - Prêt pour implémentation
