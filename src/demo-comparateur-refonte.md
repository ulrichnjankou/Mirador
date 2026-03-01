# 🎬 Démonstration - Comparateur Refonte MIRADOR

## 🚀 Accès rapide

### Option 1 : Page de test dédiée
Ouvrez le fichier : **`/test-comparateur-refonte.html`**

Cette page affiche uniquement le `ComparateurRefonte` sans navigation.

### Option 2 : Intégration dans App.tsx
Modifiez `/App.tsx` pour ajouter une route "comparer-v2" :

```tsx
const renderSection = () => {
  switch (activeSection) {
    // ... autres cases
    case "comparer-v2":
      return <ComparateurRefonte onComplete={handleSubscriptionComplete} />;
    // ...
  }
};
```

Puis ajoutez un bouton dans `MainMenu` ou `Accueil` :
```tsx
<Button onClick={() => setActiveSection("comparer-v2")}>
  🚀 Nouveau Comparateur (Refonte)
</Button>
```

---

## 📱 Scénario de démonstration

### Scénario 1 : Assurance AUTO (Flux complet)

#### Étape 1 : Filtrer
1. **Ouvrir le comparateur**
2. Type d'assurance : **Auto** (déjà sélectionné)
3. **Configurer les filtres** :
   - Formule : "Tous Risques"
   - Franchise max : 300€
   - Assistance 0km : ✅ OUI
   - NPS minimum : 70/100
   - Budget annuel max : 800€
4. Cliquer **"Appliquer les filtres"**

**Résultat attendu** : Affichage de 3-4 offres Auto "Tous Risques" avec les critères respectés

#### Étape 2 : Comparer
1. **Observer la grille** :
   - MAIF Auto Sociétaire (Score 92, 680€/an) - Badge "Meilleure offre globale"
   - Luko Auto 100% Digital (Score 84, 540€/an) - Délai 10j
   - Groupama Auto Famille Confort (Score 88, 620€/an) - Badge "Rapport qualité/prix"
2. **Survoler les tooltips** :
   - "Assistance 0km" → Voir la définition
   - "Score MIRADOR" → Voir le détail du calcul
   - "Franchise" → Voir l'explication
3. Sélectionner l'offre **MAIF Auto Sociétaire**
4. Cliquer **"Tarif ferme"**

#### Étape 3 : Tarif ferme
1. **Sheet s'ouvre** à droite
2. **Remplir le formulaire** :
   - **Profil conducteur** :
     - Âge : 30 ans
     - Permis depuis : 5 ans
     - Bonus-malus : 0.80 (20% de bonus)
     - Sinistres 36 mois : 0
   - **Véhicule** :
     - Marque : Renault
     - Modèle : Clio 5
     - Mise en circulation : 06/2021
     - Énergie : Essence
     - Puissance fiscale : 5 CV
     - Usage : Personnel
     - Stationnement : Garage fermé
3. Cliquer **"Calculer le tarif ferme"**

**Résultat attendu** :
- Prix ferme : **544€/an** (soit 45€/mois)
- Facteurs de tarification :
  - Bonus 0.80 : **-136€** (réduction)
  - Garage fermé : **-50€** (réduction)
- Validité : 30 jours
- Franchise : 300€

4. Cliquer **"Souscrire maintenant"**

#### Étape 4 : Souscrire
##### 4.1 — Identité
1. **Remplir** :
   - Civilité : M
   - Nom : Dupont
   - Prénom : Jean
   - Date de naissance : 15/06/1993
   - Nationalité : Française
   - Type de document : CNI
   - Numéro : 123456789012
   - Date d'expiration : 31/12/2028
   - ✅ Consentement RGPD : Coché
   - ❌ Consentement démarchage : Décoché
2. Cliquer **"Suivant"**

##### 4.2 — Coordonnées
1. **Remplir** :
   - Email : jean.dupont@email.fr
   - Mobile : 06 12 34 56 78
   - Adresse : 12 Rue de la Paix
   - Code postal : 75002
   - Ville : Paris
   - Pays : France
   - IBAN : FR76 1234 5678 9012 3456 7890 123
2. Cliquer **"Suivant"**

##### 4.3 — Pièces & KYC
1. **Uploader les documents** (simulation) :
   - Cliquer "Upload" pour Pièce recto → Mock upload
   - Cliquer "Upload" pour Pièce verso → Mock upload
   - Cliquer "Upload" pour Justificatif domicile → Mock upload
   - Cliquer "Upload" pour RIB → Mock upload
2. **Déclarations KYC** :
   - PEP : Non
   - Sanctions : Non
3. Cliquer **"Suivant"**

##### 4.4 — Paiement & Signature
1. **Mode de paiement** : Sélectionner "SEPA"
2. **Acceptation CGV** : ✅ Cocher "J'ai lu et j'accepte les CGV"
3. **Signature électronique** : ✅ Cocher (horodatage automatique)
4. Cliquer **"Finaliser la souscription"**

##### 4.5 — Confirmation
**Affichage** :
- ✅ **Félicitations ! Votre contrat est souscrit**
- Numéro de contrat : `MIR-1731346800000-1`
- Date d'effet : 22/11/2024 (J+7)
- Prochaine échéance : 15/11/2025
- Service client : 01 23 45 67 89
- Email : contact@mirador.fr
- **Bouton** : "Télécharger le contrat (PDF)"

---

### Scénario 2 : Assurance HABITATION (Flux rapide)

#### Étape 1 : Filtrer
1. Type d'assurance : **Habitation**
2. Filtres :
   - Type logement : Appartement
   - RC incluse : ✅
   - Dégâts des eaux : ✅
   - Vol : ✅
   - Budget max : 350€/an
3. Appliquer

**Résultat** : 3 offres Habitation affichées

#### Étape 2 : Comparer
- Sélectionner **MACIF Habitation GAV** (Score 90, 285€/an)
- Cliquer "Tarif ferme"

#### Étape 3 : Tarif ferme
1. Remplir :
   - Type : Appartement
   - Surface : 65 m²
   - Pièces : 3
   - Code postal : 69001
   - Étage : 2
   - Sécurité : Alarme + Serrure 3 points
   - Valeur contenu : 25 000€
2. Calculer

**Résultat** :
- Prix ferme : **255€/an** (21€/mois)
- Facteurs :
  - Alarme + Serrure : **-30€**
- Franchise : 150€

3. Souscrire → Compléter les 5 étapes (similaire Auto)

---

### Scénario 3 : Assurance SANTÉ

#### Étape 1 : Filtrer
1. Type d'assurance : **Santé**
2. Filtres :
   - Niveau de couverture : Premium
   - Tiers payant : ✅
   - Budget mensuel max : 150€
3. Appliquer

**Résultat** : 2 offres Santé Premium

#### Étape 2-3 : Tarif ferme
- Sélectionner **MGEN Santé Active Premium** (Score 91, 1680€/an)
- Remplir :
  - Âge : 35 ans
  - Situation pro : Salarié
  - Régime sécu : Général
  - Département : 75 (Paris)
  - Niveau : Premium (déjà sélectionné)
- Calculer

**Résultat** :
- Prix ferme : **1680€/an** (140€/mois)
- Franchise : 0€

---

### Scénario 4 : ÉPARGNE-VIE

#### Étape 1 : Filtrer
1. Type d'assurance : **Épargne-Vie**
2. Filtres :
   - Fonds euro : ✅
   - Gestion pilotée : ✅
   - Frais versement max : 0%
   - Frais gestion UC max : 1%
3. Appliquer

**Résultat** : 2 offres Épargne

#### Étape 2-3 : Tarif ferme
- Sélectionner **CNP Épargne Avenir Pilotée** (Score 89)
- Remplir :
  - Versement initial : 5 000€
  - Versement mensuel : 200€
  - Horizon : 15 ans
  - Gestion pilotée : ✅ Oui
  - % UC cible : 30%
- Calculer

**Résultat** :
- Frais versement : 0%
- Frais gestion UC : 0.85%/an
- Versement min : 100€
- Rachat partiel : J+3

---

## 🧪 Tests spécifiques

### Test 1 : Validation des champs
1. À l'étape Tarif ferme, laisser des champs vides
2. Cliquer "Calculer"
3. **Vérifier** : Messages d'erreur rouges sous chaque champ requis

### Test 2 : Tooltips lexique
1. Survoler différentes icônes `HelpCircle`
2. **Vérifier** :
   - Tooltip apparaît après 200ms
   - Fond noir, texte blanc
   - Terme en vert
   - Définition complète et claire

### Test 3 : Filtres dynamiques
1. Passer de "Auto" à "Habitation"
2. **Vérifier** :
   - Filtres changent complètement
   - Valeurs réinitialisées
   - Offres affichées correspondent au nouveau type

### Test 4 : Calcul de tarif avec majorations
1. Tarif Auto avec :
   - Âge : 22 ans
   - Permis : 1 an (jeune conducteur)
   - Bonus-malus : 1.00
   - Sinistres 36m : 2
   - Stationnement : Rue
2. **Vérifier** :
   - Majoration jeune conducteur (+30%)
   - Majoration sinistres (+100€ pour 2 sinistres)
   - Majoration stationnement rue (+80€)
   - Total cohérent

### Test 5 : Navigation au clavier
1. Utiliser uniquement le clavier (Tab, Enter, Esc)
2. **Vérifier** :
   - Focus visible sur tous les éléments
   - Enter valide les formulaires
   - Esc ferme les modales
   - Navigation fluide

---

## 📊 Métriques à observer

### Performance
- Temps de chargement initial : **< 2s**
- Temps de filtrage : **< 100ms**
- Temps de calcul de tarif : **< 1.5s** (simulation)
- Fluidité navigation : **60 FPS**

### UX
- Nombre d'étapes pour souscrire : **9 écrans** (4 principales + 5 sous-étapes)
- Taux de champs pré-remplis (si OCR) : **> 80%**
- Nombre de clics pour souscrire : **< 50**

---

## 🐛 Bugs connus / Limitations actuelles

### Simulation (non-bloquant)
- ⚠️ Calcul de tarif = formules simplifiées (pas d'API réelle)
- ⚠️ Upload de documents = mock (pas de vrai storage)
- ⚠️ OCR = mock (pas d'extraction réelle)
- ⚠️ Paiement = simulation (pas de vraie transaction)
- ⚠️ Génération PDF = lien mock (pas de vrai document)

### Fonctionnel
- ⚠️ Pas de sauvegarde de panier (LocalStorage à implémenter)
- ⚠️ Pas de comparaison multi-offres côte à côte
- ⚠️ Pas d'historique de comparaisons

### Responsive
- ✅ Desktop : OK
- ⚠️ Mobile : filtres en drawer à améliorer
- ⚠️ Tablet : grille 2 colonnes à tester davantage

---

## 🎯 Points d'attention pour la démo

### À mettre en avant
1. **Filtres adaptatifs** : Montrer comment les filtres changent selon le type d'assurance
2. **Calcul de tarif personnalisé** : Insister sur les facteurs de majoration/réduction
3. **Tooltips lexique** : Montrer la richesse des définitions (66 termes)
4. **Flux de souscription complet** : 5 étapes bien séquencées
5. **Design cohérent** : Couleurs MIRADOR (#2563EB, #10B981)
6. **Transparence** : Affichage du score MIRADOR avec méthodologie

### À expliquer
1. **Mock vs. Réel** : Préciser que c'est un prototype avec simulations
2. **Prochaines étapes** : API réelles, OCR, paiement, etc.
3. **Conformité** : RGPD, DDA/IDD, KYC déjà intégrés dans le design
4. **Évolutivité** : Architecture prête pour intégration backend

---

## 📞 Questions fréquentes

### Q1 : Les offres sont-elles réelles ?
**R** : Les 15 offres sont basées sur de vraies compagnies (MAIF, AXA, etc.) mais les prix et garanties sont des approximations. En production, elles seront remplacées par des données API.

### Q2 : Le calcul de tarif est-il fiable ?
**R** : Non, c'est une **simulation simplifiée**. Les vrais calculs nécessitent des API assureurs avec algorithmes propriétaires complexes.

### Q3 : Peut-on vraiment souscrire ?
**R** : Non, le flux de souscription est un **prototype**. Aucune transaction réelle n'est effectuée. Il faudra intégrer Stripe/PayPlug et les SI assureurs.

### Q4 : Les documents uploadés sont-ils stockés ?
**R** : Non, c'est un **mock**. En production, il faudra un storage sécurisé (AWS S3, Google Cloud Storage) avec chiffrement.

### Q5 : L'OCR fonctionne-t-il ?
**R** : Non, c'est **simulé**. En production, utiliser AWS Textract, Google Vision ou Mindee pour extraction automatique CNI.

### Q6 : La signature électronique est-elle valide légalement ?
**R** : Non, c'est un **mock d'horodatage**. En production, il faudra un certificat qualifié (DocuSign, Yousign, etc.).

---

## 🚀 Prochaine démo (v1.1)

### Améliorations prévues
1. ✅ Intégration API réelles pour tarification
2. ✅ OCR fonctionnel (Mindee ou Google Vision)
3. ✅ Paiement réel (Stripe Connect)
4. ✅ Génération PDF contractuel (PDFMake ou LaTeX)
5. ✅ Comparaison multi-offres (tableau côte à côte)
6. ✅ Favoris / Panier (LocalStorage + API)
7. ✅ Responsive mobile optimisé
8. ✅ Tests E2E automatisés (Playwright)

---

**Date de la démo** : À définir  
**Contact** : dev@mirador.fr  
**Feedback** : Utiliser le canal #comparateur-refonte sur Slack
