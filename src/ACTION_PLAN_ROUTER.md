# 📋 Plan d'Action - Migration React Router pour MIRADOR

## 🎯 Objectif

**Résoudre la dette technique critique de navigation avant le lancement B2C**

**Problème** : Le bouton retour du navigateur quitte le site au lieu de revenir à l'étape précédente  
**Impact** : Perte estimée de 30-40% des conversions  
**Solution** : Migration vers React Router v6 avec URLs synchronisées  
**Délai** : 1 semaine (sprint dédié)

---

## 📅 Planning détaillé

### Semaine 1 : Migration et Tests

#### Jour 1 (Lundi) - Préparation
**Durée** : 2 heures  
**Responsable** : Lead Dev

**Tâches** :
- [ ] Review de la documentation (`MIGRATION_REACT_ROUTER.md`)
- [ ] Installation de `react-router-dom` en dev
```bash
npm install react-router-dom
```
- [ ] Création d'une branche Git dédiée
```bash
git checkout -b feature/react-router-migration
```
- [ ] Backup de `App.tsx`
```bash
cp App.tsx App_BACKUP_$(date +%Y%m%d).tsx
```

**Livrables** :
- ✅ Dépendance installée
- ✅ Branche créée
- ✅ Backup effectué
- ✅ Équipe informée

---

#### Jour 2 (Mardi) - Implémentation
**Durée** : 4 heures  
**Responsable** : Dev Frontend

**Tâches** :
- [ ] Remplacement de `App.tsx` par `App_WithRouter.tsx`
```bash
cp App_WithRouter.tsx App.tsx
```
- [ ] Vérification de l'import dans `main.tsx`
- [ ] Test de compilation
```bash
npm run build
```
- [ ] Premier test en local
```bash
npm run dev
```

**Checklist de validation** :
- [ ] L'app compile sans erreur
- [ ] L'app démarre en local
- [ ] Pas d'erreur console
- [ ] Navigation de base fonctionne

**Livrables** :
- ✅ Code migré
- ✅ Build réussie
- ✅ Tests de fumée OK

---

#### Jour 3 (Mercredi) - Tests fonctionnels
**Durée** : 6 heures  
**Responsable** : QA + Dev Frontend

**Tests navigation** :
- [ ] Test 1 : Accueil → Comparateur (URL change vers `/comparer`)
- [ ] Test 2 : Comparateur → Signature (URL change vers `/signature`)
- [ ] Test 3 : Signature → Espace Client (URL change vers `/espace-client`)
- [ ] Test 4 : Bouton retour navigateur (retour à l'étape précédente)
- [ ] Test 5 : Bouton forward navigateur (avance dans l'historique)

**Tests refresh** :
- [ ] Refresh sur `/comparer` → Reste sur `/comparer`
- [ ] Refresh sur `/signature` → Reste sur `/signature` + données préservées
- [ ] Refresh sur `/espace-client` → Reste sur `/espace-client`

**Tests liens directs** :
- [ ] Ouvrir directement `mirador.fr/comparer` → Fonctionne (si userType)
- [ ] Ouvrir directement `mirador.fr/signature` → Fonctionne (si userType)
- [ ] Ouvrir directement `mirador.fr/admin` → Redirige vers `/` (si pas admin)

**Tests routes protégées** :
- [ ] `/comparer` sans userType → Redirection vers `/`
- [ ] `/signature` sans userType → Redirection vers `/`
- [ ] `/admin` sans admin → Redirection vers `/`

**Tests 404** :
- [ ] URL invalide (`/page-inexistante`) → Redirection vers `/`

**Tests persistance** :
- [ ] sessionStorage contient les bonnes données
- [ ] Restauration après refresh fonctionne
- [ ] Nettoyage après déconnexion fonctionne

**Livrables** :
- ✅ Rapport de tests fonctionnels
- ✅ Liste des bugs identifiés (si applicable)
- ✅ Correction des bugs mineurs

---

#### Jour 4 (Jeudi) - Tests cross-browser
**Durée** : 4 heures  
**Responsable** : QA

**Navigateurs Desktop** :
- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)

**Navigateurs Mobile** :
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Samsung Internet (Android)

**Pour chaque navigateur, tester** :
- Navigation de base
- Bouton retour
- Refresh page
- sessionStorage

**Livrables** :
- ✅ Matrice de compatibilité navigateurs
- ✅ Screenshots des tests mobiles
- ✅ Bugs cross-browser corrigés

---

#### Jour 5 (Vendredi) - Configuration serveur
**Durée** : 3 heures  
**Responsable** : DevOps

**Tâche 1 : Configuration Nginx** (si applicable)
```nginx
# Fichier : /etc/nginx/sites-available/mirador.conf
server {
  listen 80;
  server_name mirador.fr www.mirador.fr;
  root /var/www/mirador/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # Cache statique
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Tâche 2 : Test en staging**
```bash
# Déploiement staging
npm run build
rsync -avz dist/ staging.mirador.fr:/var/www/mirador/
```

**Tâche 3 : Validation**
- [ ] Test sur `staging.mirador.fr/comparer` → Fonctionne
- [ ] Test refresh sur staging → Fonctionne
- [ ] Test 404 sur staging → Redirige correctement

**Livrables** :
- ✅ Serveur configuré
- ✅ Staging déployé et validé
- ✅ Documentation de déploiement

---

### Semaine 2 : Déploiement Production

#### Jour 6 (Lundi) - Tests finaux
**Durée** : 4 heures  
**Responsable** : QA + Dev

**Tests de régression complets** :
- [ ] Re-test de tous les scénarios fonctionnels
- [ ] Test du tunnel complet de souscription
- [ ] Test de l'espace client
- [ ] Test de la gestion des sinistres
- [ ] Test du programme avantages

**Tests de performance** :
- [ ] Mesure du bundle size (doit être < 900 KB)
- [ ] Mesure du temps de navigation (doit être < 200ms)
- [ ] Test de charge (100 utilisateurs simultanés)

**Livrables** :
- ✅ Rapport de tests de régression
- ✅ Rapport de performance
- ✅ Go/No-go pour prod

---

#### Jour 7 (Mardi) - Déploiement Production
**Durée** : 2 heures + surveillance  
**Responsable** : DevOps + Lead Dev

**Préparation** :
- [ ] Sauvegarde complète de la prod actuelle
- [ ] Communication aux utilisateurs (si applicable)
- [ ] Équipe en alerte

**Déploiement** (créneau : 10h-12h) :
```bash
# 1. Build de production
npm run build

# 2. Vérification du build
ls -lh dist/

# 3. Backup de la prod actuelle
ssh prod.mirador.fr "cp -r /var/www/mirador /var/www/mirador_backup_$(date +%Y%m%d)"

# 4. Déploiement
rsync -avz dist/ prod.mirador.fr:/var/www/mirador/

# 5. Redémarrage Nginx
ssh prod.mirador.fr "sudo systemctl restart nginx"
```

**Validation immédiate** (dans les 5 minutes) :
- [ ] Site accessible
- [ ] Navigation fonctionne
- [ ] Bouton retour fonctionne
- [ ] Pas d'erreur console
- [ ] Pas d'erreur serveur (logs)

**Livrables** :
- ✅ Déploiement réussi
- ✅ Tests post-déploiement OK
- ✅ Communication de succès

---

#### Jours 8-10 (Mercredi-Vendredi) - Surveillance
**Durée** : Surveillance continue  
**Responsable** : Équipe complète

**Métriques à surveiller** :

**Google Analytics** :
- [ ] Pages vues par URL (vérifier les `/comparer`, `/signature`, etc.)
- [ ] Taux de rebond (devrait baisser)
- [ ] Temps moyen sur le site (devrait augmenter)
- [ ] Tunnel de conversion (devrait s'améliorer)

**Logs serveur** :
- [ ] Erreurs 404 (devrait être à 0 pour les routes valides)
- [ ] Erreurs 500 (devrait être à 0)
- [ ] Temps de réponse

**Support utilisateur** :
- [ ] Tickets support (surveiller les anomalies)
- [ ] Feedback utilisateurs

**Objectifs week 1 post-déploiement** :
- Taux d'abandon tunnel : < 20% (au lieu de 40%)
- Taux de conversion : > 7% (au lieu de 5%)
- Erreurs techniques : 0
- Satisfaction utilisateur : > 8/10

**Livrables** :
- ✅ Rapport de surveillance J+1
- ✅ Rapport de surveillance J+3
- ✅ Rapport final J+7

---

## 👥 Répartition des rôles

| Rôle | Responsable | Charge (heures) |
|------|------------|-----------------|
| **Lead Dev** | [Nom] | 8h |
| **Dev Frontend** | [Nom] | 16h |
| **QA** | [Nom] | 12h |
| **DevOps** | [Nom] | 6h |
| **Product Owner** | [Nom] | 2h (validation) |

**Total** : 44 heures (~1 sprint)

---

## 💰 Budget estimé

| Poste | Coût |
|-------|------|
| Développement (16h × taux horaire) | €€€ |
| QA (12h × taux horaire) | €€€ |
| DevOps (6h × taux horaire) | €€€ |
| Lead Dev (8h × taux horaire) | €€€ |
| **Total** | **€€€€** |

**ROI attendu** :
- Conversion +35% = +XX clients/mois
- Valeur par client = YY€
- **Gain mensuel** : +XX × YY€ = **ZZ€/mois**
- **Retour sur investissement** : Dès le premier mois ✅

---

## 🚨 Gestion des risques

### Risque 1 : Bugs bloquants découverts tard
**Probabilité** : Faible  
**Impact** : Élevé  
**Mitigation** :
- Tests exhaustifs dès le J3
- Environnement de staging
- Rollback plan prêt

**Plan de rollback** :
```bash
# Restaurer la version précédente
ssh prod.mirador.fr "rm -rf /var/www/mirador"
ssh prod.mirador.fr "cp -r /var/www/mirador_backup_YYYYMMDD /var/www/mirador"
ssh prod.mirador.fr "sudo systemctl restart nginx"
```

---

### Risque 2 : Incompatibilité navigateur
**Probabilité** : Très faible (React Router très compatible)  
**Impact** : Moyen  
**Mitigation** :
- Tests cross-browser dès le J4
- Polyfills si nécessaire

---

### Risque 3 : Configuration serveur incorrecte
**Probabilité** : Moyenne  
**Impact** : Élevé  
**Mitigation** :
- Test en staging avant prod
- Documentation de config claire
- Double vérification DevOps

---

### Risque 4 : Perte de données utilisateur
**Probabilité** : Très faible  
**Impact** : Critique  
**Mitigation** :
- sessionStorage automatique
- Tests de persistance exhaustifs
- Pas de données critiques dans sessionStorage

---

## ✅ Critères de succès

### Critères techniques
- [ ] 0 erreur console en production
- [ ] 0 erreur 404 pour les routes valides
- [ ] Temps de navigation < 200ms
- [ ] Bundle size < 900 KB
- [ ] Compatibilité 100% des navigateurs cibles

### Critères fonctionnels
- [ ] Bouton retour fonctionne sur toutes les pages
- [ ] Refresh page conserve la progression
- [ ] Liens directs fonctionnent
- [ ] Routes protégées fonctionnent
- [ ] sessionStorage fonctionne

### Critères business
- [ ] Taux d'abandon tunnel < 20% (au lieu de 40%)
- [ ] Taux de conversion > 7% (au lieu de 5%)
- [ ] Satisfaction utilisateur > 8/10
- [ ] 0 plainte sur la navigation

---

## 📊 Tableau de bord de suivi

### Dashboard daily (à remplir chaque jour)

| Date | Tâches planifiées | Tâches réalisées | Blocages | Actions |
|------|-------------------|------------------|----------|---------|
| J1 | Préparation | ✅ | Aucun | - |
| J2 | Implémentation | ✅ | Aucun | - |
| J3 | Tests fonctionnels | 🔄 | - | - |
| J4 | Tests cross-browser | ⏳ | - | - |
| J5 | Config serveur | ⏳ | - | - |
| J6 | Tests finaux | ⏳ | - | - |
| J7 | Déploiement prod | ⏳ | - | - |

### Métriques clés (à surveiller post-déploiement)

| Métrique | Avant | Cible | Actuel | Status |
|----------|-------|-------|--------|--------|
| Taux d'abandon tunnel | 40% | < 20% | - | ⏳ |
| Taux de conversion | 5% | > 7% | - | ⏳ |
| Temps navigation | N/A | < 200ms | - | ⏳ |
| Erreurs 404 | N/A | 0 | - | ⏳ |
| Satisfaction | N/A | > 8/10 | - | ⏳ |

---

## 📝 Checklist finale avant Go Live

### Pré-déploiement
- [ ] Tous les tests fonctionnels passés
- [ ] Tous les tests cross-browser passés
- [ ] Serveur staging configuré et validé
- [ ] Configuration serveur production prête
- [ ] Backup de production effectué
- [ ] Équipe informée et en alerte
- [ ] Plan de rollback documenté
- [ ] Monitoring configuré (Google Analytics, logs)

### Post-déploiement (dans les 10 minutes)
- [ ] Site accessible
- [ ] Navigation fonctionne (test manuel)
- [ ] Bouton retour fonctionne
- [ ] Pas d'erreur console
- [ ] Pas d'erreur dans les logs serveur
- [ ] Google Analytics tracking actif

### J+1
- [ ] Vérification des métriques Google Analytics
- [ ] Vérification des logs serveur
- [ ] Vérification des tickets support
- [ ] Rapport d'incident (si applicable)

### J+7
- [ ] Rapport final de migration
- [ ] Validation des objectifs business
- [ ] Rétrospective d'équipe
- [ ] Documentation mise à jour

---

## 🎓 Formation de l'équipe

### Session de formation (1 heure)
**Date** : Avant J1  
**Participants** : Tous les devs  
**Objectifs** :
- Comprendre React Router
- Savoir naviguer avec `useNavigate`
- Comprendre les routes protégées
- Savoir débugger les problèmes de routing

**Agenda** :
1. Présentation du problème (10 min)
2. Démonstration de React Router (20 min)
3. Live coding : Ajout d'une route (15 min)
4. Q&A (15 min)

**Matériel** :
- Slides de présentation
- Code d'exemple
- Documentation React Router

---

## 📞 Communication

### Communication interne

**Avant migration** (J-2) :
```
Sujet : Migration React Router - Planning

Bonjour l'équipe,

Nous allons procéder à la migration vers React Router pour résoudre 
la dette technique de navigation (bouton retour du navigateur).

Planning :
- J1-J5 : Développement et tests
- J7 : Déploiement production (créneau 10h-12h)

Merci de bloquer vos agendas pour les tests et la surveillance.

Documentation : /MIGRATION_REACT_ROUTER.md
```

**Après déploiement** (J+0) :
```
Sujet : Migration React Router - Déploiement réussi ✅

Bonjour l'équipe,

La migration React Router est déployée en production.

Prochaines étapes :
- Surveillance active pendant 7 jours
- Rapport de métriques J+7

Merci à tous pour votre travail !
```

### Communication externe (si applicable)

**Pas de communication nécessaire** : Changement transparent pour l'utilisateur  
(Au contraire, amélioration de l'UX !)

---

## 📚 Documentation à créer/mettre à jour

- [ ] `/MIGRATION_REACT_ROUTER.md` - Créé ✅
- [ ] `/QUICK_START_ROUTER.md` - Créé ✅
- [ ] `/ROUTER_COMPARISON.md` - Créé ✅
- [ ] `/ACTION_PLAN_ROUTER.md` - Ce fichier ✅
- [ ] Wiki interne : "Comment ajouter une route"
- [ ] Onboarding nouveaux devs : Section React Router
- [ ] Runbook : "Débugger les problèmes de routing"

---

## 🎯 Conclusion

**Objectif** : Résoudre une dette technique critique avant le lancement B2C  
**Délai** : 1 sprint (10 jours)  
**Budget** : ~€€€€  
**ROI** : Dès le premier mois (augmentation conversion +35%)  
**Risque** : Faible (avec tests appropriés)

**Décision** : ✅ **GO pour la migration**

**Date de démarrage** : [À définir]  
**Date de fin cible** : [À définir]  
**Responsable global** : [À définir]

---

**Approuvé par** :
- [ ] Lead Dev
- [ ] Product Owner
- [ ] CTO
- [ ] CEO

**Date d'approbation** : ___/___/______

---

**Version** : 1.0  
**Dernière mise à jour** : Décembre 2024  
**Prochaine revue** : Post-déploiement (J+7)
