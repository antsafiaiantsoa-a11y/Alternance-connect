# Audit et plan de l’agrégateur européen

Date de vérification des sources : 4 novembre 2026.

## État du projet

- L’application utilise Laravel 13, React 19 et Inertia. MySQL est configuré dans l’environnement du projet.
- Les pages d’offres, la recherche, les comptes, les réglages, la gestion de sources et l’import La Bonne Alternance (LBA) existent déjà.
- Le connecteur LBA attend une clé API et la confirmation d’un usage non lucratif. Sans ces éléments, aucune offre n’est importée dans la base. La page publique utilise alors le widget officiel LBA comme solution de consultation, mais ces résultats ne sont pas stockés dans Alternance Connect.
- L’accès direct France Travail n’est pas opérationnel et reste désactivé. La page officielle des API France Travail ne présente pas actuellement l’API Offres comme un accès développeur disponible.
- Aucun connecteur EURES ou autre service public européen n’est présent dans le code. Les annonces exposées par EURES ne peuvent pas être copiées ou republiées librement : son portail réserve l’extraction aux organismes partenaires EURES reconnus.
- Le modèle actuel d’offre est principalement adapté aux données françaises : il ne normalise pas encore le pays, la devise, le secteur, la durée, les langues ou les conditions de réutilisation. Bootstrap 5 n’est pas installé ; l’interface actuelle utilise Tailwind CSS.
- Un premier espace entreprise est maintenant prévu : profil soumis à vérification manuelle, annonces soumises à modération, candidatures conservées dans l’application et statut de candidature géré par l’entreprise. Cette publication directe ne remplace pas les connecteurs de sources externes.
- Les nouveaux formulaires enregistrent l’accord d’information, limitent l’accès aux candidatures à l’entreprise concernée et permettent au candidat de supprimer sa candidature. La conformité complète (politique de confidentialité, durées de conservation, demandes de droits et base légale par pays) reste à valider.

## Sources et couverture

| Source                               | Pays / périmètre                                           | État d’accès vérifié                                                                                                                                                                                               | Suite possible                                                                             |
| ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| La Bonne Alternance                  | France                                                     | API officielle avec clé. L’export est limité à 2 appels/minute, rafraîchi quotidiennement et son usage est réservé au non lucratif. La soumission de candidature via API requiert un accès de production distinct. | Configurer la clé, confirmer l’usage autorisé, tester l’import et respecter l’attribution. |
| Widget La Bonne Alternance           | France                                                     | Intégration iframe officielle actuellement utilisée quand aucune offre n’a été importée. Les données restent hébergées et présentées par le service.                                                               | Solution de continuité ; ne remplace pas l’import centralisé voulu.                        |
| France Travail (API Offres directe)  | France                                                     | Pas d’accès direct exploitable configuré dans le projet ; le statut de disponibilité du portail doit être revérifié avant développement.                                                                           | Obtenir une confirmation écrite et la documentation d’accès avant toute connexion.         |
| EURES                                | 31 pays : UE-27, Islande, Liechtenstein, Norvège et Suisse | L’accès d’extraction est réservé aux organisations partenaires reconnues par un bureau national de coordination EURES.                                                                                             | Demander l’admission/autorisation ; sans elle, ne pas extraire ni republier les annonces.  |
| Agences nationales de l’emploi (PES) | À évaluer pays par pays                                    | Aucune connexion n’est configurée. Les conditions, API, licences et catégories de formation varient selon chaque pays.                                                                                             | Auditer chaque source et obtenir l’autorisation requise avant de créer son connecteur.     |
| Flux d’entreprises ou partenaires    | Selon contrat                                              | Aucun flux ni accord partenaire n’est configuré.                                                                                                                                                                   | Recevoir une API ou un flux documenté et conserver l’accord et les règles d’attribution.   |

Le catalogue des pays dans l’application représente une possibilité de couverture, pas une promesse d’offres disponibles. À cette étape, la seule source d’offres préparée est LBA, pour la France, sous réserve de configuration. Les pays européens ne sont pas annoncés comme connectés.

## Modèle cible

Le socle actuel `job_offers` conserve l’identifiant et le libellé d’origine de chaque source. L’extension ajoute un pays normalisé et prévoit l’adresse, le secteur, la formation, la devise, les bornes salariales, la durée, les langues requises, l’attribution, la licence et une empreinte de dédoublonnage. Les champs fournis par une source restent traçables ; une donnée inconnue reste vide au lieu d’être devinée ou traduite automatiquement.

Les connecteurs futurs devront stocker leur pays d’origine, leur URL d’annonce, leur URL de candidature et les conditions de réutilisation. Un identifiant fournisseur sert à éviter de réimporter deux fois la même annonce depuis cette source ; un dédoublonnage entre sources devra être testé avant de fusionner des annonces distinctes.

## Étapes de réalisation

1. Ajouter le catalogue européen activable, le filtre de pays et les champs normalisés, sans prétendre activer les connexions externes.
2. Configurer et tester LBA avec une clé autorisée ; afficher les erreurs et la date de synchronisation.
3. Auditer individuellement les PES et flux des pays retenus ; enregistrer leurs termes, limites, attribution et accord.
4. Développer un connecteur à la fois avec fixtures de test, tests de filtres, doublons, erreurs, expiration et attribution. Un test de connexion réelle ne sera possible qu’avec les accès fournis.
5. Remplacer progressivement le widget par les cartes unifiées alimentées depuis la base, après qu’un connecteur autorisé fonctionne.
6. Continuer le portail entreprise : amélioration de l’édition d’annonces, notifications et contrôles de vérification selon chaque pays.
7. Faire relire les textes de confidentialité et définir les durées de conservation avant une mise en production européenne.

## Références officielles

- [Documentation technique de l’API La Bonne Alternance](https://api.apprentissage.beta.gouv.fr/fr/documentation-technique)
- [Portail développeur La Bonne Alternance](https://api.apprentissage.beta.gouv.fr/fr)
- [Service de données et widget La Bonne Alternance](https://www.data.gouv.fr/dataservices/api-la-bonne-alternance)
- [Liste des services API France Travail](https://www.data.gouv.fr/organizations/france-travail/dataservices)
- [Aide officielle EURES : services et pays couverts](https://eures.europa.eu/eures-services/help-and-support_fr)
- [Conditions d’utilisation du portail EURES](https://europa.eu/eures/portal/jv-se/home?lang=ch)
- [Informations de l’Autorité européenne du travail sur le réseau EURES](https://www.ela.europa.eu/en/activities/eures)
- [Conditions d’utilisation de l’Agence fédérale allemande pour l’emploi](https://www.arbeitsagentur.de/en/terms-of-use)
- [Interface XML HR-BA pour publier des offres auprès de l’Agence fédérale allemande](https://www.arbeitsagentur.de/unternehmen/arbeitskraefte/hr-ba-xml-schnittstelle)
