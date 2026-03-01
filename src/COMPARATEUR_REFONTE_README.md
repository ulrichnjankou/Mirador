# Comparateur Refonte - Documentation

## Vue d'ensemble

La refonte complète du comparateur MIRADOR implémente un système d'entonnoir progressif en 4 étapes avec 15 offres multi-acteurs, filtres adaptatifs et flux de souscription intégré.

## Architecture

### Composants principaux

```
/components/
  ComparateurRefonte.tsx          # Point d'entrée principal
  /comparator/
    FiltersPanel.tsx               # Panneau de filtres adaptatifs (320px, sticky)
    OffersGrid.tsx                 # Grille 3 colonnes avec cartes d'offres
    ProductDataSheet.tsx           # Sheet pour tarif ferme (Étape A)
    SubscriptionFlow.tsx           # Flow de souscription en 5 sous-étapes (Étape B)
    TooltipLexique.tsx             # Tooltips pour termes techniques
```

### Données

```
/data/
  offersFull.ts                    # 15 offres complètes (MAIF, MACIF, AXA, etc.)
    - AUTO: 5 offres
    - HABITATION: 3 offres
    - SANTÉ: 4 offres
    - ÉPARGNE-VIE: 3 offres

/types/
  subscription.ts                  # Types TypeScript complets
    - QuoteInput (Auto, Habitation, Santé, Vie)
    - FirmQuote (tarif ferme calculé)
    - SubscriptionState (état global)
    - FilterState (filtres adaptatifs)
```

## Flux utilisateur

### Étape 1 : Filtrer
- Sélection du type d'assurance (Auto, Habitation, Santé, Épargne-Vie)
- Filtres adaptatifs selon le type :
  - **AUTO** : formule, franchise max, assistance 0km, NPS min, budget annuel, délai indemnisation
  - **HABITATION** : type logement, garanties (dégâts eaux, vol), franchise, budget, NPS
  - **SANTÉ** : niveau couverture, tiers payant, budget mensuel, délai remboursement, garanties min
  - **ÉPARGNE-VIE** : fonds euro, gestion pilotée/libre, frais versement/gestion, délai rachat, NPS
- Application en temps réel des filtres sur la grille

### Étape 2 : Comparer
- Affichage des offres filtrées en grille 3 colonnes
- Cartes d'offres avec :
  - Score MIRADOR (Prix 50%, Couverture 25%, Service 25%)
  - Prix annuel/mensuel adapté au type
  - Badges (catégorie distributeur, meilleure offre)
  - 4-6 garanties principales avec tooltips
  - Métriques clés (NPS, délai indemnisation, frais)
  - Boutons "Voir le détail" et "Tarif ferme gratuit"
  - Liens IPID et CGV

### Étape 3 : Tarif ferme
**Sheet ProductDataSheet** (slide-over droite)

Formulaires adaptatifs par type :

**AUTO**
- Profil conducteur : âge, permis années, bonus-malus, sinistres 36m
- Véhicule : marque, modèle, mise en circulation, énergie, puissance fiscale
- Usage : personnel/pro/mixte, stationnement

**HABITATION**
- Logement : type, surface, pièces, code postal, étage
- Sécurité : aucune/serrure/alarme/combinée
- Valeur du contenu

**SANTÉ**
- Profil : âge, situation pro, régime sécu, département
- Niveau de couverture : Essentielle/Confort/Premium

**ÉPARGNE-VIE**
- Projet : versement initial, versement mensuel, horizon
- Gestion : pilotée/libre, % UC cible

**Calcul du tarif**
- Validation des champs avec messages d'erreur
- Calcul instantané avec facteurs de majoration/réduction
- Affichage du prix ferme garanti 30 jours
- Bouton "Souscrire maintenant" activé

### Étape 4 : Souscrire
**Dialog SubscriptionFlow** (modal plein écran)

5 sous-étapes :

#### 4.1 - Identité
- Civilité, nom, prénom, date naissance, nationalité
- Pièce d'identité : type (CNI/Passeport/Titre séjour), numéro, date expiration
- Consentements RGPD (obligatoire) et démarchage (optionnel)

#### 4.2 - Coordonnées
- Email, téléphone mobile
- Adresse postale complète : adresse, code postal, ville, pays
- IBAN pour prélèvement SEPA

#### 4.3 - Pièces & KYC
- Upload documents :
  - Pièce d'identité recto/verso
  - Justificatif de domicile (- 3 mois)
  - RIB
- Vérifications KYC :
  - PEP (Personne Politiquement Exposée)
  - Sanctions internationales

#### 4.4 - Paiement & Signature
- Mode de paiement :
  - SEPA (recommandé) : prélèvement automatique
  - CB : paiement sécurisé
- Acceptation CGV et IPID
- Signature électronique (valeur juridique eIDAS)
- Horodatage de la signature

#### 4.5 - Confirmation
- Numéro de contrat généré (format MIR-timestamp-offerId)
- Récapitulatif complet
- Date de prise d'effet (J+7)
- Prochaine échéance
- Coordonnées service client
- Bouton de téléchargement du contrat PDF
- Prochaines étapes détaillées

## Variables de style

### Couleurs (tokens CSS)
```css
--brand-primary: #2563EB;
--brand-success: #10B981;
--bg: #F9FAFB;
--text: #111827;
--muted: #6B7280;
--border: #E5E7EB;
```

### Typographie
- h1 : 32px / 700
- h2 : 20px / 600
- body : 16px / 400
- small : 14px / 400

### Layout
- Gap : 16-24px
- Padding : 16-24px
- Radius : 12px
- Ombre : douce (shadow-sm, shadow-lg)

## Tooltips Lexique

Termes avec définitions intégrées :
- Franchise, Bonus-malus, Assistance 0km
- Tiers, Tiers+, Tous Risques
- Dégâts des eaux, Vol et vandalisme
- Tiers payant, Téléconsultation
- Fonds euro, Unités de compte (UC)
- Gestion pilotée/libre
- RGPD, KYC, PEP
- Mandat SEPA, E-signature
- IPID, CGV
- Et 40+ autres termes

## Conformité

### RGPD
- Consentement explicite pour collecte des données
- Finalités précisées (souscription et gestion contrat)
- Option démarchage désactivée par défaut
- Droit de retrait mentionné

### Accessibilité (WCAG AA)
- Contrastes respectés
- Focus visible sur tous les éléments interactifs
- Labels clairs et descriptifs
- Messages d'erreur textuels (non-couleur uniquement)
- Navigation clavier complète
- ARIA labels appropriés

### DDA/IDD
- IPID accessible avant souscription
- CGV complètes téléchargeables
- Information transparente sur garanties/exclusions
- Délai de renonciation : 14 jours (mentionné)
- Disclaimer sur exactitude des informations

### AI Act (préparation)
- Méthodologie de scoring documentée
- Traçabilité des critères de classement
- Transparence sur pondération (Prix 50%, Couverture 25%, Service 25%)
- Pas de biais discriminatoire dans l'algorithme

## Interactions clavier

### Navigation
- `Tab` / `Shift+Tab` : navigation entre champs
- `Enter` : validation de formulaire
- `Esc` : fermeture des modals/sheets
- `Arrow keys` : navigation dans les selects

### Étapes
- Possibilité de revenir en arrière avec bouton "Précédent"
- Étapes complétées marquées avec checkmark vert
- Progress bar globale

## Points d'extension

### API intégration
Les calculs de tarifs sont actuellement simulés. Remplacer par :
```typescript
// Dans ProductDataSheet.tsx, fonction handleCalculate()
const response = await fetch('/api/quote', {
  method: 'POST',
  body: JSON.stringify({ offerId: offer.id, input: formData })
});
const quote = await response.json();
```

### Upload documents
Les uploads sont simulés. Implémenter :
```typescript
// Dans SubscriptionFlow.tsx, fonction handleFileUpload()
const formData = new FormData();
formData.append('file', file);
const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
const { url } = await response.json();
```

### Validation serveur
Ajouter validation côté serveur pour :
- IBAN (format et existence)
- Pièces d'identité (OCR)
- KYC (vérification bases PEP/sanctions)
- Email (vérification domaine)

## Mobile responsive

### Breakpoints
- Mobile (< 768px) : Panneau filtres en drawer full-screen
- Tablet (768-1024px) : Grille 2 colonnes
- Desktop (> 1024px) : Grille 3 colonnes

### Adaptations mobiles
- Filtres collapsables dans un drawer bottom-sheet
- Cartes en colonne unique avec infos essentielles
- Formulaires avec champs empilés
- Boutons full-width sur mobile

## Tests

### Scénarios à tester

1. **Filtrage AUTO**
   - Sélectionner "Tous Risques"
   - Mettre franchise max à 300€
   - Activer "Assistance 0km"
   - Vérifier que seules les offres compatibles s'affichent

2. **Tarif ferme AUTO**
   - Âge : 30 ans, permis 10 ans, bonus 0.50, 0 sinistre
   - Véhicule : Renault Clio 5, 01/2020, Essence, 7 CV
   - Usage : Personnel, Garage fermé
   - Vérifier réduction pour bonus et garage

3. **Souscription complète**
   - Remplir toutes les étapes
   - Vérifier validations
   - Vérifier génération numéro contrat
   - Vérifier email confirmation (mock)

4. **Accessibilité**
   - Navigation au clavier uniquement
   - Lecteur d'écran (NVDA/JAWS)
   - Zoom 200%
   - Contraste en mode sombre

## Performance

### Optimisations appliquées
- Filtrage côté client (pas de requête serveur)
- useMemo pour filtrage des offres
- Lazy loading des images (via ImageWithFallback)
- Debounce sur inputs de recherche (si ajouté)
- Pas de re-render inutile (useCallback)

### Métriques cibles
- First Contentful Paint : < 1.5s
- Time to Interactive : < 3s
- Lighthouse Performance : > 90
- Lighthouse Accessibility : 100

## Support navigateurs

- Chrome/Edge : 90+
- Firefox : 88+
- Safari : 14+
- Mobile Safari : 14+
- Samsung Internet : 14+

## Évolutions futures

### Phase 2
- Comparaison multi-offres (sélection 2-3 offres → tableau ligne-à-ligne)
- Favoris (icône cœur pour sauvegarder)
- Historique des recherches
- Export PDF de comparaison
- Partage par email

### Phase 3
- Chat IA pour recommandation personnalisée
- Simulation d'évolution de prix
- Calculateur d'économies vs contrat actuel
- Intégration agenda pour RDV conseiller

### Phase 4
- Gestion multi-contrats (famille)
- Souscription de groupe
- Parrainage avec récompenses
- Programme de fidélité avancé

## Contact & Support

Pour toute question sur l'implémentation :
- Documentation technique : /docs/technical
- Issues GitHub : /issues
- Email : dev@mirador.fr

---

**Version** : 1.0.0  
**Date** : Novembre 2024  
**Auteur** : Équipe MIRADOR SAS
