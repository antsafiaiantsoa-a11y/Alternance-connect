# Alternance Connect

**Connecter les talents, les entreprises et les formations.**

Alternance Connect est une plateforme web responsive destinée aux candidats, aux recruteurs et aux organismes de formation. Le projet est préparé progressivement à partir du cahier des charges fourni.

## Socle technique

- Laravel 13 pour le serveur, les routes, l'authentification et l'accès aux données.
- React 19, TypeScript et Inertia pour l'interface.
- MySQL pour la base de données.
- Vite pour les ressources frontend.
- Kit de démarrage React officiel de Laravel.

Laravel utilise sa structure habituelle : contrôleurs dans `app/Http/Controllers`, modèles Eloquent dans `app/Models`, routes dans `routes`, interface React dans `resources/js` et fichiers accessibles publiquement dans `public`. Les fichiers privés (dont les futurs CV) seront conservés dans `storage`.

## Prérequis

- PHP **8.3 ou supérieur** avec les extensions PDO MySQL, cURL, Fileinfo, Mbstring, OpenSSL et XML.
- Composer.
- Node.js 22 et npm.
- MySQL, par exemple celui fourni avec XAMPP.

PHP 8.5.12 est maintenant installé dans le profil utilisateur avec l'installateur recommandé par Laravel. XAMPP conserve son PHP 8.1 pour Apache ; cela n'a pas été remplacé. Ouvrir une nouvelle fenêtre PowerShell puis vérifier que `php -v` affiche 8.5 avant d'exécuter les commandes du projet.

## Installation locale sous Windows / XAMPP

1. Démarrer MySQL depuis le panneau XAMPP.
2. Dans phpMyAdmin, créer une base nommée `alternance_connect`, avec le jeu de caractères `utf8mb4`.
3. Depuis ce dossier, copier la configuration d'exemple puis installer les dépendances :

   ```powershell
   if (-not (Test-Path .env)) { Copy-Item .env.example .env }
   composer install
   npm install
   ```

4. Générer la clé de l'application et créer les tables :

   ```powershell
   php artisan key:generate
   php artisan migrate
   ```

5. Lancer l'application en mode développement :

   ```powershell
   composer run dev
   ```

   Ouvrir ensuite l'adresse indiquée dans le terminal (par défaut `http://localhost:8000`). Sur ce poste, le port 8000 étant déjà occupé par une autre application, Alternance Connect est lancé sur `http://localhost:8001`.

La connexion MySQL par défaut dans `.env.example` correspond à une installation XAMPP locale (`root`, sans mot de passe). Si votre configuration diffère, modifier `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` et `DB_PASSWORD` dans `.env`.

## Offres d’alternance réelles

La recherche publique est disponible sur `/offres`. Les annonces sont importées depuis l’API officielle [La Bonne Alternance](https://api.apprentissage.beta.gouv.fr/fr/documentation-technique). Les suggestions d’entreprises sans annonce ne sont jamais présentées comme des offres. L’API est gratuite pour les usages non lucratifs ; son usage commercial nécessite une autorisation distincte.

1. Créer une clé API dans l’[Espace développeurs La Bonne Alternance](https://api.apprentissage.beta.gouv.fr/fr), puis renseigner dans `.env` :

   ```dotenv
   LBA_API_KEY=votre_cle_api
   LBA_ENABLED=true
   LBA_NON_PROFIT_USE=true
   ```

   Ne mettre `LBA_NON_PROFIT_USE=true` que si l’usage du site est bien non lucratif. Ne jamais publier la clé API.

2. Ouvrir `/admin/offres` après connexion. En environnement local, un compte connecté peut administrer les sources si aucune adresse administrateur n’est configurée. Pour les autres environnements, ajouter les adresses autorisées dans `OFFERS_ADMIN_EMAILS` (séparées par des virgules).
3. Cliquer sur « Synchroniser maintenant », ou lancer la commande :

   ```powershell
   php artisan job-offers:sync lba
   ```

   La tâche planifiée relance la synchronisation chaque jour à 04:15, heure de Paris. En local, lancer `php artisan schedule:work` dans un terminal pour exécuter le planificateur. En production, configurer le planificateur du serveur pour lancer `php artisan schedule:run` chaque minute.

Les offres expirées ou absentes de l’export réussi sont retirées des résultats publics. Le bouton de candidature utilise le lien fourni par la source (`apply.url`). L’API ne documente pas de lien distinct vers une page d’annonce originale.

L’API directe des offres France Travail est actuellement retirée du portail développeur et reste désactivée. Des offres de partenaires — dont France Travail — peuvent apparaître via La Bonne Alternance. Pour un accès direct France Travail, demander une autorisation à [France Travail](https://www.data.gouv.fr/dataservices/api-offres-demploi).

## Identité visuelle

La charte du projet est définie dans le cahier des charges : violet `#6941C6`, bleu `#3563EB`, violet secondaire `#8B5CF6`, fond `#F4F5FF`, texte `#1E293B` et accent clair `#DBEAFE`. Le logo pourra être ajouté dans `public/assets/images/logo.png` ; le monogramme « AC » servira de solution provisoire.

## État du projet

L’application comprend une page d’accueil responsive, une recherche d’offres réelles avec filtres et pagination, la synchronisation officielle, une administration des sources, ainsi que l’inscription, la connexion et l’espace personnel. L’interface est disponible en français, anglais et allemand. Les offres restent vides tant qu’une clé La Bonne Alternance n’a pas été configurée et synchronisée.

La gestion des candidatures internes, des formations, de la messagerie et des rôles métiers reste à développer. L'application locale est accessible sur `http://localhost:8001` sur ce poste.

Le dossier `storage` n'est pas exposé directement par le serveur web. En production, configurer le serveur web pour que sa racine publique pointe uniquement vers le dossier `public` de Laravel.
"# Alternance-connect" 
