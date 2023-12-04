[English](#english) | [Francais](#french) 

# Reddit Clone<a id="english"></a>

## Table of contents:
- [Overview](#overview)
- [Technologies and Libraries](#tech)
- [Installation Guide](#install-guide)
    - [Prerequisites](#prerequisites)
    - [Installing](#installing)
    - [Running the Development Server](#dev-server)
    - [Building for Production](#prod-build)
- [Firebase Setup Guide](#firebase-guide)
    - [Create a Firebase Project](#create-project)
    - [Enable Firebase Services](#services)
        - [Firestore](#firestore)
        - [Authentification](#auth)
        - [Storage](#storage)
    - [Set Up Environment Variables](#variables)
- [Project Structure](#structure)
- [Functionalities](#functionalities)
- [Screenshots](#screenshots)
- [Future Improvements](#improvements)
- [License](#license)

## Overview <a id="overview"></a>

This project serves as a practical exercise for improving my skills in API requests, data structuring, and front-end development. The main goal was to gain a deeper understanding of data manipulation and presentation.

During my professional training, I was tasked to code a Reddit clone, which didn't go as seamlessly as I had hoped. So, I decided to revisit the project. I tried to address past challenges and I took the opportunity to redesign the interface, which is obviously inspired by [Reddit](https://www.reddit.com/) but also [ShadCN](https://ui.shadcn.com/)'s minimal look. However, instead of using their library, I decided to build my own components from scratch.

No part of this project has been tested for hosting. Everything has only been run on a local server as this was for fun and practice purposes only.

## Technologies and Libraries <a id="tech"></a>

- **[Vite](https://vitejs.dev/):** Build tool

- **[React](https://react.dev/):** Javascript framework

- **[Firebase](https://firebase.google.com/):** Database, authentification and storage

- **[React Router](https://reactrouter.com/en/main):** Public and protected routes

- **[TailwindCSS](https://tailwindcss.com/):** CSS framework, along with some pure CSS

- **[Lucide React](https://lucide.dev/):** Icon library

- **[react-helmet-async](https://www.npmjs.com/package/react-helmet-async):** Dynamic titles

- **[moment.js](https://momentjs.com/):** Timestamps rendering

- **[react-toggle-dark-mode](https://www.npmjs.com/package/react-toggle-dark-mode):** Theme toggle component

## Installation Guide <a id="install-guide"></a>

### Prerequisites <a id="prerequisites"></a>

Make sure you have [Node.js](https://nodejs.org/en) and npm installed on your machine.

### Installing <a id="installing"></a>

Follow these steps to install the project:

1. Clone the repository to your local machine.

    `git@github.com:lnbgc/reddit.git`

2. Navigate to the project directory 

    `cd reddit`

3. Intall dependencies using npm
    
    `npm install`

### Running the Development Server <a id="dev-server"></a>

To start the development server, run the following command:

`npm run dev`

This will launch the application at `http://localhost:3000` or any other local server you have set up.

### Building for Production <a id="prod-build"></a>

To build the project for production, use the following command:

`npm run build`

This will generate optimised production-ready files in the `dist` directory. Then again, along hosting, production build has not been tested.

## Firebase Setup Guide <a id="firebase-guide"></a>

Here is how you can set up Firebase for this project, including storing environment variables and enabling Firestore, Authentification (Email/Password and Google), and Storage.

### Step 1: Create a Firebase Project <a id="create-project"></a>

1. Go to the [Firebase Console](https://console.firebase.google.com/).

2. Click on "Add Project" and follow the prompts to create a new Firebase project.

### Step 2: Enable Firebase Services <a id="services">

#### Firestore <a id="firestore">

1. In the Firebase Console, navigate to "Firestore Database."
    
2. Click on "Get Started" and follow the prompts to set up Firestore. The project has been built on test mode, but feel free to adjust and create your own rules.
    

#### Authentication <a id="auth">

1. In the Firebase Console, navigate to "Authentication."
    
2. Enable the "Email/Password" sign-in method.
    
3. Enable the "Google" sign-in method.
    

#### Storage <a id="storage">

1. In the Firebase Console, navigate to "Storage."
    
2. Click on "Get Started" and follow the prompts to set up Firebase Storage. The project has been built on test mode, but feel free to adjust and create your own rules.
    

### Step 3: Set Up Environment Variables <a id="variables">

1. Create a file named `.env.local` at the root of the project.
    
2. Add the following environment variables to the `.env.local` file:
    
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace `your-api-key`, `your-auth-domain`, and other placeholders with the values from your Firebase project settings.

**Note: These environment variables are necessary for the application to connect to the Firebase project. Make sure that you have the correct values from your Firebase project settings to allow integration.**

You’re now ready to use Firebase in the project!

## Project Structure <a id="structure"></a>

The project structure being quite extensive and subject to change, here is a brief overview of the project main directories:

```
root
│
├── src/
│ ├── assets/
│ ├── components/
│ ├── contexts/
│ ├── pages/
│ ├── routes/
│ ├── utils/
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
│
├── index.html
├── LICENSE
└── README.md <-- You're here
```

- **/src:** Source code

- **/assets:** Static logos and default avatars

- **/components:** Reusable React components

- **/contexts:** Theme and Auth contexts for managing global states

- **/pages:** The application different pages

- **/routes:** Routing configuration and route components

- **/utils:** Firebase configuration and services

Absolute imports have been set up in `vite.config.js` and `jsconfig.json` at the root of the project for clearer imports.

## Functionalities <a id="functionalities"></a>

1. **Authentication:**

    - Login and register with email and password
    - Login and register with Google provider
    - Protected routes for limited access
    - Auth context for managing user sessions

2. **Community Management:**

   - Create and update communities
   - Create, edit and delete community rules and post flairs
   - Follow/Join system
   - Favourite system
   - Assign moderators

3. **Post Creation:**

   - Create posts within communities
   - Tag posts with flairs
   - Allow image uploads
   
4. **Comments System:**

   - Nested/Threaded comments system

5. **Voting System:**

   - Upvote or downvote posts
   - Upvote or downvote comments

6. **User Dashboard:**

   - Display submitted posts, saved posts, upvoted/downvoted posts, and comments
   - Following system for users
   - Update avatar, bio and social link

6. **User Settings:**

   - Update password
   - Delete account
   - Multiple confirmation checks to avoid involuntary changes

8. **Dark Mode:**

   - Dark mode option for improved user experience

9. **Responsive Design:**

   - The application is suited for both mobile and desktop viewports

## Screenshots <a id="screenshots"></a>

None of the posts or comments visible in the screenshots reflect my opinions or are my property. All visible content has been directly copied from Reddit for presentation purposes, including community names. All usernames, except @lnbgc, have been generated on [Last Pass](https://www.lastpass.com/features/username-generator). Feel free to check out the subreddits for [Firebase](https://www.reddit.com/r/Firebase/), [ReactJS](https://www.reddit.com/r/reactjs/), and [webdev](https://www.reddit.com/r/webdev/).

![Index page with all posts and following/favourite communities - Light mode.](/screenshots/Capture%20d'écran%202023-12-03%20210848.png)
*Index page with all posts and following/favourite communites - Light mode.*

![Full post page with nested comments - Dark mode.](/screenshots/Capture%20d'écran%202023-12-03%20204010.png)
*Full post page with nested comments - Dark mode.*

![Create post page - Light mode.](/screenshots/Capture%20d'écran%202023-12-03%20203206.jpg)
*Create post page - Light mode.*

![Community page and its details, with posts rules and flairs - Dark mode.](/screenshots/Capture%20d'écran%202023-12-03%20211344.png)
*Community page and its details, with posts rules and flairs - Dark mode.*


![Starting page with login modal - Light mode.](/screenshots/Capture%20d'écran%202023-12-03%20201448.png)
*Starting page with login modal - Light mode.*

![User dashboard/profile with posts, votes and comments history - Dark mode.](/screenshots/Capture%20d'écran%202023-12-03%20210655.png)
*User dashboard/profile with posts, votes and comments history - Dark mode.*

![Edit community page a.k.a. Mod Tools - Light mode.](/screenshots/Capture%20d'écran%202023-12-03%20202437.png)
*Edit community page a.k.a. Mod Tools - Light mode.*

![Create community page - Dark mode.](/screenshots/Capture%20d'écran%202023-12-03%20201947.png)
*Create community page - Dark mode.*

## Future Improvements <a id="improvements"></a>

- **Loading Context:** Introduce a well-constructed loading context for smoother user interactions

- **Post and Comment Deletion:** Address challenges in the current data structure to implement the deletion of posts and comments

- **Additional Features:** Explore additional features like private messaging and/or user notifications, complete real-time updates

## License <a id="license">

This project is licensed under the [MIT License](https://github.com/lnbgc/reddit/blob/main/LICENSE).

---

# Reddit Clone<a id="french"></a>

## Table des matières:

- [Aperçu](#overview-fr)
- [Technologies et bibliothèques](#tech-fr)
- [Guide d'installation ](#install-guide-fr)
    - [Prérequis](#prerequisites-fr)
    - [Installation](#installing-fr)
    - [Lancer le serveur de développement ](#dev-server-fr)
    - [Build de production](#prod-build-fr)
- [Guide de configuration Firebase ](#firebase-guide-fr)
    - [Créer un projet Firebase ](#create-project-fr)
    - [Activer les services Firebase](#services-fr)
        - [Firestore](#firestore-fr)
        - [Authentification](#auth-fr)
        - [Storage](#storage-fr)
    - [Configuration des variables d'environnement](#variables-fr)
- [Structure du projet](#structure-fr)
- [Fonctionnalités](#functionalities-fr)
- [Captures d'écran](#screenshots-fr)
- [Améliorations futures](#improvements-fr)
- [Licence](#license-fr)

## Aperçu <a id="overview-fr"></a>

Ce projet sert d'exercice pratique pour améliorer mes compétences en matière de requêtes API, de structuration des données et de développement front-end. L'objectif principal était d'acquérir une compréhension plus approfondie sur la manipulation et la présentation des données.

Au cours de ma formation professionnelle, on m'a demandé de coder un clone de Reddit, ce qui s'est avéré bien plus compliqué que ce que je pensais. J'ai donc décidé de reprendre le projet. J'ai essayé de relever les défis passés et j'ai profité de l'occasion pour faire une refonte de l'interface, qui s'inspire évidemment de [Reddit](https://www.reddit.com/) mais aussi de [ShadCN](https://ui.shadcn.com/). Cependant, au lieu d'utiliser leur bibliothèque, j'ai décidé de construire mes propres composants à partir de zéro.

Aucune partie de ce projet n'a été testée pour l'hébergement. Tout a été exécuté sur un serveur local, car il s'agissait uniquement d'un projet ludique et pratique.

## Technologies et bibliothèques <a id="tech-fr"></a>

- **[Vite](https://vitejs.dev/):** Build Tool
    
- **[React](https://react.dev/):** Framework JavaScript
    
- **[Firebase](https://firebase.google.com/):** Base de données, authentification et stockage
    
- **[React Router](https://reactrouter.com/en/main):** Routes publiques et protégées
    
- **[TailwindCSS](https://tailwindcss.com/):** Framework CSS
    
- **[Lucide React](https://lucide.dev/):** Bibliothèque d'icônes
    
- **[react-helmet-async](https://www.npmjs.com/package/react-helmet-async):** Titres dynamiques
    
- **[moment.js](https://momentjs.com/):** Rendu des horodatages
    
- **[react-toggle-dark-mode](https://www.npmjs.com/package/react-toggle-dark-mode):** Composant de bascule de thème
    
## Guide d'installation <a id="install-guide-fr"></a>

### Prérequis <a id="prerequisites-fr"></a>

Assurez-vous d'avoir [Node.js](https://nodejs.org/en) et npm installés sur votre machine.

### Installation <a id="installing-fr"></a>

Suivez ces étapes pour installer le projet :

1. Clonez le répertoire sur votre machine locale.
    
    `git@github.com:lnbgc/reddit.git`
    
2. Accédez au répertoire du projet.
    
    `cd reddit`
    
3. Installez les dépendances avec npm.
    
    `npm install`

### Lancer le serveur de développement <a id="dev-server-fr"></a>

Pour démarrer le serveur de développement, exécutez la commande suivante :

`npm run dev`

Cela lancera l'application à l'adresse `http://localhost:3000` ou tout autre serveur local que vous avez configuré.

### Build de production <a id="prod-build-fr"></a>

Pour lancer un build de production, utilisez la commande suivante :

`npm run build`

Cela générera des fichiers optimisés prêts pour la production dans le dossier `dist`. Encore une fois, tout comme l'hébergement, aucune version de production n'a été testée.

## Guide de configuration Firebase <a id="firebase-guide-fr"></a>

Voici un guide pour vous aider à configurer Firebase pour ce projet. Celui-ci inclut le stockage des variables d'environnement et l'activation de Firestore, Authentification (e-mail/mot de passe et Google) et Storage.

### Étape 1 : Créer un projet Firebase <a id="create-project-fr"></a>

1. Accédez à la [Console Firebase](https://console.firebase.google.com/).
    
2. Cliquez sur "Ajouter un projet" et suivez les instructions pour créer un nouveau projet Firebase.

### Étape 2 : Activer les services Firebase <a id="services-fr">

#### Firestore <a id="firestore-fr">

1. Dans la Console Firebase, accédez à "Firestore Database".
    
2. Cliquez sur "Commencer" et suivez les instructions pour configurer Firestore. Le projet a été construit en mode test, mais n'hésitez pas à créer vos propres règles.

#### Authentification <a id="auth-fr">

1. Dans la Console Firebase, accédez à "Authentification".
    
2. Activez la méthode de connexion "E-mail/Mot de passe".
    
3. Activez la méthode de connexion "Google".

#### Stockage <a id="storage-fr">

1. Dans la Console Firebase, accédez à "Storage".
    
2. Cliquez sur "Commencer" et suivez les instructions pour configurer le stockage Firebase. Le projet a été construit en mode test, mais n'hésitez pas à créer vos propres règles.
    
### Étape 3 : Configuration des variables d'environnement <a id="variables-fr">

1. Créez un fichier nommé `.env.local` à la racine du projet.
    
2. Ajoutez les variables d'environnement suivantes au fichier `.env.local` :

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Remplacez `your-api-key`, `your-auth-domain`, et autres par les valeurs de votre configuration de projet Firebase.

**Remarque : Ces variables d'environnement sont nécessaires pour que l'application se connecte au projet Firebase. Assurez-vous d'avoir les valeurs correctes dans les paramètres de votre projet Firebase pour permettre l'intégration**.

Vous êtes maintenant prêt à utiliser Firebase !

## Structure du projet <a id="structure-fr"></a>

La structure du projet étant assez vaste et susceptible d'être modifiée, voici un bref aperçu des principaux dossiers du projet :

```
root
│
├── src/
│ ├── assets/
│ ├── components/
│ ├── contexts/
│ ├── pages/
│ ├── routes/
│ ├── utils/
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
│
├── index.html
├── LICENSE
└── README.md <-- Vous êtes ici
```

- **/src:** Code source

- **/assets:** Logos statiques et avatars par défaut

- **/components:** Composants React réutilisables

- **/contexts:** Contextes Theme et Auth pour la gestion des états globaux

- **/pages:** Les différentes pages de l'application

- **/routes:** Configuration du routage et composants de route

- **/utils:** Configuration et services Firebase

Des importations absolues ont été mises en place dans `vite.config.js` et `jsconfig.json` à la racine du projet pour des importations plus claires.

## Fonctionnalités <a id="functionalities-fr"></a>

1. **Authentification :**
    
    - Connexion et inscription par e-mail et mot de passe
    - Connexion et inscription avec le fournisseur Google
    - Routes protégées pour un accès limité
    - Contexte d'authentification pour la gestion des sessions utilisateur

2. **Gestion de la communauté :**
    
    - Créer et mettre à jour des communautés
    - Créer, modifier et supprimer des règles de communauté et des flairs de publication
    - Système de suivi (follow)
    - Système de favoris
    - Attribution de modérateurs

3. **Création de publications :**
    
    - Créer des publications au sein des communautés
    - Taguer les publications avec des flairs
    - Autoriser les téléchargements d'images

4. **Système de commentaires :**
    
    - Système de commentaires imbriqués/thread

5. **Système de vote :**
    
    - Upvote ou downvote des publications
    - Upvote ou downvote des commentaires

6. **Tableau de bord utilisateur :**
    
    - Afficher les publications postées, enregistrées, votées et les commentaires
    - Système de suivi (follow) entre utilisateurs
    - Mettre à jour l'avatar, la biographie et le lien social

7. **Paramètres utilisateur :**
    
    - Mettre à jour le mot de passe
    - Supprimer le compte
    - Plusieurs contrôles de confirmation pour éviter les changements involontaires

8. **Mode sombre:**

   - Option de mode sombre pour améliorer l'expérience de l'utilisateur

9. **Design responsive:**

   - Adapté aux écrans mobiles et de bureau

## Captures d'écran <a id="screenshots-fr"></a>

Aucun des posts ou commentaires visibles sur les captures d'écrans ne reflétent mes opinions ou ne m'appartiennent. Tout le contenu visible a été directement copié depuis Reddit à des fins de présentation, ainsi que les noms de communauté. Tous les noms d'utilisateurs, à part @lnbgc, ont été générés sur [Last Pass](https://www.lastpass.com/fr/features/username-generator). N'hésitez pas à faire un tour sur les subreddits de [Firebase](https://www.reddit.com/r/Firebase/), [ReactJS](https://www.reddit.com/r/reactjs/) et [webdev](https://www.reddit.com/r/webdev/).

![Page d'accueil montrant toutes les publications et les communautés suivies/mises en favoris - Mode clair.](/screenshots/Capture%20d'écran%202023-12-03%20210848.png)
*Page d'accueil montrant toutes les publications et les communautés suivies/mises en favoris - Mode clair.*

![Publication et thread de commentaires - Mode sombre.](/screenshots/Capture%20d'écran%202023-12-03%20204010.png)
*Publication et thread de commentaires - Mode sombre.*

![Page créer une publication - Mode clair.](/screenshots/Capture%20d'écran%202023-12-03%20203206.jpg)
*Page créer une publication - Mode clair.*

![Page de communauté avec ses détails, publications, règles et flairs - Mode sombre.](/screenshots/Capture%20d'écran%202023-12-03%20211344.png)
*Page de communauté avec ses détails, publications, règles et flairs - Mode sombre.*

![Page de démarrage et modale de connexion - Mode clair.](/screenshots/Capture%20d'écran%202023-12-03%20201448.png)
*Page de démarrage et modale de connexion - Mode clair.*

![User dashboard/profile with posts, votes and comments history - Dark mode.](/screenshots/Capture%20d'écran%202023-12-03%20210655.png)
*Tableau de bord/Profil utilisateur avec historique de publications, votes et commentaires - Mode sombre.*

![Modifier une communauté a.k.a. Mod Tools - Mode clair.](/screenshots/Capture%20d'écran%202023-12-03%20202437.png)
*Modifier une communauté a.k.a. Mod Tools - Mode clair.*

![Page créer une communauté - Mode sombre.](/screenshots/Capture%20d'écran%202023-12-03%20201947.png)
*Page créer une communauté - Mode sombre.*

## Améliorations futures <a id="improvements-fr"></a>

- **Contexte de chargement:** Introduire un contexte de chargement pour des interactions plus fluides avec l'utilisateur

- **Suppression des messages et des commentaires:** Relever les défis posés par la structure actuelle des données pour mettre en œuvre la suppression des messages et des commentaires

- **Fonctionnalités supplémentaires:** Explorer des fonctionnalités supplémentaires telles qu'une messagerie privée et/ou un système de notifications, ainsi que les mises à jour en temps réel
    
## Licence <a id="license-fr">

Ce projet est sous [Licence MIT](https://github.com/lnbgc/reddit/blob/main/LICENSE).