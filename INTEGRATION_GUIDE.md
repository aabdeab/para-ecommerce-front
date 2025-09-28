# Guide de Démarrage - Intégration Frontend/Backend E-commerce

## 🚀 Configuration Rapide

### 1. Démarrer le Backend (Spring Boot)

```bash
cd Para_ecommerce
./gradlew bootRun
```

Le backend devrait être accessible sur `http://localhost:8080`

### 2. Démarrer le Frontend (React)

```bash
cd my-app
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 🔧 Résolution des Problèmes CORS

Si vous rencontrez des erreurs CORS, vérifiez que votre `SecurityConfig.java` contient :

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

// Dans configure(HttpSecurity http)
http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

## 🧪 Test de Connexion

Visitez `/test-backend` dans votre application pour tester la connectivité backend.

## 📋 Fonctionnalités Implémentées

### ✅ Authentification
- ✅ Inscription utilisateur (`/signup`)
- ✅ Connexion utilisateur (`/auth`)
- ✅ Gestion des tokens JWT
- ✅ Routes protégées
- ✅ Déconnexion automatique en cas d'expiration

### ✅ Catalogue Produits
- ✅ Liste des produits (`/products`)
- ✅ Recherche par nom
- ✅ Filtrage par catégorie
- ✅ Pagination
- ✅ Design responsive

### ✅ Gestion des Catégories (Admin)
- ✅ Liste des catégories (`/admin/categories`)
- ✅ Création de nouvelles catégories
- ✅ Modification des catégories
- ✅ Suppression des catégories
- ✅ Protection par authentification

### ✅ Gestion d'Erreurs
- ✅ Page d'erreur 500 (`/error`)
- ✅ Gestion des erreurs réseau
- ✅ Messages d'erreur utilisateur-friendly
- ✅ Redirection automatique

## 🔄 Endpoints Backend Intégrés

### Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détail d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/{id}` - Détail d'une catégorie
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/{id}` - Modifier une catégorie
- `DELETE /api/categories/{id}` - Supprimer une catégorie

## 🎯 Prochaines Étapes

1. Tester l'authentification complète
2. Ajouter/modifier des produits via l'interface admin
3. Tester la gestion des catégories
4. Implémenter le panier d'achat complet
5. Ajouter la gestion des commandes

## 🛠️ Structure des Fichiers Créés/Modifiés

```
my-app/src/
├── api/
│   ├── apiClient.ts (client HTTP avec gestion d'erreurs)
│   ├── auth.ts (authentification)
│   ├── products.ts (produits et catégories)
│   └── tokenService.ts (gestion des tokens)
├── Components/
│   ├── BackendStatusIndicator.tsx (indicateur de statut)
│   └── ProtectedRoute.tsx (routes protégées)
├── context/
│   └── AuthContext.tsx (contexte d'authentification)
├── hooks/
│   └── useBackendStatus.ts (hook de statut backend)
├── pages/
│   ├── ProductCatalogPage.tsx (catalogue produits)
│   ├── CategoryManagementPage.tsx (gestion catégories)
│   ├── ErrorPage.tsx (page d'erreur)
│   └── BackendTestPage.tsx (test de connexion)
└── utils/
    └── errorHandler.ts (gestion centralisée des erreurs)
```

## 🔍 Débogage

- Ouvrez les outils de développement (F12)
- Vérifiez l'onglet Network pour les requêtes API
- Consultez la console pour les erreurs JavaScript
- Utilisez `/test-backend` pour diagnostiquer les problèmes de connexion

Votre application e-commerce est maintenant prête à fonctionner ! 🎉