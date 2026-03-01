# 🚀 Guide Complet - Refonte du Comparateur MIRADOR

## 📋 Vue d'ensemble

La refonte complète du comparateur MIRADOR permet de **comparer, tarifer et souscrire** directement sur la plateforme, sans redirection externe. Cette refonte couvre 4 types d'assurance avec 15 offres multi-acteurs.

---

## 🎯 Objectifs de la refonte

### 1. Affichage multi-acteurs
- ✅ **15 offres** de différents assureurs (Mutuelles, Bancassureurs, Assureurs traditionnels, Insurtechs)
- ✅ Affichage en **grille 3 colonnes** responsive
- ✅ **Filtres adaptatifs** selon le type d'assurance

### 2. Flux de souscription intégré
- ✅ **Étape A** : Données produit → Tarif ferme (garanti 30 jours)
- ✅ **Étape B** : Données client → KYC → Signature → Paiement → Confirmation
- ✅ **Pas de redirection** : tout se passe sur MIRADOR

### 3. Conformité réglementaire
- ✅ **RGPD** : Consentements explicites, finalités claires
- ✅ **DDA/IDD** : IPID et CGV accessibles
- ✅ **KYC** : Vérification d'identité, PEP, sanctions
- ✅ **Transparence** : Méthodologie de scoring visible

---

## 🏗️ Architecture

### Structure des composants

```
/components
├── ComparateurRefonte.tsx          # Composant principal orchestrateur
└── /comparator
    ├── FiltersPanel.tsx             # Panneau filtres adaptatifs (320px)
    ├── OffersGrid.tsx               # Grille d'affichage des offres (3 colonnes)
    ├── ProductDataSheet.tsx         # Sheet Étape A - Tarif ferme
    ├── SubscriptionFlow.tsx         # Modal Étape B - Souscription complète
    └── TooltipLexique.tsx           # Tooltips contextuels pour termes techniques

/data
└── offersFull.ts                    # 15 offres enrichies avec tous les champs

/types
└── subscription.ts                  # Types TypeScript complets
```

---

## 📊 Données : Structure des offres

### Fichier : `/data/offersFull.ts`

Chaque offre contient :

#### Champs communs
- `id`, `assureur`, `categorie_distributeur`, `type_assurance`
- `nom_offre`, `score_mirador`, `nps_client`
- `prix_annuel`, `franchise`, `niveau_couverture`
- `garanties_principales[]`, `delai_indemn_j`
- `lien_pdf_ipid`, `lien_cgv`, `label_meilleure_offre`

#### Champs spécifiques AUTO
- `formule`, `assistance_0km`, `bonus_malus_min`, `puissance_fiscale_max`, `valeur_vehicule_max`

#### Champs spécifiques HABITATION
- `surface_max`, `vol_inclus`, `degat_eaux_inclus`

#### Champs spécifiques SANTÉ
- `optique_lvl`, `dentaire_lvl`, `hosp_lvl`, `tiers_payant`, `delai_remboursement`

#### Champs spécifiques ÉPARGNE-VIE
- `uc_min_pct`, `fonds_euro_dispo`, `mandat_pilotage`, `frais_versement`, `frais_gestion_uc`, `versement_min`, `rci_jours`

**Total : 15 offres** réparties :
- 🚗 Auto : 5 offres (MAIF, Groupama, AXA, Allianz, Luko)
- 🏠 Habitation : 3 offres (MACIF, Generali, CA Assurances)
- 🏥 Santé : 4 offres (MGEN, April, SG Assurances, LCL)
- 💰 Épargne-Vie : 3 offres (CNP, Cardif, LBP)

---

## 🎨 Design System

### Palette de couleurs
```css
--brand-primary: #2563EB   /* Bleu principal */
--brand-success: #10B981   /* Vert succès */
--bg-main: #F9FAFB         /* Fond principal */
--text-primary: #111827    /* Texte principal */
--text-muted: #6B7280      /* Texte secondaire */
--border: #E5E7EB          /* Bordures */
```

### Typographie
- **H1** : 32px / 700
- **H2** : 20px / 600
- **Body** : 16px / 400
- **Small** : 14px / 400

### Espacements
- **Gap** : 16-24px
- **Padding** : 16-24px
- **Border radius** : 12px
- **Ombre** : subtile (shadow-sm)

---

## 🔄 Flux utilisateur (4 étapes)

### Étape 1 : Filtrer
**Composant** : `FiltersPanel`

1. L'utilisateur sélectionne le **type d'assurance** (Auto, Habitation, Santé, Épargne-Vie)
2. Les filtres **s'adaptent dynamiquement** au type choisi
3. L'utilisateur affine les critères (budget, franchise, niveau de couverture, etc.)
4. Clic sur **"Appliquer les filtres"** → passage à l'étape 2

#### Filtres AUTO
- Profil conducteur : âge, permis, bonus-malus, sinistres 36m
- Véhicule : marque, modèle, énergie, puissance fiscale, usage, stationnement
- Contrat : formule (Tiers/Tiers+/TR), franchise max, assistance 0km
- Service : NPS min, délai indemnisation
- Prix : budget annuel max

#### Filtres HABITATION
- Logement : type, surface, pièces, sécurité, valeur contenu
- Contrat : RC, dégâts des eaux, vol, franchise max
- Service : NPS min, délai indemnisation
- Prix : budget annuel max

#### Filtres SANTÉ
- Assuré : âge, régime sécu, situation pro
- Santé : niveau de couverture, optique, dentaire, hospitalisation
- Service : tiers payant, délai remboursement
- Prix : budget mensuel max

#### Filtres ÉPARGNE-VIE
- Projet : versement initial, versement mensuel, horizon (années)
- Gestion : mandat (pilotée/libre), % UC min, fonds euro
- Frais : frais versement max, frais gestion UC max
- Service : NPS min, délai de rachat

---

### Étape 2 : Comparer
**Composant** : `OffersGrid`

1. Affichage des offres filtrées en **grille 3 colonnes**
2. Chaque carte affiche :
   - Logo assureur + nom offre
   - **Score MIRADOR** /100 avec barre de progression
   - Prix annuel + mensualisation + franchise
   - 4-6 **garanties principales** (avec tooltips)
   - **Badges** : "Meilleure offre", "Rapport qualité/prix", "Service rapide"
   - NPS client + délai d'indemnisation
3. Actions disponibles :
   - **"Voir le détail"** (secondaire)
   - **"Tarif ferme"** (primaire) → ouvre le ProductDataSheet

**Tri** : Par défaut, tri par **score MIRADOR décroissant**

---

### Étape 3 : Tarif ferme
**Composant** : `ProductDataSheet` (Sheet slide-over)

**Objectif** : Collecter les données **minimales** pour calculer un **tarif ferme garanti 30 jours**

#### Données AUTO (tarif ferme)
- Profil : âge, permis (années), bonus-malus, sinistres 36m
- Véhicule : marque, modèle, mise en circulation, énergie, puissance fiscale
- Usage : personnel/pro/mixte, stationnement
- Code postal

**Calcul** : Appliquer majorations/réductions selon :
- Bonus-malus (<1 = réduction, >1 = majoration)
- Sinistres 36m (+50€ par sinistre)
- Jeune conducteur (<3 ans de permis : +30%)
- Stationnement (rue : +80€, garage : -50€)

#### Données HABITATION
- Type logement, surface, pièces, code postal, étage (si appart)
- Sécurité (alarme, serrure 3 points, etc.)
- Valeur du contenu

**Calcul** :
- Surface >100m² : +0,50€/m² supplémentaire
- Sécurité (alarme) : -30€
- Valeur contenu >50k€ : +(valeur-50k)/1000

#### Données SANTÉ
- Âge, situation pro, régime sécu, département
- Niveau de couverture souhaité

**Calcul** :
- Âge >60 : +(âge-60) × 15€
- Alsace-Moselle : -10% (meilleure sécu)

#### Données ÉPARGNE-VIE
- Versement initial, versement mensuel, horizon (années)
- Mandat (pilotée/libre), % UC cible

**Calcul** : Projection rendement (non-garanti) selon frais + UC

---

**Affichage du tarif ferme** :
- Prix annuel et mensuel
- Franchise
- **Facteurs de tarification** détaillés (majorations/réductions)
- **Validité** : Garanti 30 jours
- Liens vers **IPID** et **CGV**

**Action** : Bouton **"Souscrire maintenant"** → ouvre SubscriptionFlow

---

### Étape 4 : Souscrire
**Composant** : `SubscriptionFlow` (Modal plein écran, 5 sous-étapes)

#### 4.1 — Identité
- Civilité, nom, prénom, date de naissance, nationalité
- Type de document (CNI/Passeport/Titre de séjour), numéro, date d'expiration
- **Consentements** :
  - ✅ RGPD obligatoire
  - ❌ Démarchage (opt-in, décoché par défaut)

#### 4.2 — Coordonnées
- Email, mobile
- Adresse complète (auto-complétion recommandée)
- Code postal, ville, pays
- **IBAN** (affiché masqué pour sécurité)

#### 4.3 — Pièces & KYC
- **Uploads** :
  - Pièce d'identité (recto + verso)
  - Justificatif de domicile (<3 mois)
  - RIB
- **OCR simulé** : pré-remplir les champs depuis la pièce d'identité (mock)
- **Déclarations KYC** :
  - PEP (Personne Politiquement Exposée) : Oui/Non
  - Sanctions internationales : Oui/Non

**Validation** : Tous les fichiers doivent être uploadés

#### 4.4 — Paiement & Signature
- **Mode de paiement** :
  - 🏦 SEPA (prélèvement automatique) → mandat e-signature
  - 💳 CB (tokenisation sécurisée)
- **Signature électronique** :
  - Checkbox : "J'ai lu et j'accepte les Conditions Générales de Vente"
  - Horodatage automatique (valeur légale)
- **Affichage** :
  - Récapitulatif du tarif
  - Date d'effet du contrat
  - Première échéance

**Action** : Bouton **"Finaliser la souscription"**

#### 4.5 — Confirmation
**Affichage** :
- ✅ **Félicitations ! Votre contrat est souscrit**
- Numéro de contrat : `MIR-TIMESTAMP-OFFER_ID`
- Date d'effet
- Prochaine échéance
- **Bouton** : "Télécharger le contrat (PDF)"
- **Informations** :
  - Service client : téléphone + email
  - Accès à l'Espace Client

**Action finale** : Callback `onComplete(confirmationData)`

---

## 📱 Responsive & Accessibilité

### Responsive
- **Desktop** : Grille 3 colonnes, filtres sidebar 320px
- **Tablet** : Grille 2 colonnes, filtres collapsables
- **Mobile** : Grille 1 colonne, filtres en drawer plein écran (bottom sheet)

### Accessibilité (WCAG AA)
- ✅ Contrastes de couleurs respectés
- ✅ Focus clavier visible
- ✅ Labels ARIA sur tous les champs
- ✅ Messages d'erreur textuels (pas seulement couleur)
- ✅ Navigation clavier complète (Tab, Enter, Esc)
- ✅ Lecteurs d'écran supportés

---

## 🔐 Conformité & Sécurité

### RGPD
- Consentement **explicite** pour le traitement des données
- Finalités **clairement indiquées**
- Droit de **retrait** du consentement
- Conservation limitée des données
- Chiffrement des données sensibles

### DDA/IDD
- **IPID** (Document d'Information Produit) téléchargeable avant souscription
- **CGV** accessibles et acceptées explicitement
- Information pré-contractuelle complète

### KYC / LCB-FT
- Vérification d'identité obligatoire
- Détection PEP et sanctions internationales
- Traçabilité des documents uploadés

### Paiement sécurisé
- Tokenisation des CB (pas de stockage des numéros de carte)
- Mandat SEPA conforme normes européennes
- Horodatage des signatures électroniques

---

## 🧪 Tests & Validation

### Page de test dédiée
Fichier : `/test-comparateur-refonte.html`

Permet de tester le ComparateurRefonte de manière isolée.

### Checklist de validation
- [ ] Affichage correct des 15 offres
- [ ] Filtres adaptatifs fonctionnels pour chaque type d'assurance
- [ ] Calcul du tarif ferme avec majorations/réductions
- [ ] Validation des formulaires (messages d'erreur clairs)
- [ ] Upload de documents (simulation)
- [ ] Signature électronique et acceptation CGV
- [ ] Confirmation de souscription avec n° de contrat
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessibilité clavier
- [ ] Tooltips lexique fonctionnels

---

## 🚀 Déploiement

### Intégration dans App.tsx

Le composant `ComparateurRefonte` a été ajouté aux imports. Pour l'utiliser :

```tsx
import { ComparateurRefonte } from "./components/ComparateurRefonte";

// Dans le render
<ComparateurRefonte 
  onComplete={(subscriptionId) => {
    console.log('Souscription réussie:', subscriptionId);
    // Rediriger vers l'espace client ou afficher une confirmation
  }}
/>
```

### Variables d'environnement (Production)

Pour la production, remplacer les mocks par :

```env
VITE_API_BASE_URL=https://api.mirador.fr
VITE_UPLOAD_ENDPOINT=/api/documents/upload
VITE_QUOTE_ENDPOINT=/api/quotes/calculate
VITE_SUBSCRIBE_ENDPOINT=/api/subscriptions/create
VITE_OCR_ENDPOINT=/api/ocr/extract
```

---

## 📚 Lexique intégré

Le composant `TooltipLexique` contient **66 définitions** de termes d'assurance :

- Termes généraux : Franchise, Score MIRADOR, NPS, etc.
- Auto : Bonus-malus, Assistance 0km, Tous Risques, etc.
- Habitation : Dégâts des eaux, Vol et vandalisme, etc.
- Santé : Tiers payant, Téléconsultation, Hospitalisation, etc.
- Épargne-Vie : Fonds euro, UC, Gestion pilotée, etc.
- Procédures : IPID, CGV, KYC, PEP, RGPD, etc.

**Usage** :
```tsx
<Label className="flex items-center space-x-2">
  <span>Bonus-malus</span>
  <TooltipLexique term="Bonus-malus" />
</Label>
```

---

## 🎯 Prochaines évolutions

### Phase 2 (à venir)
- [ ] Comparaison multi-offres (jusqu'à 3 offres côte à côte)
- [ ] Favoris / Sauvegarde de panier
- [ ] Historique de comparaisons
- [ ] Recommandations IA personnalisées
- [ ] Chat conversationnel pour affiner les besoins
- [ ] OCR réel pour extraction automatique des données
- [ ] Intégration paiement CB en temps réel (Stripe/PayPlug)
- [ ] Tunnel de souscription multi-bénéficiaires (santé familiale)

### Phase 3 (long terme)
- [ ] API d'intégration assureurs partenaires
- [ ] Calculs tarifaires en temps réel via API
- [ ] Blockchain pour traçabilité des contrats
- [ ] IA générative pour synthèse des CGV
- [ ] Simulateur d'évolution tarifaire (projection pluriannuelle)

---

## 📞 Support & Contact

**Équipe technique MIRADOR**  
📧 dev@mirador.fr  
📱 01 23 45 67 89  

**Documentation technique**  
🔗 https://docs.mirador.fr/comparateur-refonte

---

**Version** : 1.0.0  
**Date** : Novembre 2024  
**Auteur** : Équipe MIRADOR  
**Licence** : Propriétaire
