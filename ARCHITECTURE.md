# Architecture & déploiement — PROCAL

Site vitrine **statique** (HTML, CSS, JavaScript). Pas de base de données ni de serveur applicatif obligatoire.

---

## Arborescence actuelle

```text
procal-site/
├── index.html              # Accueil
├── devis.html              # Formulaire de devis
├── ARCHITECTURE.md         # Ce fichier
├── pages/services/         # 6 pages services
│   ├── etalonnage.html
│   ├── controle.html
│   ├── detecteurs.html
│   ├── aimants.html
│   ├── metrologie-medicale.html
│   └── maintenance.html
├── partials/               # Menu + footer (injectés par JS)
│   ├── nav.html
│   └── footer.html
├── assets/
│   ├── css/
│   │   ├── main.css        # Point d'entrée CSS
│   │   ├── site.css        # Styles de base
│   │   ├── global/         # Variables, surcharges
│   │   ├── components/     # Footer, etc.
│   │   └── pages/          # À propos, etc.
│   ├── js/
│   │   ├── main.js         # Point d'entrée JS
│   │   └── modules/        # carousel.js, layout.js
│   └── images/
│       ├── logo/
│       ├── acceuil/        # Slides hero accueil
│       └── services/       # Images cartes + carrousels
├── scripts/
│   └── build-pages.py      # Régénère les pages services (optionnel)
└── service-*.html          # Redirections (anciennes URLs)
```

### Fichiers supprimés (plus utiles)

| Élément | Raison |
|---------|--------|
| Dossier `asset/` | Doublon de `assets/images/` |
| `style.css` | Remplacé par `assets/css/main.css` |
| `script.js` | Remplacé par `assets/js/main.js` (module ES) |
| Images orphelines à la racine de `assets/images/` | Doublons / non référencées |
| Dossier `assets/images/hero/` | Ancien carrousel, non utilisé |

---

## Développement local

```bash
cd procal-site
python3 -m http.server 8080
```

Ouvrir : **http://localhost:8080**

> Les partials (`partials/nav.html`, `partials/footer.html`) et les modules JavaScript nécessitent un **serveur HTTP**. Ne pas ouvrir les fichiers en `file://`.

---

## Hébergement — solutions gratuites

Adaptées à un site statique comme PROCAL.

| Service | Intérêt | Nom de domaine | HTTPS |
|---------|---------|----------------|-------|
| **[Netlify](https://www.netlify.com)** | Très simple, glisser-déposer ou Git | Sous-domaine `*.netlify.app` gratuit | Oui |
| **[Cloudflare Pages](https://pages.cloudflare.com)** | Rapide, CDN mondial | `*.pages.dev` gratuit | Oui |
| **[Vercel](https://vercel.com)** | Déploiement Git en 1 clic | `*.vercel.app` gratuit | Oui |
| **[GitHub Pages](https://pages.github.com)** | Gratuit si le code est sur GitHub | `utilisateur.github.io/projet` | Oui |

### Déploiement type (Netlify / Cloudflare / Vercel)

1. Créer un compte sur la plateforme choisie.
2. Connecter un dépôt Git **ou** envoyer le dossier `procal-site` (drag & drop).
3. **Racine du site** = dossier qui contient `index.html` (souvent la racine du repo).
4. Pas de commande de build à configurer (site déjà prêt).
5. Après déploiement : tester accueil, devis, pages services, formulaires.

### Limites gratuites (générales)

- Bande passante suffisante pour un site vitrine PME.
- Formulaires : gérés par **EmailJS** (voir ci-dessous), pas par l’hébergeur.
- Nom personnalisé (`www.procal-ci.com`) : possible, souvent via achat du domaine ailleurs + DNS.

---

## Hébergement — solutions payantes

Utiles pour un **nom de domaine professionnel**, un **email `@procal-ci.com`**, ou un hébergement local (Afrique de l’Ouest).

| Type | Exemples | Usage |
|------|----------|--------|
| **Nom de domaine** | OVH, Gandi, Namecheap, Google Domains | `procal-ci.com` (~10–15 €/an) |
| **Hébergement mutualisé** | OVH, Hostinger, LWS, o2switch | FTP + espace web, souvent avec email |
| **Hébergement cloud** | OVH Web Cloud, AWS S3 + CloudFront | Plus de contrôle, montée en charge |
| **VPS** | OVH VPS, DigitalOcean | Si backend PHP/Node plus tard |

### Mise en ligne sur hébergement classique (cPanel / FTP)

1. Acheter domaine + hébergement (ex. OVH Côte d’Ivoire / international).
2. Se connecter en **FTP** ou **Gestionnaire de fichiers**.
3. Copier **tout le contenu** de `procal-site` dans `public_html/` ou `www/`.
4. Vérifier que `index.html` est à la racine du site.
5. Activer **HTTPS** (Let’s Encrypt souvent inclus).
6. Pointer le domaine vers l’hébergement (DNS A / CNAME).

### Combiné recommandé (économique)

- **Site** : Netlify ou Cloudflare Pages (gratuit, rapide, HTTPS).
- **Domaine** : acheté chez OVH ou autre (~10 €/an), DNS pointant vers Netlify/Cloudflare.
- **Email pro** : Google Workspace, OVH Mail, ou Zoho Mail (payant).

---

## Formulaires (devis & contact)

Le site utilise **EmailJS** côté navigateur :

- Clé publique dans `assets/js/main.js`
- Compte gratuit EmailJS : quota limité (suffisant pour démarrer)
- Compte payant EmailJS : plus d’envois / fiabilité

Aucun PHP ni Node n’est requis sur l’hébergeur pour les formulaires actuels.

Pour une évolution future (base de données, pièces jointes lourdes) : API backend (Node, PHP, Firebase) — hors scope du déploiement statique actuel.

---

## Checklist avant mise en production

- [ ] Tester sur mobile, tablette, desktop
- [ ] Vérifier tous les liens (menu, services, devis, footer)
- [ ] Tester l’envoi des formulaires (EmailJS configuré)
- [ ] Remplacer les numéros / emails si encore des placeholders
- [ ] Compresser ou optimiser les images lourdes si besoin
- [ ] Configurer le domaine `procal-ci.com` + HTTPS
- [ ] Soumettre le site à Google Search Console (référencement)

---

## Modifier le site plus tard

| Besoin | Fichier / action |
|--------|------------------|
| Texte accueil | `index.html` |
| Menu / footer global | `partials/nav.html`, `partials/footer.html` |
| Couleurs / tailles | `assets/css/global/variables.css` |
| Section à propos | `index.html` + `assets/css/pages/about.css` |
| Nouvelle page service | Copier une page dans `pages/services/` ou lancer `python3 scripts/build-pages.py` |
| Carrousel | Même structure que l’accueil : `hero-section` + `data-carousel` |
