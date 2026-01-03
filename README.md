# 🧪 Playwright Automation – OrangeHRM

Projet d’automatisation de tests end-to-end pour l’application **OrangeHRM**, basé sur **Playwright** et **TypeScript**.  
Ce projet couvre les parcours fonctionnels critiques RH avec une architecture maintenable, une séparation **Smoke / Regression** et une intégration **CI via GitHub Actions**.

---

## 🎯 Objectifs du projet

- Automatiser les fonctionnalités clés de OrangeHRM
- Appliquer les bonnes pratiques de test automation
- Mettre en place une suite stable, maintenable et CI-ready
- Démontrer des compétences professionnelles en QA Automation

---

## 🧰 Stack technique

- **Playwright**
- **TypeScript**
- **Page Object Model (POM)**
- **Fixtures Playwright**
- **Tests data-driven (JSON)**
- **GitHub Actions (CI)**

---

## 📁 Structure du projet
├── tests
│ ├── auth-login.spec.ts
│ ├── employee-create.data.spec.ts
│ ├── employee-contact-update.spec.ts
│
├── pages
│ └── orangeHRM.ts
│
├── fixtures
│ └── employees.json
│
├── supports
│ └── utils.ts
│
├── playwright.config.ts
├── README.md


---

## 🧩 Scénarios couverts

### 🔐 Authentification
- Login avec succès
- Login avec échec (credentials invalides)

### 👤 Gestion des employés
- Création d’employés (data-driven)
- Mise à jour des informations de contact
- (Scénarios extensibles : recherche, suppression)

---

## 🏷️ Tags de tests

| Tag | Description |
|----|------------|
| `@smoke` | Tests critiques (rapides) |
| `@regression` | Suite complète |

---

## ▶️ Exécution des tests

### Lancer tous les tests
npx playwright test --grep @smoke 

Lancer les tests Regression
npx playwright test --grep @regression

Mode UI
npx playwright test --ui

