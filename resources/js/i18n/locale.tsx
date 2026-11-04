import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';
import { Languages } from 'lucide-react';

export type Language = 'fr' | 'en' | 'de';
type MessageValues = Record<string, string | number>;

const messages: Record<Language, Record<string, string>> = {
    fr: {
        'language.label': 'Langue du site',
        'home.brand.alt': 'Alternance Connect, trouver une alternance',
        'home.title': 'Trouve l’alternance qui te ressemble',
        'home.nav.offers': 'Les offres',
        'home.nav.how': 'Comment ça marche',
        'home.nav.partners': 'Entreprises & écoles',
        'home.nav.login': 'Se connecter',
        'home.nav.register': 'Créer un compte',
        'home.nav.space': 'Mon espace',
        'home.hero.badge': 'Ton avenir commence ici',
        'home.hero.titleStart': 'La bonne alternance peut',
        'home.hero.titleEnd': 'tout changer.',
        'home.hero.description':
            'Trouve une entreprise, une formation et un projet qui te ressemblent. Tout commence par une rencontre.',
        'home.search.job': 'Métier, domaine, mot-clé',
        'home.search.city': 'Ville',
        'home.search.button': 'Rechercher',
        'home.popular': 'Populaire :',
        'home.tag.marketing': 'Marketing',
        'home.tag.it': 'Informatique',
        'home.tag.hr': 'Ressources humaines',
        'home.preview.kicker': 'Ton prochain chapitre',
        'home.preview.title': 'Une rencontre, mille possibles',
        'home.preview.card': 'La plateforme qui te rapproche de',
        'home.preview.future': 'ton projet d’avenir',
        'home.preview.talents': 'Talents',
        'home.preview.companies': 'Entreprises',
        'home.preview.training': 'Formations',
        'home.preview.caption':
            'Un seul espace pour faire avancer ton projet professionnel.',
        'home.step1.kicker': 'Étape 01',
        'home.step1.title': 'Tu précises ton projet',
        'home.step1.description':
            'Partage ton domaine, ta ville et la formation que tu recherches.',
        'home.step2.kicker': 'Étape 02',
        'home.step2.title': 'Tu rencontres les bons profils',
        'home.step2.description':
            'Découvre des entreprises et des formations adaptées à ton parcours.',
        'home.step3.kicker': 'Étape 03',
        'home.step3.title': 'Tu avances à ton rythme',
        'home.step3.description':
            'Garde tes opportunités et suis tes démarches depuis ton espace.',
        'home.offers.kicker': 'À découvrir',
        'home.offers.title': 'Les offres réelles',
        'home.offers.description':
            'Des offres réelles issues de sources officielles, actualisées régulièrement.',
        'home.offers.all': 'Toutes les offres',
        'home.recruiter.kicker': 'Vous recrutez ?',
        'home.recruiter.title': 'Rencontrez les talents de demain.',
        'home.recruiter.description':
            'Présentez votre entreprise et partagez vos opportunités en alternance.',
        'home.recruiter.button': 'Créer un compte recruteur',
        'home.training.kicker': 'Vous formez ?',
        'home.training.title': 'Faites connaître vos formations.',
        'home.training.description':
            'Aidez les candidats à trouver le programme qui correspond à leur projet.',
        'home.training.button': 'Créer un compte organisme',
        'home.partners.space': 'Accéder à mon espace',
        'home.footer.kicker':
            'Connecter les talents, les entreprises et les formations',
        'home.footer.title': 'Prêt·e à commencer ?',
        'home.footer.description':
            'Crée ton espace Alternance Connect en quelques instants.',
        'home.footer.create': 'Je crée mon compte',
        'home.footer.space': 'Ouvrir mon espace',
        'home.footer.login': 'Se connecter',
        'home.footer.spaceLink': 'Mon espace',
        'dashboard.title': 'Mon espace',
        'dashboard.greeting': 'Bonjour {name} !',
        'dashboard.intro':
            'Bienvenue sur Alternance Connect. Ici, tu pourras préparer ton profil et suivre tes prochaines démarches.',
        'dashboard.browse': 'Découvrir les offres',
        'dashboard.start.kicker': 'Pour bien commencer',
        'dashboard.start.title': 'Fais avancer ton projet',
        'dashboard.profile.title': 'Complète ton profil',
        'dashboard.profile.description':
            'Ajoute les informations qui aideront les entreprises à mieux te connaître.',
        'dashboard.profile.button': 'Modifier mon profil',
        'dashboard.explore.title': 'Explore les opportunités',
        'dashboard.explore.description':
            'Consulte les offres d’alternance disponibles et postule auprès des employeurs.',
        'dashboard.explore.button': 'Parcourir les offres',
        'dashboard.notice':
            'Les offres proviennent de sources officielles. Vérifie les détails et postule via le lien fourni par l’employeur.',
        'nav.dashboard': 'Tableau de bord',
        'nav.offers': 'Découvrir les offres',
        'nav.profile': 'Mon profil',
        'nav.group': 'Alternance Connect',
        'nav.settings': 'Paramètres',
        'nav.logout': 'Se déconnecter',
        'nav.admin_sources': 'Gestion des sources',
        'nav.admin_countries': 'Pays couverts',
        'nav.company': 'Espace entreprise',
        'nav.applications': 'Mes candidatures',
        'nav.admin_companies': 'Vérifier les entreprises',
        'offers.kicker': 'Alternance Connect',
        'offers.title': 'Offres d’alternance',
        'offers.description':
            'Consulte les offres publiées par les sources connectées et ouvre le lien officiel pour candidater.',
        'offers.search': 'Métier, entreprise ou mot-clé',
        'offers.searchPlaceholder': 'Ex. développeur web',
        'offers.city': 'Ville',
        'offers.country': 'Pays',
        'offers.region': 'Région',
        'offers.contract': 'Type de contrat',
        'offers.all': 'Tous',
        'offers.apprenticeship': 'Apprentissage',
        'offers.professionalization': 'Professionnalisation',
        'offers.education': 'Diplôme préparé',
        'offers.sector': 'Secteur',
        'offers.language': 'Langue requise',
        'offers.salaryFrom': 'Salaire minimum souhaité',
        'offers.salaryTo': 'Salaire maximum souhaité',
        'offers.currency': 'Devise',
        'offers.dualTraining': 'Formation professionnelle duale',
        'offers.source': 'Source',
        'offers.rome': 'Code métier ROME',
        'offers.publishedAfter': 'Publiée depuis le',
        'offers.filter': 'Rechercher',
        'offers.reset': 'Effacer les filtres',
        'offers.resultCount': '{count} offre(s)',
        'offers.showAll': 'Afficher toutes les offres',
        'offers.lastSynced': 'Dernière mise à jour',
        'offers.notSynced':
            'La source officielle n’a pas encore été synchronisée.',
        'offers.companyUnknown': 'Entreprise non précisée',
        'offers.published': 'Publiée le',
        'offers.apply': 'Voir l’offre et postuler',
        'offers.viewAndApply': 'Voir l’annonce et postuler',
        'offers.applyOnPlatform': 'Postuler sur Alternance Connect',
        'offers.officialWidgetTitle': 'Toutes les offres officielles',
        'offers.officialWidgetDescription':
            'Les annonces en alternance sont chargées directement depuis La Bonne Alternance. Recherche par métier ou lieu, ouvre une annonce, puis utilise son bouton de candidature quand il est proposé.',
        'offers.officialSite': 'Ouvrir le site officiel',
        'offers.applicationMissing':
            'Lien de candidature non fourni par la source',
        'offers.empty.title': 'Aucune offre disponible',
        'offers.empty.description':
            'Aucune annonce réelle n’est disponible pour ces critères. Les offres apparaîtront après la configuration et la synchronisation de la source officielle.',
        'offers.pagination': 'Pages des offres',
        'offers.previous': 'Précédent',
        'offers.next': 'Suivant',
        'admin.sources.title': 'Sources des offres',
        'admin.countries.title': 'Pays européens',
        'admin.countries.back': 'Gestion des sources',
        'admin.countries.description':
            'Choisis les pays à proposer dans les filtres de recherche et consulte leur niveau réel de couverture.',
        'admin.countries.noticeTitle': 'À savoir :',
        'admin.countries.notice':
            'activer un pays le rend disponible dans les filtres. Cela ne connecte pas une source et ne crée pas d’offres. À ce jour, seule la France dispose d’un connecteur préparé, qui nécessite encore une clé API autorisée.',
        'admin.countries.eu': 'Union européenne',
        'admin.countries.offers': '{count} offre(s) enregistrée(s)',
        'admin.countries.enable': 'Afficher dans les filtres',
        'admin.countries.disable': 'Retirer des filtres',
        'admin.countries.coverage.configured': 'Connecteur configuré',
        'admin.countries.coverage.needs_setup': 'Clé API requise',
        'admin.countries.coverage.no_source': 'Aucune source connectée',
        'company.title': 'Espace entreprise',
        'company.description':
            'Vérifie ton entreprise, publie des offres et suis les candidatures reçues.',
        'company.profile.title': 'Créer la fiche entreprise',
        'company.profile.description':
            'Les informations légales sont vérifiées manuellement avant toute publication.',
        'company.field.name': 'Nom de l’entreprise',
        'company.field.registration': 'Numéro d’immatriculation',
        'company.field.country': 'Pays',
        'company.field.city': 'Ville',
        'company.field.website': 'Site web',
        'company.field.email': 'E-mail de contact',
        'company.profile.submit': 'Envoyer pour vérification',
        'company.privacy':
            'J’autorise le traitement de ces informations pour vérifier l’entreprise et gérer ses offres.',
        'company.status.pending': 'Vérification en attente',
        'company.status.verified': 'Entreprise vérifiée',
        'company.status.rejected': 'Vérification refusée',
        'company.status.note': 'Motif : {note}',
        'company.notice.pending':
            'L’équipe vérifie les informations de l’entreprise. Tu pourras publier après validation.',
        'company.notice.verified':
            'Ton entreprise est vérifiée. Chaque nouvelle offre est relue avant sa publication.',
        'company.offers.title': 'Mes offres',
        'company.offer.form': 'Proposer une offre',
        'company.offer.title': 'Intitulé du poste',
        'company.offer.description':
            'Description du poste et de la formation (40 caractères minimum)',
        'company.offer.sector': 'Secteur',
        'company.offer.training': 'Formation préparée',
        'company.offer.contract': 'Type de formation en alternance',
        'company.offer.contract.apprenticeship': 'Apprentissage',
        'company.offer.contract.professionalization': 'Professionnalisation',
        'company.offer.contract.dual': 'Formation professionnelle duale',
        'company.offer.education': 'Niveau d’études',
        'company.offer.salaryMin': 'Salaire minimum',
        'company.offer.salaryMax': 'Salaire maximum',
        'company.offer.currency': 'Devise (code ISO)',
        'company.offer.duration': 'Durée (mois)',
        'company.offer.languages':
            'Langues requises (séparées par des virgules)',
        'company.offer.submit': 'Envoyer à la modération',
        'company.offer.state.pending': 'En attente de validation',
        'company.offer.state.approved': 'Publiée',
        'company.offer.state.rejected': 'Refusée',
        'company.offer.state.unavailable': 'Désactivée',
        'company.offer.disable': 'Désactiver l’offre',
        'company.applications.title': 'Candidatures reçues',
        'company.application.status.received': 'Reçue',
        'company.application.status.reviewing': 'En cours d’étude',
        'company.application.status.interview': 'Entretien proposé',
        'company.application.status.accepted': 'Retenue',
        'company.application.status.rejected': 'Refusée',
        'company.application.update': 'Mettre à jour le statut',
        'company.application.privacy':
            'Les coordonnées et la lettre sont visibles uniquement par l’entreprise concernée.',
        'applications.title': 'Mes candidatures',
        'applications.description':
            'Consulte les réponses et supprime une candidature si tu souhaites retirer tes données.',
        'applications.empty':
            'Tu n’as pas encore postulé à une offre publiée sur Alternance Connect.',
        'applications.apply.title': 'Postuler à cette offre',
        'applications.apply.description':
            'Ta lettre sera transmise à l’entreprise, avec ton nom et ton adresse e-mail de compte.',
        'applications.apply.letter': 'Lettre de motivation',
        'applications.apply.submit': 'Envoyer ma candidature',
        'applications.privacy':
            'J’accepte de transmettre mon nom, mon e-mail et ma lettre à cette entreprise pour traiter ma candidature.',
        'applications.applied':
            'Tu as déjà envoyé une candidature pour cette offre.',
        'applications.withdraw': 'Supprimer ma candidature',
        'admin.companyReview.title':
            'Vérification des entreprises et des offres',
        'admin.companyReview.description':
            'Vérifie les informations légales, puis examine les offres envoyées par les entreprises.',
        'admin.companyReview.companies': 'Entreprises à vérifier',
        'admin.companyReview.offers': 'Offres à modérer',
        'admin.companyReview.verify': 'Marquer comme vérifiée',
        'admin.companyReview.reject': 'Refuser',
        'admin.companyReview.reason': 'Motif de refus (obligatoire)',
        'admin.companyReview.approveOffer': 'Approuver et publier',
        'admin.companyReview.rejectOffer': 'Refuser l’offre',
        'admin.companyReview.companyNeeded':
            'Vérifie l’entreprise avant d’approuver cette offre.',
        'admin.companyReview.emptyCompanies': 'Aucune entreprise à vérifier.',
        'admin.companyReview.emptyOffers':
            'Aucune offre en attente de modération.',
        'admin.sources.description':
            'Configure et surveille l’import automatique des offres d’alternance officielles.',
        'admin.sources.noticeTitle': 'Configuration requise :',
        'admin.sources.notice':
            'ajoute la clé API LBA dans le fichier .env et confirme que l’usage est non lucratif. L’accès direct France Travail reste bloqué sans autorisation écrite.',
        'admin.sources.lbaSetupTitle': 'Activer les offres réelles',
        'admin.sources.lbaSetupIntro':
            'Aucune offre ne peut être importée tant que la connexion officielle n’est pas configurée. Suis ces étapes :',
        'admin.sources.lbaSetupCreateKey':
            'Créer une clé API La Bonne Alternance',
        'admin.sources.lbaSetupAddKey':
            'Dans le fichier .env du projet, ajoute ces deux lignes. Remplace « votre_cle » par la clé reçue :',
        'admin.sources.lbaSetupConfirmUse':
            'Confirme que ton utilisation est non lucrative, comme l’exige cette API.',
        'admin.sources.lbaSetupFinish':
            'Redémarre l’application, actualise cette page, puis clique sur « Synchroniser maintenant ». Si la connexion reste indiquée comme non configurée, exécute php artisan config:clear dans le dossier du projet.',
        'admin.sources.available': 'Connexion configurée',
        'admin.sources.unavailable': 'Connexion non configurée',
        'admin.sources.enabled': 'Activée',
        'admin.sources.disabled': 'Désactivée',
        'admin.sources.offers': 'Offres enregistrées',
        'admin.sources.lastSync': 'Dernière synchronisation',
        'admin.sources.never': 'Jamais',
        'admin.sources.enable': 'Activer',
        'admin.sources.disable': 'Désactiver',
        'admin.sources.syncNow': 'Synchroniser maintenant',
        'admin.sources.history': 'Historique des synchronisations',
        'admin.sources.date': 'Date',
        'admin.sources.runStatus': 'État',
        'admin.sources.imported': 'Offres reçues',
        'admin.sources.expired': 'Expirées',
        'admin.sources.noRuns': 'Aucune synchronisation effectuée.',
        'admin.sources.status.running': 'En cours',
        'admin.sources.status.succeeded': 'Terminée',
        'admin.sources.status.failed': 'Échec',
        'auth.login.title': 'Ravi·e de te revoir',
        'auth.login.description':
            'Connecte-toi pour retrouver ton espace Alternance Connect.',
        'auth.email': 'Adresse e-mail',
        'auth.email.placeholder': 'email@exemple.fr',
        'auth.password': 'Mot de passe',
        'auth.password.placeholder': 'Ton mot de passe',
        'auth.password.forgot': 'Mot de passe oublié ?',
        'auth.remember': 'Rester connecté·e',
        'auth.login.submit': 'Se connecter',
        'auth.login.noAccount': 'Pas encore de compte ?',
        'auth.register.link': 'Créer un compte',
        'auth.register.title': 'Rejoins Alternance Connect',
        'auth.register.description':
            'Crée ton espace pour faire avancer ton projet professionnel.',
        'auth.name': 'Nom complet',
        'auth.name.placeholder': 'Ex. Camille Martin',
        'auth.password.choose': 'Choisis un mot de passe',
        'auth.password.confirm': 'Confirmer le mot de passe',
        'auth.password.repeat': 'Saisis-le une seconde fois',
        'auth.register.submit': 'Créer mon compte',
        'auth.register.hasAccount': 'Tu as déjà un compte ?',
        'auth.login.link': 'Se connecter',
        'auth.verify.title': 'Confirme ton adresse e-mail',
        'auth.verify.pageTitle': 'Confirmation de l’adresse e-mail',
        'auth.verify.layoutDescription':
            'Encore une étape pour finaliser la création de ton compte.',
        'auth.verify.description':
            'Cette page apparaît après la création d’un compte. Pour cette version locale, tu peux continuer à explorer la plateforme sans confirmer ton adresse.',
        'auth.verify.continue': 'Continuer vers Alternance Connect',
        'auth.verify.resend': 'Renvoyer le lien de confirmation',
        'auth.verify.logout': 'Se déconnecter',
        'auth.verify.sent': 'Un nouveau lien de confirmation a été demandé.',
        'auth.forgot.title': 'Mot de passe oublié ?',
        'auth.forgot.description':
            'Entre ton e-mail pour recevoir un lien de réinitialisation.',
        'auth.forgot.send': 'Envoyer le lien de réinitialisation',
        'auth.forgot.return': 'Ou revenir à',
        'auth.forgot.login': 'la connexion',
        'auth.reset.title': 'Réinitialiser le mot de passe',
        'auth.reset.description': 'Saisis ton nouveau mot de passe ci-dessous.',
        'auth.reset.submit': 'Réinitialiser le mot de passe',
        'auth.confirm.title': 'Confirmer le mot de passe',
        'auth.confirm.description':
            'Confirme ton mot de passe avant de continuer.',
        'auth.confirm.submit': 'Confirmer le mot de passe',
        'auth.confirm.passkey': 'Confirmer avec une clé d’accès',
        'auth.confirm.passkeyLoading': 'Confirmation en cours…',
        'auth.confirm.orPassword': 'Ou confirmer avec un mot de passe',
        'settings.title': 'Paramètres',
        'settings.description':
            'Gère ton profil et les réglages de ton compte.',
        'settings.profile': 'Profil',
        'settings.security': 'Sécurité',
        'settings.appearance': 'Apparence',
        'profile.title': 'Profil',
        'profile.description': 'Modifie ton nom et ton adresse e-mail.',
        'profile.name': 'Nom',
        'profile.email': 'Adresse e-mail',
        'profile.save': 'Enregistrer',
        'profile.email.unverified':
            'Ton adresse e-mail n’est pas encore vérifiée.',
        'profile.email.resend':
            'Clique ici pour renvoyer le message de confirmation.',
        'profile.email.sent':
            'Un nouveau lien de confirmation a été envoyé à ton adresse e-mail.',
    },
    en: {
        'language.label': 'Site language',
        'home.brand.alt': 'Alternance Connect, find an apprenticeship',
        'home.title': 'Find an apprenticeship that fits you',
        'home.nav.offers': 'Open roles',
        'home.nav.how': 'How it works',
        'home.nav.partners': 'Employers & schools',
        'home.nav.login': 'Sign in',
        'home.nav.register': 'Create an account',
        'home.nav.space': 'My space',
        'home.hero.badge': 'Your future starts here',
        'home.hero.titleStart': 'The right apprenticeship can',
        'home.hero.titleEnd': 'change everything.',
        'home.hero.description':
            'Find a company, a training programme and a project that fit you. Every journey starts with a meeting.',
        'home.search.job': 'Role, field or keyword',
        'home.search.city': 'City',
        'home.search.button': 'Search',
        'home.popular': 'Popular:',
        'home.tag.marketing': 'Marketing',
        'home.tag.it': 'Technology',
        'home.tag.hr': 'Human resources',
        'home.preview.kicker': 'Your next chapter',
        'home.preview.title': 'One connection, new possibilities',
        'home.preview.card': 'The platform that brings you closer to',
        'home.preview.future': 'your future plans',
        'home.preview.talents': 'Talents',
        'home.preview.companies': 'Employers',
        'home.preview.training': 'Training',
        'home.preview.caption': 'One place to move your career plans forward.',
        'home.step1.kicker': 'Step 01',
        'home.step1.title': 'Tell us what you want',
        'home.step1.description':
            'Share your field, location and the training you are looking for.',
        'home.step2.kicker': 'Step 02',
        'home.step2.title': 'Meet the right people',
        'home.step2.description':
            'Discover employers and training programmes that fit your path.',
        'home.step3.kicker': 'Step 03',
        'home.step3.title': 'Move forward at your pace',
        'home.step3.description':
            'Save opportunities and follow your applications from your account.',
        'home.offers.kicker': 'Explore',
        'home.offers.title': 'Real opportunities',
        'home.offers.description':
            'Real offers from official sources, refreshed regularly.',
        'home.offers.all': 'All opportunities',
        'home.recruiter.kicker': 'Hiring?',
        'home.recruiter.title': 'Meet the talent of tomorrow.',
        'home.recruiter.description':
            'Introduce your company and share your apprenticeship opportunities.',
        'home.recruiter.button': 'Create an employer account',
        'home.training.kicker': 'Offer training?',
        'home.training.title': 'Showcase your programmes.',
        'home.training.description':
            'Help candidates find the programme that fits their plans.',
        'home.training.button': 'Create a training-provider account',
        'home.partners.space': 'Go to my space',
        'home.footer.kicker': 'Connecting talent, employers and training',
        'home.footer.title': 'Ready to get started?',
        'home.footer.description':
            'Create your Alternance Connect space in just a few moments.',
        'home.footer.create': 'Create my account',
        'home.footer.space': 'Open my space',
        'home.footer.login': 'Sign in',
        'home.footer.spaceLink': 'My space',
        'dashboard.title': 'My space',
        'dashboard.greeting': 'Hello, {name}!',
        'dashboard.intro':
            'Welcome to Alternance Connect. Prepare your profile and keep track of your next steps here.',
        'dashboard.browse': 'Explore opportunities',
        'dashboard.start.kicker': 'Getting started',
        'dashboard.start.title': 'Move your plans forward',
        'dashboard.profile.title': 'Complete your profile',
        'dashboard.profile.description':
            'Add information that helps employers get to know you.',
        'dashboard.profile.button': 'Edit my profile',
        'dashboard.explore.title': 'Explore opportunities',
        'dashboard.explore.description':
            'View available apprenticeship offers and apply through the employer.',
        'dashboard.explore.button': 'Browse opportunities',
        'dashboard.notice':
            'Offers come from official sources. Review the details and apply using the link provided by the employer.',
        'nav.dashboard': 'Dashboard',
        'nav.offers': 'Explore opportunities',
        'nav.profile': 'My profile',
        'nav.group': 'Alternance Connect',
        'nav.settings': 'Settings',
        'nav.logout': 'Sign out',
        'nav.admin_sources': 'Source management',
        'nav.admin_countries': 'Country coverage',
        'nav.company': 'Company workspace',
        'nav.applications': 'My applications',
        'nav.admin_companies': 'Review companies',
        'offers.kicker': 'Alternance Connect',
        'offers.title': 'Apprenticeship offers',
        'offers.description':
            'Browse offers published by connected sources and use the official link to apply.',
        'offers.search': 'Job, employer or keyword',
        'offers.searchPlaceholder': 'e.g. web developer',
        'offers.city': 'City',
        'offers.country': 'Country',
        'offers.region': 'Region',
        'offers.contract': 'Contract type',
        'offers.all': 'All',
        'offers.apprenticeship': 'Apprenticeship',
        'offers.professionalization': 'Professional training contract',
        'offers.education': 'Target qualification',
        'offers.sector': 'Sector',
        'offers.language': 'Required language',
        'offers.salaryFrom': 'Minimum salary wanted',
        'offers.salaryTo': 'Maximum salary wanted',
        'offers.currency': 'Currency',
        'offers.dualTraining': 'Dual vocational training',
        'offers.source': 'Source',
        'offers.rome': 'ROME job code',
        'offers.publishedAfter': 'Published since',
        'offers.filter': 'Search',
        'offers.reset': 'Clear filters',
        'offers.resultCount': '{count} offer(s)',
        'offers.showAll': 'Show all offers',
        'offers.lastSynced': 'Last updated',
        'offers.notSynced':
            'The official source has not been synchronized yet.',
        'offers.companyUnknown': 'Employer not specified',
        'offers.published': 'Published',
        'offers.apply': 'View offer and apply',
        'offers.viewAndApply': 'View listing and apply',
        'offers.applyOnPlatform': 'Apply on Alternance Connect',
        'offers.officialWidgetTitle': 'All official offers',
        'offers.officialWidgetDescription':
            'Apprenticeship listings load directly from La Bonne Alternance. Search by role or location, open a listing, then use its application button when available.',
        'offers.officialSite': 'Open official site',
        'offers.applicationMissing':
            'Application link not provided by the source',
        'offers.empty.title': 'No offers available',
        'offers.empty.description':
            'No real offers match these filters. Offers will appear after the official source is configured and synchronized.',
        'offers.pagination': 'Offer pages',
        'offers.previous': 'Previous',
        'offers.next': 'Next',
        'admin.sources.title': 'Offer sources',
        'admin.countries.title': 'European countries',
        'admin.countries.back': 'Source management',
        'admin.countries.description':
            'Choose which countries appear in search filters and review their actual coverage status.',
        'admin.countries.noticeTitle': 'Please note:',
        'admin.countries.notice':
            'enabling a country makes it available in filters. It does not connect a source or create offers. France is currently the only country with a prepared connector, and it still requires an authorized API key.',
        'admin.countries.eu': 'European Union',
        'admin.countries.offers': '{count} saved offer(s)',
        'admin.countries.enable': 'Show in filters',
        'admin.countries.disable': 'Remove from filters',
        'admin.countries.coverage.configured': 'Connector configured',
        'admin.countries.coverage.needs_setup': 'API key required',
        'admin.countries.coverage.no_source': 'No connected source',
        'company.title': 'Company workspace',
        'company.description':
            'Verify your company, publish offers and track incoming applications.',
        'company.profile.title': 'Create a company profile',
        'company.profile.description':
            'Legal details are reviewed manually before offers can be published.',
        'company.field.name': 'Company name',
        'company.field.registration': 'Business registration number',
        'company.field.country': 'Country',
        'company.field.city': 'City',
        'company.field.website': 'Website',
        'company.field.email': 'Contact email',
        'company.profile.submit': 'Submit for review',
        'company.privacy':
            'I authorize the use of these details to verify the company and manage its offers.',
        'company.status.pending': 'Verification pending',
        'company.status.verified': 'Company verified',
        'company.status.rejected': 'Verification rejected',
        'company.status.note': 'Reason: {note}',
        'company.notice.pending':
            'The team is reviewing your company details. You can publish after approval.',
        'company.notice.verified':
            'Your company is verified. Each new offer is reviewed before publication.',
        'company.offers.title': 'My offers',
        'company.offer.form': 'Submit an offer',
        'company.offer.title': 'Job title',
        'company.offer.description':
            'Describe the role and training (at least 40 characters)',
        'company.offer.sector': 'Sector',
        'company.offer.training': 'Training programme',
        'company.offer.contract': 'Apprenticeship type',
        'company.offer.contract.apprenticeship': 'Apprenticeship',
        'company.offer.contract.professionalization':
            'Professionalization contract',
        'company.offer.contract.dual': 'Dual vocational training',
        'company.offer.education': 'Education level',
        'company.offer.salaryMin': 'Minimum salary',
        'company.offer.salaryMax': 'Maximum salary',
        'company.offer.currency': 'Currency (ISO code)',
        'company.offer.duration': 'Duration (months)',
        'company.offer.languages': 'Required languages (comma-separated)',
        'company.offer.submit': 'Send for moderation',
        'company.offer.state.pending': 'Awaiting review',
        'company.offer.state.approved': 'Published',
        'company.offer.state.rejected': 'Rejected',
        'company.offer.state.unavailable': 'Disabled',
        'company.offer.disable': 'Disable offer',
        'company.applications.title': 'Applications received',
        'company.application.status.received': 'Received',
        'company.application.status.reviewing': 'Under review',
        'company.application.status.interview': 'Interview offered',
        'company.application.status.accepted': 'Accepted',
        'company.application.status.rejected': 'Rejected',
        'company.application.update': 'Update status',
        'company.application.privacy':
            'Contact details and letter are visible only to the relevant company.',
        'applications.title': 'My applications',
        'applications.description':
            'Review responses and delete an application if you want to remove your data.',
        'applications.empty':
            'You have not applied to an offer published on Alternance Connect yet.',
        'applications.apply.title': 'Apply for this offer',
        'applications.apply.description':
            'Your letter will be sent to the company with your account name and email address.',
        'applications.apply.letter': 'Cover letter',
        'applications.apply.submit': 'Send my application',
        'applications.privacy':
            'I agree to share my name, email and letter with this company to process my application.',
        'applications.applied': 'You have already applied for this offer.',
        'applications.withdraw': 'Delete my application',
        'admin.companyReview.title': 'Company and offer review',
        'admin.companyReview.description':
            'Check legal details, then review offers submitted by companies.',
        'admin.companyReview.companies': 'Companies to verify',
        'admin.companyReview.offers': 'Offers to review',
        'admin.companyReview.verify': 'Mark as verified',
        'admin.companyReview.reject': 'Reject',
        'admin.companyReview.reason': 'Reason for rejection (required)',
        'admin.companyReview.approveOffer': 'Approve and publish',
        'admin.companyReview.rejectOffer': 'Reject offer',
        'admin.companyReview.companyNeeded':
            'Verify the company before approving this offer.',
        'admin.companyReview.emptyCompanies': 'No companies need verification.',
        'admin.companyReview.emptyOffers': 'No offers are waiting for review.',
        'admin.sources.description':
            'Configure and monitor imports from official apprenticeship sources.',
        'admin.sources.noticeTitle': 'Setup required:',
        'admin.sources.notice':
            'add the LBA API key to .env and confirm non-profit use. Direct France Travail access remains disabled until written authorization is granted.',
        'admin.sources.lbaSetupTitle': 'Enable real offers',
        'admin.sources.lbaSetupIntro':
            'No offers can be imported until the official connection is configured. Follow these steps:',
        'admin.sources.lbaSetupCreateKey':
            'Create a La Bonne Alternance API key',
        'admin.sources.lbaSetupAddKey':
            'Add these two lines to the project .env file. Replace “votre_cle” with your API key:',
        'admin.sources.lbaSetupConfirmUse':
            'Confirm that your use is non-profit, as required by this API.',
        'admin.sources.lbaSetupFinish':
            'Restart the app, refresh this page, then click “Synchronize now”. If the connection still appears unconfigured, run php artisan config:clear from the project folder.',
        'admin.sources.available': 'Connection configured',
        'admin.sources.unavailable': 'Connection not configured',
        'admin.sources.enabled': 'Enabled',
        'admin.sources.disabled': 'Disabled',
        'admin.sources.offers': 'Saved offers',
        'admin.sources.lastSync': 'Last synchronization',
        'admin.sources.never': 'Never',
        'admin.sources.enable': 'Enable',
        'admin.sources.disable': 'Disable',
        'admin.sources.syncNow': 'Synchronize now',
        'admin.sources.history': 'Synchronization history',
        'admin.sources.date': 'Date',
        'admin.sources.runStatus': 'Status',
        'admin.sources.imported': 'Offers received',
        'admin.sources.expired': 'Expired',
        'admin.sources.noRuns': 'No synchronization has run yet.',
        'admin.sources.status.running': 'Running',
        'admin.sources.status.succeeded': 'Completed',
        'admin.sources.status.failed': 'Failed',
        'auth.login.title': 'Welcome back',
        'auth.login.description':
            'Sign in to return to your Alternance Connect space.',
        'auth.email': 'Email address',
        'auth.email.placeholder': 'name@example.com',
        'auth.password': 'Password',
        'auth.password.placeholder': 'Your password',
        'auth.password.forgot': 'Forgot your password?',
        'auth.remember': 'Keep me signed in',
        'auth.login.submit': 'Sign in',
        'auth.login.noAccount': 'New to Alternance Connect?',
        'auth.register.link': 'Create an account',
        'auth.register.title': 'Join Alternance Connect',
        'auth.register.description':
            'Create your space and move your career plans forward.',
        'auth.name': 'Full name',
        'auth.name.placeholder': 'e.g. Camille Martin',
        'auth.password.choose': 'Choose a password',
        'auth.password.confirm': 'Confirm your password',
        'auth.password.repeat': 'Enter it one more time',
        'auth.register.submit': 'Create my account',
        'auth.register.hasAccount': 'Already have an account?',
        'auth.login.link': 'Sign in',
        'auth.verify.title': 'Confirm your email address',
        'auth.verify.pageTitle': 'Email confirmation',
        'auth.verify.layoutDescription':
            'One more step to finish setting up your account.',
        'auth.verify.description':
            'This page appears after creating an account. In this local version, you can explore the platform without confirming your address.',
        'auth.verify.continue': 'Continue to Alternance Connect',
        'auth.verify.resend': 'Resend confirmation link',
        'auth.verify.logout': 'Sign out',
        'auth.verify.sent': 'A new confirmation link has been requested.',
        'auth.forgot.title': 'Forgot password?',
        'auth.forgot.description':
            'Enter your email to receive a password reset link.',
        'auth.forgot.send': 'Send password reset link',
        'auth.forgot.return': 'Or return to',
        'auth.forgot.login': 'sign in',
        'auth.reset.title': 'Reset password',
        'auth.reset.description': 'Please enter your new password below.',
        'auth.reset.submit': 'Reset password',
        'auth.confirm.title': 'Confirm password',
        'auth.confirm.description':
            'Please confirm your password before continuing.',
        'auth.confirm.submit': 'Confirm password',
        'auth.confirm.passkey': 'Confirm with passkey',
        'auth.confirm.passkeyLoading': 'Confirming…',
        'auth.confirm.orPassword': 'Or confirm with password',
        'settings.title': 'Settings',
        'settings.description': 'Manage your profile and account settings.',
        'settings.profile': 'Profile',
        'settings.security': 'Security',
        'settings.appearance': 'Appearance',
        'profile.title': 'Profile',
        'profile.description': 'Update your name and email address.',
        'profile.name': 'Name',
        'profile.email': 'Email address',
        'profile.save': 'Save',
        'profile.email.unverified': 'Your email address is not verified yet.',
        'profile.email.resend': 'Click here to resend the confirmation email.',
        'profile.email.sent':
            'A new confirmation link was sent to your email address.',
    },
    de: {
        'language.label': 'Seitensprache',
        'home.brand.alt': 'Alternance Connect, finde eine Ausbildung',
        'home.title': 'Finde die Ausbildung, die zu dir passt',
        'home.nav.offers': 'Stellenangebote',
        'home.nav.how': 'So funktioniert es',
        'home.nav.partners': 'Unternehmen & Schulen',
        'home.nav.login': 'Anmelden',
        'home.nav.register': 'Konto erstellen',
        'home.nav.space': 'Mein Bereich',
        'home.hero.badge': 'Deine Zukunft beginnt hier',
        'home.hero.titleStart': 'Die passende Ausbildung kann',
        'home.hero.titleEnd': 'alles verändern.',
        'home.hero.description':
            'Finde ein Unternehmen, eine Ausbildung und ein Projekt, das zu dir passt. Alles beginnt mit einer Begegnung.',
        'home.search.job': 'Beruf, Bereich oder Stichwort',
        'home.search.city': 'Stadt',
        'home.search.button': 'Suchen',
        'home.popular': 'Beliebt:',
        'home.tag.marketing': 'Marketing',
        'home.tag.it': 'Informatik',
        'home.tag.hr': 'Personalwesen',
        'home.preview.kicker': 'Dein nächstes Kapitel',
        'home.preview.title': 'Eine Begegnung, viele Möglichkeiten',
        'home.preview.card': 'Die Plattform, die dich deinem Ziel näherbringt:',
        'home.preview.future': 'deine berufliche Zukunft',
        'home.preview.talents': 'Talente',
        'home.preview.companies': 'Unternehmen',
        'home.preview.training': 'Ausbildungen',
        'home.preview.caption':
            'Ein Ort, an dem du deine beruflichen Pläne voranbringst.',
        'home.step1.kicker': 'Schritt 01',
        'home.step1.title': 'Beschreibe dein Vorhaben',
        'home.step1.description':
            'Teile uns deinen Bereich, deinen Wohnort und deine gewünschte Ausbildung mit.',
        'home.step2.kicker': 'Schritt 02',
        'home.step2.title': 'Lerne passende Partner kennen',
        'home.step2.description':
            'Entdecke Unternehmen und Ausbildungen, die zu deinem Weg passen.',
        'home.step3.kicker': 'Schritt 03',
        'home.step3.title': 'Geh deinen eigenen Weg',
        'home.step3.description':
            'Speichere Angebote und verfolge deine Bewerbungen in deinem Bereich.',
        'home.offers.kicker': 'Entdecken',
        'home.offers.title': 'Echte Angebote',
        'home.offers.description':
            'Echte Stellenangebote aus offiziellen Quellen, die regelmäßig aktualisiert werden.',
        'home.offers.all': 'Alle Angebote',
        'home.recruiter.kicker': 'Sie suchen Mitarbeitende?',
        'home.recruiter.title': 'Lernen Sie die Talente von morgen kennen.',
        'home.recruiter.description':
            'Stellen Sie Ihr Unternehmen vor und veröffentlichen Sie Ausbildungsangebote.',
        'home.recruiter.button': 'Unternehmenskonto erstellen',
        'home.training.kicker': 'Sie bieten Ausbildungen an?',
        'home.training.title': 'Machen Sie Ihre Ausbildung bekannt.',
        'home.training.description':
            'Helfen Sie Bewerber:innen, das passende Programm zu finden.',
        'home.training.button': 'Konto als Bildungseinrichtung erstellen',
        'home.partners.space': 'Zu meinem Bereich',
        'home.footer.kicker': 'Talente, Unternehmen und Ausbildungen verbinden',
        'home.footer.title': 'Bereit loszulegen?',
        'home.footer.description':
            'Erstelle in wenigen Augenblicken deinen Alternance-Connect-Bereich.',
        'home.footer.create': 'Konto erstellen',
        'home.footer.space': 'Meinen Bereich öffnen',
        'home.footer.login': 'Anmelden',
        'home.footer.spaceLink': 'Mein Bereich',
        'dashboard.title': 'Mein Bereich',
        'dashboard.greeting': 'Hallo, {name}!',
        'dashboard.intro':
            'Willkommen bei Alternance Connect. Hier kannst du dein Profil vorbereiten und deine nächsten Schritte verfolgen.',
        'dashboard.browse': 'Angebote entdecken',
        'dashboard.start.kicker': 'Erste Schritte',
        'dashboard.start.title': 'Bring deine Pläne voran',
        'dashboard.profile.title': 'Vervollständige dein Profil',
        'dashboard.profile.description':
            'Ergänze Informationen, damit Unternehmen dich besser kennenlernen.',
        'dashboard.profile.button': 'Profil bearbeiten',
        'dashboard.explore.title': 'Entdecke neue Chancen',
        'dashboard.explore.description':
            'Finde verfügbare Ausbildungsangebote und bewirb dich beim Arbeitgeber.',
        'dashboard.explore.button': 'Angebote ansehen',
        'dashboard.notice':
            'Die Angebote stammen aus offiziellen Quellen. Prüfe die Angaben und bewirb dich über den Arbeitgeberlink.',
        'nav.dashboard': 'Übersicht',
        'nav.offers': 'Angebote entdecken',
        'nav.profile': 'Mein Profil',
        'nav.group': 'Alternance Connect',
        'nav.settings': 'Einstellungen',
        'nav.logout': 'Abmelden',
        'nav.admin_sources': 'Quellenverwaltung',
        'nav.admin_countries': 'Länderabdeckung',
        'nav.company': 'Unternehmensbereich',
        'nav.applications': 'Meine Bewerbungen',
        'nav.admin_companies': 'Unternehmen prüfen',
        'offers.kicker': 'Alternance Connect',
        'offers.title': 'Ausbildungsangebote',
        'offers.description':
            'Durchsuche Angebote verbundener Quellen und nutze den offiziellen Link für deine Bewerbung.',
        'offers.search': 'Beruf, Unternehmen oder Stichwort',
        'offers.searchPlaceholder': 'z. B. Webentwickler',
        'offers.city': 'Stadt',
        'offers.country': 'Land',
        'offers.region': 'Region',
        'offers.contract': 'Vertragsart',
        'offers.all': 'Alle',
        'offers.apprenticeship': 'Ausbildung',
        'offers.professionalization': 'Professionalisierungsvertrag',
        'offers.education': 'Abschluss',
        'offers.sector': 'Branche',
        'offers.language': 'Erforderliche Sprache',
        'offers.salaryFrom': 'Gewünschtes Mindestgehalt',
        'offers.salaryTo': 'Gewünschtes Höchstgehalt',
        'offers.currency': 'Währung',
        'offers.dualTraining': 'Duale Berufsausbildung',
        'offers.source': 'Quelle',
        'offers.rome': 'ROME-Berufscode',
        'offers.publishedAfter': 'Veröffentlicht seit',
        'offers.filter': 'Suchen',
        'offers.reset': 'Filter löschen',
        'offers.resultCount': '{count} Angebot(e)',
        'offers.showAll': 'Alle Angebote anzeigen',
        'offers.lastSynced': 'Zuletzt aktualisiert',
        'offers.notSynced':
            'Die offizielle Quelle wurde noch nicht synchronisiert.',
        'offers.companyUnknown': 'Unternehmen nicht angegeben',
        'offers.published': 'Veröffentlicht',
        'offers.apply': 'Angebot ansehen und bewerben',
        'offers.viewAndApply': 'Anzeige ansehen und bewerben',
        'offers.applyOnPlatform': 'Über Alternance Connect bewerben',
        'offers.officialWidgetTitle': 'Alle offiziellen Angebote',
        'offers.officialWidgetDescription':
            'Ausbildungsangebote werden direkt von La Bonne Alternance geladen. Suche nach Beruf oder Ort, öffne eine Anzeige und nutze den Bewerbungsbutton, sofern er verfügbar ist.',
        'offers.officialSite': 'Offizielle Website öffnen',
        'offers.applicationMissing':
            'Kein Bewerbungslink von der Quelle angegeben',
        'offers.empty.title': 'Keine Angebote verfügbar',
        'offers.empty.description':
            'Für diese Filter gibt es keine echten Angebote. Angebote erscheinen, sobald die offizielle Quelle eingerichtet und synchronisiert wurde.',
        'offers.pagination': 'Angebotsseiten',
        'offers.previous': 'Zurück',
        'offers.next': 'Weiter',
        'admin.sources.title': 'Angebotsquellen',
        'admin.countries.title': 'Europäische Länder',
        'admin.countries.back': 'Quellenverwaltung',
        'admin.countries.description':
            'Lege fest, welche Länder in den Suchfiltern erscheinen, und sieh ihren tatsächlichen Abdeckungsstatus.',
        'admin.countries.noticeTitle': 'Hinweis:',
        'admin.countries.notice':
            'Ein aktiviertes Land erscheint in den Filtern. Dadurch wird keine Quelle verbunden und es werden keine Angebote erstellt. Derzeit ist nur für Frankreich ein Konnektor vorbereitet; dafür ist weiterhin ein gültiger API-Schlüssel erforderlich.',
        'admin.countries.eu': 'Europäische Union',
        'admin.countries.offers': '{count} gespeicherte(s) Angebot(e)',
        'admin.countries.enable': 'In Filtern anzeigen',
        'admin.countries.disable': 'Aus Filtern entfernen',
        'admin.countries.coverage.configured': 'Konnektor konfiguriert',
        'admin.countries.coverage.needs_setup': 'API-Schlüssel erforderlich',
        'admin.countries.coverage.no_source': 'Keine Quelle verbunden',
        'company.title': 'Unternehmensbereich',
        'company.description':
            'Verifiziere dein Unternehmen, veröffentliche Angebote und verwalte eingehende Bewerbungen.',
        'company.profile.title': 'Unternehmensprofil erstellen',
        'company.profile.description':
            'Die rechtlichen Angaben werden vor einer Veröffentlichung manuell geprüft.',
        'company.field.name': 'Unternehmensname',
        'company.field.registration': 'Handelsregisternummer',
        'company.field.country': 'Land',
        'company.field.city': 'Stadt',
        'company.field.website': 'Website',
        'company.field.email': 'Kontakt-E-Mail',
        'company.profile.submit': 'Zur Prüfung senden',
        'company.privacy':
            'Ich stimme der Verarbeitung dieser Angaben zur Prüfung des Unternehmens und Verwaltung seiner Angebote zu.',
        'company.status.pending': 'Prüfung ausstehend',
        'company.status.verified': 'Unternehmen verifiziert',
        'company.status.rejected': 'Prüfung abgelehnt',
        'company.status.note': 'Begründung: {note}',
        'company.notice.pending':
            'Das Team prüft die Unternehmensangaben. Nach der Freigabe kannst du Angebote veröffentlichen.',
        'company.notice.verified':
            'Dein Unternehmen ist verifiziert. Jedes neue Angebot wird vor der Veröffentlichung geprüft.',
        'company.offers.title': 'Meine Angebote',
        'company.offer.form': 'Angebot einreichen',
        'company.offer.title': 'Stellenbezeichnung',
        'company.offer.description':
            'Beschreibe die Stelle und Ausbildung (mindestens 40 Zeichen)',
        'company.offer.sector': 'Branche',
        'company.offer.training': 'Ausbildungsprogramm',
        'company.offer.contract': 'Ausbildungsart',
        'company.offer.contract.apprenticeship': 'Ausbildung',
        'company.offer.contract.professionalization':
            'Professionalisierungsvertrag',
        'company.offer.contract.dual': 'Duale Berufsausbildung',
        'company.offer.education': 'Bildungsniveau',
        'company.offer.salaryMin': 'Mindestgehalt',
        'company.offer.salaryMax': 'Höchstgehalt',
        'company.offer.currency': 'Währung (ISO-Code)',
        'company.offer.duration': 'Dauer (Monate)',
        'company.offer.languages': 'Erforderliche Sprachen (kommagetrennt)',
        'company.offer.submit': 'Zur Moderation senden',
        'company.offer.state.pending': 'Prüfung ausstehend',
        'company.offer.state.approved': 'Veröffentlicht',
        'company.offer.state.rejected': 'Abgelehnt',
        'company.offer.state.unavailable': 'Deaktiviert',
        'company.offer.disable': 'Angebot deaktivieren',
        'company.applications.title': 'Eingegangene Bewerbungen',
        'company.application.status.received': 'Eingegangen',
        'company.application.status.reviewing': 'In Prüfung',
        'company.application.status.interview': 'Gespräch angeboten',
        'company.application.status.accepted': 'Angenommen',
        'company.application.status.rejected': 'Abgelehnt',
        'company.application.update': 'Status aktualisieren',
        'company.application.privacy':
            'Kontaktdaten und Anschreiben sind nur für das zuständige Unternehmen sichtbar.',
        'applications.title': 'Meine Bewerbungen',
        'applications.description':
            'Sieh dir den Status an und lösche eine Bewerbung, wenn du deine Daten entfernen möchtest.',
        'applications.empty':
            'Du hast dich noch nicht auf ein Angebot bei Alternance Connect beworben.',
        'applications.apply.title': 'Auf dieses Angebot bewerben',
        'applications.apply.description':
            'Dein Anschreiben wird zusammen mit deinem Kontonamen und deiner E-Mail-Adresse an das Unternehmen gesendet.',
        'applications.apply.letter': 'Anschreiben',
        'applications.apply.submit': 'Bewerbung senden',
        'applications.privacy':
            'Ich stimme zu, meinen Namen, meine E-Mail-Adresse und mein Anschreiben zur Bearbeitung meiner Bewerbung an dieses Unternehmen zu übermitteln.',
        'applications.applied':
            'Du hast dich bereits auf dieses Angebot beworben.',
        'applications.withdraw': 'Bewerbung löschen',
        'admin.companyReview.title': 'Unternehmen und Angebote prüfen',
        'admin.companyReview.description':
            'Prüfe die rechtlichen Angaben und anschließend die Angebote der Unternehmen.',
        'admin.companyReview.companies': 'Zu prüfende Unternehmen',
        'admin.companyReview.offers': 'Zu prüfende Angebote',
        'admin.companyReview.verify': 'Als verifiziert markieren',
        'admin.companyReview.reject': 'Ablehnen',
        'admin.companyReview.reason': 'Ablehnungsgrund (erforderlich)',
        'admin.companyReview.approveOffer': 'Freigeben und veröffentlichen',
        'admin.companyReview.rejectOffer': 'Angebot ablehnen',
        'admin.companyReview.companyNeeded':
            'Verifiziere das Unternehmen, bevor du dieses Angebot freigibst.',
        'admin.companyReview.emptyCompanies':
            'Keine Unternehmen zur Prüfung vorhanden.',
        'admin.companyReview.emptyOffers': 'Keine Angebote warten auf Prüfung.',
        'admin.sources.description':
            'Importe aus offiziellen Ausbildungsquellen einrichten und überwachen.',
        'admin.sources.noticeTitle': 'Einrichtung erforderlich:',
        'admin.sources.notice':
            'Füge den LBA-API-Schlüssel in .env ein und bestätige die nicht kommerzielle Nutzung. Der direkte Zugriff auf France Travail bleibt bis zur schriftlichen Genehmigung deaktiviert.',
        'admin.sources.lbaSetupTitle': 'Echte Angebote aktivieren',
        'admin.sources.lbaSetupIntro':
            'Solange die offizielle Verbindung nicht eingerichtet ist, können keine Angebote importiert werden. Folge diesen Schritten:',
        'admin.sources.lbaSetupCreateKey':
            'Einen API-Schlüssel für La Bonne Alternance erstellen',
        'admin.sources.lbaSetupAddKey':
            'Füge diese beiden Zeilen in die .env-Datei des Projekts ein. Ersetze „votre_cle“ durch deinen API-Schlüssel:',
        'admin.sources.lbaSetupConfirmUse':
            'Bestätige die nicht kommerzielle Nutzung, wie von dieser API verlangt.',
        'admin.sources.lbaSetupFinish':
            'Starte die App neu, aktualisiere diese Seite und klicke dann auf „Jetzt synchronisieren“. Wenn die Verbindung weiterhin als nicht eingerichtet angezeigt wird, führe php artisan config:clear im Projektordner aus.',
        'admin.sources.available': 'Verbindung eingerichtet',
        'admin.sources.unavailable': 'Verbindung nicht eingerichtet',
        'admin.sources.enabled': 'Aktiviert',
        'admin.sources.disabled': 'Deaktiviert',
        'admin.sources.offers': 'Gespeicherte Angebote',
        'admin.sources.lastSync': 'Letzte Synchronisierung',
        'admin.sources.never': 'Nie',
        'admin.sources.enable': 'Aktivieren',
        'admin.sources.disable': 'Deaktivieren',
        'admin.sources.syncNow': 'Jetzt synchronisieren',
        'admin.sources.history': 'Synchronisierungsverlauf',
        'admin.sources.date': 'Datum',
        'admin.sources.runStatus': 'Status',
        'admin.sources.imported': 'Empfangene Angebote',
        'admin.sources.expired': 'Abgelaufen',
        'admin.sources.noRuns': 'Noch keine Synchronisierung durchgeführt.',
        'admin.sources.status.running': 'Läuft',
        'admin.sources.status.succeeded': 'Abgeschlossen',
        'admin.sources.status.failed': 'Fehlgeschlagen',
        'auth.login.title': 'Schön, dass du wieder da bist',
        'auth.login.description':
            'Melde dich an, um deinen Alternance-Connect-Bereich zu öffnen.',
        'auth.email': 'E-Mail-Adresse',
        'auth.email.placeholder': 'name@beispiel.de',
        'auth.password': 'Passwort',
        'auth.password.placeholder': 'Dein Passwort',
        'auth.password.forgot': 'Passwort vergessen?',
        'auth.remember': 'Angemeldet bleiben',
        'auth.login.submit': 'Anmelden',
        'auth.login.noAccount': 'Noch kein Konto?',
        'auth.register.link': 'Konto erstellen',
        'auth.register.title': 'Werde Teil von Alternance Connect',
        'auth.register.description':
            'Erstelle deinen Bereich und bring deine beruflichen Pläne voran.',
        'auth.name': 'Vollständiger Name',
        'auth.name.placeholder': 'z. B. Camille Martin',
        'auth.password.choose': 'Wähle ein Passwort',
        'auth.password.confirm': 'Passwort bestätigen',
        'auth.password.repeat': 'Gib es erneut ein',
        'auth.register.submit': 'Konto erstellen',
        'auth.register.hasAccount': 'Du hast bereits ein Konto?',
        'auth.login.link': 'Anmelden',
        'auth.verify.title': 'Bestätige deine E-Mail-Adresse',
        'auth.verify.pageTitle': 'E-Mail-Bestätigung',
        'auth.verify.layoutDescription':
            'Nur noch ein Schritt, um dein Konto einzurichten.',
        'auth.verify.description':
            'Diese Seite erscheint nach der Kontoerstellung. In dieser lokalen Version kannst du die Plattform auch ohne Bestätigung erkunden.',
        'auth.verify.continue': 'Weiter zu Alternance Connect',
        'auth.verify.resend': 'Bestätigungslink erneut senden',
        'auth.verify.logout': 'Abmelden',
        'auth.verify.sent': 'Ein neuer Bestätigungslink wurde angefordert.',
        'auth.forgot.title': 'Passwort vergessen?',
        'auth.forgot.description':
            'Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu erhalten.',
        'auth.forgot.send': 'Link zum Zurücksetzen senden',
        'auth.forgot.return': 'Oder zurück zur',
        'auth.forgot.login': 'Anmeldung',
        'auth.reset.title': 'Passwort zurücksetzen',
        'auth.reset.description': 'Gib unten dein neues Passwort ein.',
        'auth.reset.submit': 'Passwort zurücksetzen',
        'auth.confirm.title': 'Passwort bestätigen',
        'auth.confirm.description':
            'Bitte bestätige dein Passwort, bevor du fortfährst.',
        'auth.confirm.submit': 'Passwort bestätigen',
        'auth.confirm.passkey': 'Mit Passkey bestätigen',
        'auth.confirm.passkeyLoading': 'Wird bestätigt…',
        'auth.confirm.orPassword': 'Oder mit Passwort bestätigen',
        'settings.title': 'Einstellungen',
        'settings.description':
            'Verwalte dein Profil und deine Kontoeinstellungen.',
        'settings.profile': 'Profil',
        'settings.security': 'Sicherheit',
        'settings.appearance': 'Darstellung',
        'profile.title': 'Profil',
        'profile.description':
            'Aktualisiere deinen Namen und deine E-Mail-Adresse.',
        'profile.name': 'Name',
        'profile.email': 'E-Mail-Adresse',
        'profile.save': 'Speichern',
        'profile.email.unverified':
            'Deine E-Mail-Adresse ist noch nicht bestätigt.',
        'profile.email.resend':
            'Klicke hier, um die Bestätigungs-E-Mail erneut zu senden.',
        'profile.email.sent':
            'Ein neuer Bestätigungslink wurde an deine E-Mail-Adresse gesendet.',
    },
};

type LocaleContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, values?: MessageValues) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function initialLanguage(): Language {
    if (typeof window === 'undefined') return 'fr';
    const saved = window.localStorage.getItem('alternance-connect-language');
    return saved === 'en' || saved === 'de' || saved === 'fr' ? saved : 'fr';
}

export function LocaleProvider({ children }: PropsWithChildren) {
    const [language, setLanguageState] = useState<Language>(initialLanguage);
    const setLanguage = useCallback((nextLanguage: Language) => {
        setLanguageState(nextLanguage);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                'alternance-connect-language',
                nextLanguage,
            );
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = 'ltr';
    }, [language]);

    const value = useMemo<LocaleContextValue>(
        () => ({
            language,
            setLanguage,
            t: (key, values = {}) => {
                const template =
                    messages[language][key] ?? messages.fr[key] ?? key;
                return template.replace(/\{(\w+)\}/g, (_, name: string) =>
                    String(values[name] ?? `{${name}}`),
                );
            },
        }),
        [language, setLanguage],
    );

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context)
        throw new Error('useLocale must be used within LocaleProvider');
    return context;
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
    const { language, setLanguage, t } = useLocale();

    return (
        <label
            className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm ${className}`}
        >
            <Languages size={16} className="shrink-0 text-[#6941C6]" />
            <span className="sr-only">{t('language.label')}</span>
            <select
                aria-label={t('language.label')}
                value={language}
                onChange={(event) =>
                    setLanguage(event.target.value as Language)
                }
                className="cursor-pointer border-0 bg-transparent p-0 pr-1 text-sm font-bold outline-none focus:ring-0"
            >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
            </select>
        </label>
    );
}
