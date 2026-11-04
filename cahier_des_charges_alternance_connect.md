# Cahier des charges --- Alternance Connect

> **Nom du projet :** Alternance Connect\
> **Type :** Plateforme web responsive de recrutement et de mise en
> relation\
> **Public cible :** Candidats, étudiants, entreprises, recruteurs et
> organismes de formation\
> **Version du document :** 1.0\
> **Statut :** Cahier des charges initial --- MVP

------------------------------------------------------------------------

## Identité visuelle et logo

**Nom :** Alternance Connect

**Concept du logo :** un monogramme « AC » moderne, composé de formes
géométriques arrondies et reliées, symbolisant la connexion entre les
candidats, les entreprises et les organismes de formation. Le nom «
Alternance Connect » accompagne le symbole.

**Palette de couleurs :**

  Usage               Couleur              Code hexadécimal
  ------------------- -------------------- ------------------
  Violet principal    Violet               `#6941C6`
  Bleu principal      Bleu                 `#3563EB`
  Violet secondaire   Violet lumineux      `#8B5CF6`
  Fond général        Blanc bleuté         `#F4F5FF`
  Surface et cartes   Blanc                `#FFFFFF`
  Texte principal     Bleu ardoise foncé   `#1E293B`
  Texte secondaire    Gris bleuté          `#64748B`
  Bordures            Gris clair           `#E5E7EB`
  Accent clair        Bleu pâle            `#DBEAFE`

**Principes graphiques :** - Interface moderne, élégante,
professionnelle et accessible. - Violet dominant et bleu
complémentaire. - Dégradés violet-bleu subtils pour certains éléments
importants. - Fonds blancs ou légèrement bleutés. - Cartes aux coins
arrondis et ombres légères. - Typographie lisible, hiérarchie visuelle
claire et icônes cohérentes. - Design responsive pour ordinateur,
tablette et mobile.

------------------------------------------------------------------------

## 1. Présentation générale du projet

Alternance Connect est une plateforme numérique destinée à faciliter la
mise en relation entre les personnes à la recherche d'une alternance ou
d'un emploi, les entreprises qui recrutent et les organismes qui
proposent des formations.

La plateforme centralise les offres, les profils, les candidatures et
les informations utiles au recrutement. Elle permet aux candidats de
présenter leurs compétences et leur portfolio, aux recruteurs de publier
des offres et de suivre les candidatures, et aux organismes de formation
de présenter leurs programmes.

Le projet sera développé progressivement. La première livraison sera un
**MVP (Minimum Viable Product)** fonctionnel, avant l'ajout de
fonctionnalités avancées et d'une application mobile.

## 2. Contexte et problématique

La recherche d'une alternance ou d'un emploi peut être difficile lorsque
les offres, les entreprises et les formations sont dispersées sur
plusieurs plateformes. Les candidats ont également besoin de présenter
clairement leur parcours et de suivre leurs démarches.

Alternance Connect répond à ces besoins en proposant un espace
centralisé, simple d'utilisation et sécurisé.

## 3. Objectifs du projet

### 3.1 Objectif général

Créer une plateforme web responsive permettant de connecter candidats,
entreprises et organismes de formation autour de l'alternance, de
l'emploi et du développement des compétences.

### 3.2 Objectifs spécifiques

-   Faciliter la recherche d'offres d'alternance et d'emploi.
-   Permettre aux candidats de créer un profil professionnel complet.
-   Donner aux recruteurs des outils de publication et de gestion des
    offres.
-   Simplifier le dépôt et le suivi des candidatures.
-   Donner de la visibilité aux organismes de formation.
-   Améliorer la communication entre les différents utilisateurs.
-   Protéger les données personnelles et les documents déposés.
-   Prévoir une architecture pouvant évoluer vers Android et iOS.

## 4. Utilisateurs et rôles

La plateforme comporte quatre rôles principaux.

### 4.1 Candidat / Étudiant

Le candidat peut : - Créer un compte et se connecter. - Compléter son
profil personnel et professionnel. - Ajouter une photo de profil. -
Renseigner sa formation, ses expériences et ses compétences. - Ajouter
un CV au format PDF. - Ajouter un portfolio ou des liens vers ses
réalisations. - Rechercher et filtrer les offres. - Ajouter des offres
en favoris. - Postuler en ligne. - Consulter l'historique et le statut
de ses candidatures. - Échanger avec les recruteurs lorsque la
messagerie est disponible. - Gérer ses notifications et ses paramètres.

### 4.2 Entreprise / Recruteur

Le recruteur peut : - Créer un compte entreprise. - Compléter la fiche
de son entreprise. - Ajouter un logo et une présentation. - Créer,
modifier et archiver des offres. - Soumettre les offres à la
modération. - Consulter les candidatures reçues. - Accéder aux profils
et CV des candidats autorisés. - Faire évoluer le statut d'une
candidature. - Échanger avec les candidats. - Consulter des statistiques
sur ses offres et candidatures.

### 4.3 Organisme de formation

L'organisme de formation peut : - Créer un compte et présenter son
établissement. - Ajouter son logo, ses coordonnées et sa description. -
Publier des formations. - Décrire les objectifs, prérequis, durée et
modalités. - Modifier et archiver ses formations. - Consulter les
demandes d'information ou candidatures liées à ses formations. -
Échanger avec les personnes intéressées.

### 4.4 Administrateur

L'administrateur peut : - Consulter et gérer les comptes utilisateurs. -
Activer, suspendre ou désactiver un compte selon les règles définies. -
Vérifier les entreprises et organismes. - Modérer les offres avant
publication. - Traiter les signalements. - Consulter les statistiques
générales. - Gérer les catégories, métiers et paramètres de la
plateforme. - Consulter les journaux techniques et les événements de
sécurité autorisés.

## 5. Périmètre fonctionnel

### 5.1 Fonctionnalités publiques

-   Page d'accueil présentant la plateforme.
-   Présentation du fonctionnement.
-   Consultation des offres publiées et validées.
-   Recherche d'offres.
-   Consultation des fiches entreprises.
-   Consultation des organismes et formations.
-   Pages de connexion et d'inscription.
-   Pages légales et politique de confidentialité.

### 5.2 Authentification et comptes

-   Inscription avec adresse e-mail et mot de passe.
-   Choix du type de compte autorisé.
-   Vérification de l'adresse e-mail.
-   Connexion et déconnexion.
-   Réinitialisation du mot de passe.
-   Gestion des sessions.
-   Contrôle des accès selon le rôle.
-   Modification des informations du compte.

### 5.3 Profils et CV

Le profil candidat contient notamment : - Nom et prénom. - Photo
facultative. - Localisation. - Présentation. - Formation et diplômes. -
Expériences. - Compétences. - Langues. - Type de contrat recherché. -
Disponibilité. - CV PDF. - Portfolio et liens professionnels.

Le candidat doit pouvoir mettre à jour ses informations et contrôler la
visibilité des données affichées.

### 5.4 Offres et recherche

Chaque offre peut contenir : - Intitulé du poste. - Entreprise. -
Description et missions. - Compétences requises. - Niveau d'études ou
prérequis. - Localisation. - Type de contrat. - Durée, si applicable. -
Date de publication. - Date limite de candidature. - Rémunération, si
communiquée. - Statut de publication.

Filtres de recherche : - Métier ou mot-clé. - Localisation. - Type de
contrat. - Domaine d'activité. - Compétences. - Niveau d'études. - Date
de publication.

### 5.5 Candidatures et suivi

Le candidat peut postuler à une offre en transmettant les informations
et documents demandés.

Statuts possibles : 1. Envoyée. 2. En cours d'examen. 3.
Présélectionnée. 4. Entretien proposé. 5. Acceptée. 6. Refusée. 7.
Retirée par le candidat.

Chaque changement de statut doit être enregistré et visible par les
utilisateurs autorisés.

### 5.6 Favoris

-   Ajouter une offre aux favoris.
-   Retirer une offre des favoris.
-   Consulter la liste des offres enregistrées.

### 5.7 Messagerie et notifications

Pour le MVP : - Notifications internes lors d'un événement important. -
Notification lors d'un changement de statut de candidature. -
Notification lors d'un nouveau message.

La messagerie peut être réalisée dans une itération ultérieure si le
délai du MVP est limité. Les notifications par e-mail nécessitent une
configuration dédiée.

### 5.8 Modération

Les offres créées par les recruteurs ne doivent pas être visibles
publiquement avant validation.

L'administrateur peut : - Approuver une offre. - Refuser une offre en
indiquant un motif. - Demander une correction. - Suspendre une offre
publiée. - Traiter un signalement.

## 6. Tableaux de bord

### 6.1 Tableau de bord candidat

-   Nombre de candidatures envoyées.
-   Candidatures en cours.
-   Entretiens proposés.
-   Offres favorites.
-   Dernières offres correspondant à son profil.
-   Notifications récentes.

### 6.2 Tableau de bord recruteur

-   Nombre d'offres publiées.
-   Offres en attente de validation.
-   Nombre de candidatures reçues.
-   Candidatures par statut.
-   Dernières candidatures.
-   Actions rapides pour publier une offre.

### 6.3 Tableau de bord organisme

-   Nombre de formations publiées.
-   Formations en attente de validation.
-   Nombre de demandes reçues.
-   Dernières interactions.

### 6.4 Tableau de bord administrateur

-   Nombre de comptes par rôle.
-   Nombre d'offres publiées et en attente.
-   Nombre de signalements.
-   Activité récente.
-   Actions de modération à traiter.

## 7. Exigences techniques

### 7.1 Technologies retenues

  Élément                    Technologie
  -------------------------- ------------------------------------------
  Backend                    PHP 8 orienté objet
  Base de données            MySQL
  Accès aux données          PDO
  Frontend                   HTML5, CSS3, JavaScript
  Framework CSS              Bootstrap 5
  Icônes                     Font Awesome ou bibliothèque équivalente
  Architecture               MVC
  Gestion de versions        Git et GitHub
  Serveur de développement   XAMPP ou serveur PHP
  API future                 API REST en PHP

Les dépendances devront être documentées et limitées au nécessaire.

### 7.2 Architecture logicielle

Le projet adoptera une architecture MVC : - **Models :** accès aux
données et logique métier. - **Views :** affichage des pages et
composants. - **Controllers :** traitement des requêtes et
coordination. - **Middleware :** contrôle de l'authentification et des
permissions. - **Config :** configuration de l'application et de la
base. - **Routes :** définition des routes. - **Public :** seul
répertoire directement accessible depuis le web. - **Storage :**
documents privés, fichiers et journaux non publics.

### 7.3 Base de données prévisionnelle

Tables principales envisagées : - `users` : comptes, e-mails, mots de
passe hachés et rôles. - `candidate_profiles` : informations des
candidats. - `companies` : fiches entreprises. -
`training_organizations` : organismes de formation. - `offers` : offres
d'alternance et d'emploi. - `applications` : candidatures. -
`application_status_history` : historique des statuts. - `skills` :
référentiel de compétences. - `candidate_skills` : compétences des
candidats. - `offer_skills` : compétences demandées dans les offres. -
`favorites` : offres enregistrées. - `formations` : programmes de
formation. - `messages` : messages internes. - `notifications` :
notifications. - `reports` : signalements. - `moderation_logs` :
historique des décisions de modération.

Les relations, contraintes, index et règles de suppression seront
définis avant la création du schéma SQL définitif.

## 8. Sécurité et protection des données

La plateforme doit appliquer les mesures suivantes : - Hachage des mots
de passe avec `password_hash()` et vérification avec
`password_verify()`. - Requêtes préparées PDO contre les injections
SQL. - Validation côté serveur de toutes les données reçues. -
Échappement des données affichées contre les attaques XSS. - Protection
CSRF des formulaires sensibles. - Contrôle systématique des rôles et
permissions. - Protection des sessions et renouvellement de
l'identifiant de session après connexion. - Limitation des tentatives de
connexion. - Vérification du type réel, de l'extension et de la taille
des fichiers. - Stockage des CV et documents en dehors du répertoire
public. - Accès aux documents uniquement après vérification des
permissions. - Utilisation de HTTPS en production. - Sauvegardes
régulières et tests de restauration. - Journalisation des actions
administratives importantes. - Politique de conservation et de
suppression des données.

Les données personnelles ne doivent être accessibles qu'aux personnes
autorisées. Les fonctionnalités de visibilité du profil et de partage du
CV doivent être clairement expliquées à l'utilisateur.

La conformité au RGPD et aux réglementations applicables devra être
vérifiée avant la mise en production, notamment pour les droits d'accès,
de rectification, de suppression et de limitation des données.

## 9. Exigences non fonctionnelles

-   Interface responsive et accessible.
-   Navigation claire et cohérente.
-   Temps de chargement raisonnable.
-   Code maintenable et documenté.
-   Compatibilité avec les versions récentes de Chrome, Firefox, Edge et
    Safari.
-   Messages d'erreur compréhensibles.
-   Gestion des erreurs sans divulguer d'informations techniques
    sensibles.
-   Sauvegardes vérifiables.
-   Architecture évolutive pour une future application mobile.

## 10. Plateformes ciblées

### Version initiale

Application web responsive accessible depuis : - Ordinateur. -
Tablette. - Smartphone.

### Évolutions futures

-   Application Android.
-   Application iOS.
-   Connexion aux services via une API REST sécurisée.

La version mobile native ne fait pas partie du MVP initial, sauf
décision contraire de l'équipe.

## 11. Parcours utilisateurs principaux

### Parcours candidat

1.  Le candidat arrive sur la page d'accueil.
2.  Il consulte les offres.
3.  Il crée un compte candidat.
4.  Il complète son profil et ajoute son CV.
5.  Il recherche une offre correspondant à ses compétences.
6.  Il consulte les détails de l'offre.
7.  Il dépose sa candidature.
8.  Il suit les changements de statut dans son espace personnel.

### Parcours recruteur

1.  Le recruteur crée un compte.
2.  Il renseigne les informations de son entreprise.
3.  Il crée une offre.
4.  L'offre est soumise à la modération.
5.  Après validation, elle devient visible.
6.  Le recruteur consulte les candidatures.
7.  Il met à jour les statuts et échange avec les candidats.

### Parcours administrateur

1.  L'administrateur se connecte.
2.  Il consulte les offres en attente.
3.  Il vérifie leur conformité.
4.  Il approuve, refuse ou demande une correction.
5.  Il traite les signalements et surveille l'activité.

## 12. Planning prévisionnel

Planning indicatif à adapter à la taille de l'équipe et aux contraintes
du projet.

  Phase   Travaux                                      Durée indicative
  ------- ------------------------------------------ ------------------
  1       Analyse, cahier des charges et maquettes           2 semaines
  2       Architecture et base de données                     1 semaine
  3       Authentification et gestion des rôles              2 semaines
  4       Profils et gestion des CV                          2 semaines
  5       Offres, recherche et filtres                       2 semaines
  6       Candidatures et tableaux de bord                   2 semaines
  7       Administration et modération                        1 semaine
  8       Tests, corrections et documentation                2 semaines
  9       Déploiement du MVP                                  1 semaine

Les fonctionnalités de messagerie avancée, l'API mobile et les
applications natives pourront être planifiées après validation du MVP.

## 13. Tests et critères de validation

Le MVP sera considéré comme fonctionnel lorsque :

-   Un candidat peut créer un compte et se connecter.
-   Un candidat peut compléter son profil et déposer un CV.
-   Un candidat peut rechercher une offre et l'ajouter aux favoris.
-   Un candidat peut postuler et consulter le statut de sa candidature.
-   Un recruteur peut créer une fiche entreprise et soumettre une offre.
-   Une offre ne peut pas être publiée sans validation de modération.
-   Un recruteur peut consulter les candidatures de ses offres.
-   Un organisme peut publier et gérer ses formations.
-   Un administrateur peut gérer les comptes et modérer les contenus.
-   Les permissions empêchent un utilisateur d'accéder aux données d'un
    autre compte sans autorisation.
-   Les formulaires, fichiers et sessions font l'objet de tests de
    sécurité.
-   L'interface fonctionne sur ordinateur et smartphone.

## 14. Livrables attendus

À la fin du projet, les livrables seront :

1.  Cahier des charges fonctionnel et technique.
2.  Logo et charte graphique.
3.  Maquettes des principales interfaces.
4.  Code source organisé et documenté.
5.  Base de données MySQL et script SQL.
6.  Application web responsive fonctionnelle.
7.  Système d'authentification multi-rôles.
8.  Gestion des profils, offres et candidatures.
9.  Interface d'administration et modération.
10. Documentation d'installation et de configuration.
11. Documentation utilisateur.
12. Plan de sauvegarde et procédure de restauration.
13. Rapport de tests.
14. Démonstration du MVP.

## 15. Risques et contraintes

  -----------------------------------------------------------------------
  Risque                              Mesure préventive
  ----------------------------------- -----------------------------------
  Fausses offres                      Vérification des recruteurs et
                                      modération

  Vol de données                      Contrôles d'accès, HTTPS et
                                      stockage sécurisé

  Fichiers malveillants               Validation stricte des fichiers

  Perte de données                    Sauvegardes et tests de
                                      restauration

  Retard de développement             Priorisation des fonctionnalités
                                      MVP

  Problèmes de performance            Pagination, index et optimisation
                                      des requêtes

  Comptes frauduleux                  Vérification e-mail, signalements
                                      et contrôle administrateur
  -----------------------------------------------------------------------

## 16. Évolutions possibles

Après la mise en service du MVP, les améliorations pourront inclure : -
Applications Android et iOS. - API REST complète. - Notifications
push. - Messagerie en temps réel. - Recommandation d'offres selon les
compétences. - Suggestions de compétences à développer. - Génération ou
amélioration assistée du CV. - Statistiques avancées pour les
recruteurs. - Vérification renforcée des entreprises. -
Internationalisation et gestion de plusieurs langues.

## 17. Conclusion

Alternance Connect a pour ambition de simplifier l'accès à l'alternance,
à l'emploi et à la formation en réunissant les principaux acteurs du
recrutement sur une plateforme unique.

Le développement sera progressif, avec une première version MVP
sécurisée, responsive et réellement fonctionnelle. La qualité du code,
la protection des données personnelles, la facilité d'utilisation et
l'évolutivité seront au cœur du projet.

------------------------------------------------------------------------

**Nom du projet :** Alternance Connect\
**Signature :** Connecter les talents, les entreprises et les
formations.\
**Document :** Cahier des charges --- Version 1.0
