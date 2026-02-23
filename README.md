# Milano Cortina 2026 – Olympia Webapp

![Home](https://github.com/user-attachments/assets/8dbee974-8a8c-4ae9-8e79-fd202091cd04)

Offizielle Demo-Webanwendung für die **Olympischen Winterspiele Milano Cortina 2026**, entwickelt von **Olympia IT Solutions**. Die App stellt Informationen zu Sportarten, Ländern und Medaillen bereit und bietet ein internes Ergebnisverwaltungssystem mit 4-Augen-Prinzip.

🔗 **Live-Demo:** [https://olympia-it-solutions.github.io/olympia-2026-webapp/](https://olympia-it-solutions.github.io/olympia-2026-webapp/)

---

## Inhaltsverzeichnis

1. [Entwicklerdokumentation](#entwicklerdokumentation)
   - [Technologie-Stack](#technologie-stack)
   - [Voraussetzungen](#voraussetzungen)
   - [Installation](#installation)
   - [Entwicklungsserver starten](#entwicklungsserver-starten)
   - [Build & Deployment](#build--deployment)
   - [Projektstruktur](#projektstruktur)
   - [Architektur & Konzepte](#architektur--konzepte)
2. [Benutzerdokumentation](#benutzerdokumentation)
   - [Startseite](#1-startseite)
   - [Navigation](#2-navigation)
   - [Länderübersicht](#3-länderübersicht)
   - [Länderdetails & Medaillen](#4-länderdetails--medaillen)
   - [Sportarten](#5-sportarten)
   - [Login](#6-login)
   - [Schiedsrichter-Dashboard](#7-schiedsrichter-dashboard)
   - [Admin-Dashboard](#8-admin-dashboard)
   - [Cookie-Banner & Rechtliches](#9-cookie-banner--rechtliches)
   - [Dark Mode & Sprache](#10-dark-mode--sprache)

---

## Entwicklerdokumentation

### Technologie-Stack

| Technologie | Version | Beschreibung |
|---|---|---|
| [React](https://react.dev/) | 19.x | UI-Framework |
| [TypeScript](https://www.typescriptlang.org/) | ~5.8 | Typsichere Entwicklung |
| [Vite](https://vite.dev/) | 7.x | Build-Tool & Dev-Server |
| [Chakra UI](https://chakra-ui.com/) | 3.x | Komponentenbibliothek |
| [React Router](https://reactrouter.com/) | 7.x | Client-seitiges Routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.x | Globales State-Management |
| [i18next](https://www.i18next.com/) | 25.x | Internationalisierung (de, en, fr, it) |
| [Framer Motion](https://www.framer.com/motion/) | 12.x | Animationen |
| [styled-components](https://styled-components.com/) | 6.x | CSS-in-JS Styling |
| [react-icons](https://react-icons.github.io/react-icons/) | 5.x | Icon-Bibliothek |

---

### Voraussetzungen

- **Node.js** ≥ 18.x ([Download](https://nodejs.org/))
- **npm** ≥ 9.x (wird mit Node.js mitgeliefert)
- **Git** ([Download](https://git-scm.com/))

---

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/Olympia-IT-Solutions/olympia-2026-webapp.git

# 2. In das Projektverzeichnis wechseln
cd olympia-2026-webapp

# 3. Abhängigkeiten installieren
npm install
```

---

### Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist dann unter [http://localhost:5173/olympia-2026-webapp/](http://localhost:5173/olympia-2026-webapp/) erreichbar. Sie wird automatisch beim Speichern von Dateien aktualisiert (Hot Module Replacement).

Beim Aufruf der Root-URL `/` wird automatisch auf `/de` (Deutsch) weitergeleitet.

**Verfügbare npm-Skripte:**

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Startet den Entwicklungsserver |
| `npm run build` | Erstellt einen optimierten Production-Build |
| `npm run preview` | Startet einen lokalen Vorschau-Server für den Build |
| `npm run lint` | Führt ESLint zur Code-Analyse aus |
| `npm run deploy` | Baut und deployt die App auf GitHub Pages |

---

### Build & Deployment

#### Production-Build erstellen

```bash
npm run build
```

Der Build wird im Verzeichnis `dist/` abgelegt und ist für den Einsatz unter dem Pfad `/olympia-2026-webapp/` konfiguriert (definiert in `vite.config.ts`).

#### Auf GitHub Pages deployen

```bash
npm run deploy
```

Dieses Skript baut die Anwendung und veröffentlicht den `dist/`-Ordner auf dem `gh-pages`-Branch des Repositories. Das Deployment erfolgt über das Paket [gh-pages](https://www.npmjs.com/package/gh-pages).

---

### Projektstruktur

```
olympia-2026-webapp/
├── public/
│   ├── locales/                # Übersetzungsdateien
│   │   ├── de/translation.json # Deutsch
│   │   ├── en/translation.json # Englisch
│   │   ├── fr/translation.json # Französisch
│   │   └── it/translation.json # Italienisch
│   ├── *.svg                   # Sport-Piktogramme (IOC)
│   └── favicon.ico
├── src/
│   ├── assets/                 # Statische Assets (Logos, Bilder)
│   ├── components/             # Wiederverwendbare UI-Komponenten
│   │   ├── Banner.tsx          # Oberes Informationsbanner (Datum, Tickets, Shop)
│   │   ├── CookieMenu.tsx      # Cookie-Einwilligungsbanner
│   │   ├── CountriesFeature.tsx# Teaser-Bereich für die Länderübersicht
│   │   ├── CountryTable.tsx    # Medaillenspiegel-Tabelle
│   │   ├── DisciplinesSection.tsx # Kachelansicht aller Sportarten
│   │   ├── Footer.tsx          # Seitenfuß mit Links
│   │   ├── FooterBanner.tsx    # Visueller Banner über dem Footer
│   │   ├── HeaderWithImage.tsx # Seitenheader mit Hintergrundbild
│   │   ├── HeroVideo.tsx       # Hero-Bereich der Startseite
│   │   ├── MedalDisplay.tsx    # Medaillenanzeige für Länder
│   │   ├── NavBar.tsx          # Hauptnavigation
│   │   ├── Slider.tsx          # Bildkarussell
│   │   └── SportsTable.tsx     # Ergebnistabelle für Sportarten
│   ├── debug/
│   │   └── index.ts            # DebugManager (Testmodus-Steuerung)
│   ├── i18n/
│   │   └── index.ts            # i18next-Konfiguration
│   ├── logic/
│   │   ├── rights.ts           # Authentifizierung & Rollenverwaltung
│   │   └── theme.tsx           # Dark/Light Mode (ThemeProvider)
│   ├── pages/                  # Seitenkomponenten (Routen)
│   │   ├── Accessibility.tsx   # Barrierefreiheitsseite
│   │   ├── Admin.tsx           # Admin-Dashboard
│   │   ├── CookiePolicy.tsx    # Cookie-Richtlinie
│   │   ├── Countries.tsx       # Länderübersicht
│   │   ├── CountryDetail.tsx   # Länderdetails & Medaillen
│   │   ├── Dashboard.tsx       # Schiedsrichter-Dashboard
│   │   ├── Login.tsx           # Login-Seite
│   │   ├── NotFound.tsx        # 404-Seite
│   │   ├── PrivacyPolicy.tsx   # Datenschutzbestimmungen
│   │   ├── SportPage.tsx       # Sportart-Detailseite
│   │   └── TermsOfService.tsx  # Nutzungsbedingungen
│   ├── services/               # API-Dienste
│   │   ├── auth.ts             # Authentifizierungs-API
│   │   ├── medals.ts           # Medaillen-API
│   │   ├── results.ts          # Ergebnis-API
│   │   └── sports.ts           # Sportarten-API
│   ├── store/                  # Zustand-Stores (Zustand)
│   │   ├── medals.ts           # Medaillen-Store
│   │   ├── results.ts          # Ergebnis-Store
│   │   └── sports.ts           # Sportarten-Store
│   ├── App.tsx                 # Haupt-App mit Routing
│   ├── index.css               # Globale CSS-Variablen & Styles
│   └── main.tsx                # Einstiegspunkt
├── eslint.config.js            # ESLint-Konfiguration
├── index.html                  # HTML-Einstiegspunkt
├── package.json
├── tsconfig.json               # TypeScript-Konfiguration
└── vite.config.ts              # Vite-Konfiguration
```

---

### Architektur & Konzepte

#### Routing

Die App nutzt **React Router v7** mit sprachbasiertem URL-Präfix:

```
/de          → Startseite (Deutsch)
/en          → Startseite (Englisch)
/de/countries          → Länderübersicht
/de/country/:country   → Länderdetail
/de/sports/:sportId    → Sportart-Detail
/de/login              → Login
/de/dashboard          → Schiedsrichter-Dashboard (geschützt)
/de/admin              → Admin-Dashboard (geschützt, nur Admin)
/de/cookie-policy      → Cookie-Richtlinie
/de/privacy-policy     → Datenschutzbestimmungen
/de/terms-of-service   → Nutzungsbedingungen
/de/accessibility      → Barrierefreiheit
```

#### Internationalisierung (i18n)

Alle Texte der Anwendung sind übersetzt. Die Sprache wird über das URL-Präfix gesteuert. Unterstützte Sprachen:

- 🇩🇪 **Deutsch** (`/de`)
- 🇬🇧 **Englisch** (`/en`)
- 🇫🇷 **Französisch** (`/fr`)
- 🇮🇹 **Italienisch** (`/it`)

Die Übersetzungsdateien liegen unter `public/locales/{lang}/translation.json`.

#### Authentifizierung & Rollen

Das Rechte-System (`src/logic/rights.ts`) kennt zwei Rollen:

| Rolle | Beschreibung | Zugang |
|---|---|---|
| `admin` | Administrator | Dashboard + Admin-Bereich |
| `referee` | Schiedsrichter | Nur Dashboard |

**Login-Ablauf:** Die App versucht zunächst die REST-API (`https://olympia-2026-api.onrender.com/api/auth/login`). Schlägt dies fehl, greift im Debug-Modus ein Fallback auf lokale Testaccounts:

| Benutzername | Passwort | Rolle |
|---|---|---|
| `admin@test.com` | `admin` | Admin |
| `referee@test.com` | `referee` | Schiedsrichter |

Nach erfolgreichem Login wird die Session im `localStorage` gespeichert.

#### State Management (Zustand)

Drei Zustand-Stores verwalten den globalen Zustand:

- **`useSportsStore`** – Liste aller Sportarten (aus API)
- **`useResultsStore`** – Ergebnisse je Sportart (aus API)
- **`useMedalStore`** – Medaillen je Land (aus API)

#### Backend-API

Die App kommuniziert mit einer REST-API unter `https://olympia-2026-api.onrender.com/api/`. Folgende Endpunkte werden genutzt:

| Endpunkt | Beschreibung |
|---|---|
| `POST /api/auth/login` | Benutzer-Login |
| `GET /api/sports` | Liste aller Sportarten |
| `GET /api/results?sportId={id}` | Ergebnisse einer Sportart |
| `GET /api/medals/country/{country}` | Medaillen eines Landes |
| `GET /api/medals/table` | Gesamter Medaillenspiegel |

#### Dark Mode

Der Dark/Light Mode wird über einen `ThemeProvider` (`src/logic/theme.tsx`) und CSS-Custom-Properties (z.B. `--bg-color`, `--card-bg`) realisiert. Die Präferenz wird im `localStorage` gespeichert.

---

## Benutzerdokumentation

### 1. Startseite

![Startseite](https://github.com/user-attachments/assets/8dbee974-8a8c-4ae9-8e79-fd202091cd04)

Die Startseite bietet einen Überblick über die Olympischen Winterspiele Milano Cortina 2026:

- **Info-Banner** (ganz oben): Zeigt den Zeitraum der Spiele sowie Links zu Tickets und dem offiziellen Shop.
- **Hero-Bereich**: Animierter Eingangsbereich mit dem Willkommenstext und Schnellnavigation zu den Disziplinen und Ländern.
- **Disziplinen-Sektion**: Kachelansicht der 7 verfügbaren Sportarten – klickbar, um zur jeweiligen Detailseite zu gelangen.
- **Bildkarussell (Slider)**: Automatisch wechselnde Olympia-Bilder (10 Slides, alle 5 Sekunden). Navigierbar per Pfeiltasten oder Punkte-Navigation.
- **Länder-Teaser**: Vorschau der Länderübersicht mit direktem Link zum vollständigen Medaillenspiegel.
- **Footer**: Links zu rechtlichen Seiten sowie Copyright-Hinweis.

---

### 2. Navigation

Die **Navigationsleiste** ist auf jeder Seite sichtbar und enthält:

| Element | Beschreibung |
|---|---|
| **Logo** | Klick führt zur Startseite |
| **Länderübersicht** | Öffnet den Medaillenspiegel |
| **Sportarten ▾** | Dropdown mit allen 7 Sportarten |
| **Dashboard** | Nur sichtbar nach Login (für Schiedsrichter und Admins) |
| **Admin** | Nur sichtbar für eingeloggte Admins |
| **Login / Logout** | An-/Abmelden |
| **🌙 / ☀️** | Wechsel zwischen Dark und Light Mode |
| **Deutsch ▾** | Sprachauswahl (Deutsch, English, Français, Italiano) |

Auf Mobilgeräten wird die Navigation über ein **Burger-Menü** (☰) zugänglich, das ein Slide-in-Menü öffnet.

---

### 3. Länderübersicht

![Länderübersicht](https://github.com/user-attachments/assets/437f79d7-896d-4038-893f-1cfe8ccc456f)

Unter `/de/countries` ist der vollständige **Medaillenspiegel** aller teilnehmenden Nationen zu finden.

- Die Tabelle zeigt **Land, Bronze, Silber und Gold** Medaillen.
- Mit **„Weitere Einträge laden"** können alle Länder angezeigt werden (Standard: 50 Einträge).
- Ein Klick auf ein Land führt zur **Länderdetailseite**.
- Die Daten werden live von der Olympia-API abgerufen.

---

### 4. Länderdetails & Medaillen

Unter `/de/country/:country` werden die **Medaillendetails eines bestimmten Landes** angezeigt:

- Übersicht der gewonnenen Gold-, Silber- und Bronze-Medaillen.
- Für jede Medaille: Name des Athleten, Sportart und Medaillentyp als Karte.
- Schaltfläche **„Zurück"** führt wieder zur Länderübersicht.
- Die Daten werden von der API geladen (`GET /api/medals/country/{country}`).

---

### 5. Sportarten

Unter `/de/sports/:sportId` wird die **Detailseite einer Sportart** angezeigt.

Verfügbare Sportarten:

| Sportart | URL |
|---|---|
| Biathlon | `/de/sports/biathlon` |
| Bobsport | `/de/sports/bobsport` |
| Curling | `/de/sports/curling` |
| Eishockey | `/de/sports/eishockey` |
| Eiskunstlauf | `/de/sports/eiskunstlauf` |
| Skilanglauf | `/de/sports/skilanglauf` |
| Skispringen | `/de/sports/skispringen` |

Jede Seite zeigt:
- **Header** mit Sportart-Bild und Titel.
- **Ergebnistabelle** mit den aktuellen Wettkampfergebnissen der jeweiligen Sportart (aus API).

---

### 6. Login

![Login](https://github.com/user-attachments/assets/4cc0b0e5-0535-4cdd-9da3-a9370df6bdf0)

Die Login-Seite unter `/de/login` ermöglicht die Anmeldung für autorisierte Nutzer (Schiedsrichter & Admins):

- **Split-Layout**: Linke Seite zeigt ein Olympia-Bild, rechte Seite das Login-Formular.
- Eingabefelder für **Benutzername** und **Passwort**.
- Der **„Weiter"-Button** ist erst aktiv, wenn beide Felder ausgefüllt sind.
- Bei falschen Anmeldedaten wird eine Fehlermeldung angezeigt.
- Die Schaltfläche **„Zurück"** führt zur vorherigen Seite.
- Nach erfolgreicher Anmeldung wird automatisch zum **Dashboard** weitergeleitet.

> **Testaccounts (nur im Debug-Modus, falls API nicht erreichbar):**
> - Admin: `admin@test.com` / `admin`
> - Schiedsrichter: `referee@test.com` / `referee`

---

### 7. Schiedsrichter-Dashboard

![Dashboard](https://github.com/user-attachments/assets/7a593e6c-6316-4dcf-90f4-36ba443e0108)

Das Dashboard unter `/de/dashboard` ist für **Schiedsrichter und Admins** zugänglich und implementiert das **4-Augen-Prinzip**:

#### Ergebnis einreichen
- Klick auf **„Ergebnis hinzufügen"** öffnet ein Formular.
- Eingabe von: Sportart, Event, Athlet, Land, Ergebnis und optionalen Notizen.
- Nach dem Absenden erhält das Ergebnis den Status **„Ausstehend"**.

#### Ergebnisstatus-Workflow
| Status | Bedeutung | Farbe |
|---|---|---|
| **Ausstehend** | Eingereicht, wartet auf Genehmigung | 🟡 Gelb |
| **Genehmigt** | Von einem anderen Benutzer freigegeben | 🔵 Blau |
| **Veröffentlicht** | Öffentlich sichtbar | 🟢 Grün |

#### 4-Augen-Prinzip
- Ein Schiedsrichter **kann seine eigenen Einreichungen nicht genehmigen**.
- Erst nach Genehmigung durch eine andere Person kann das Ergebnis **veröffentlicht** werden.

#### Tabelle der eingereichten Ergebnisse
Zeigt alle Ergebnisse mit: Sportart/Event, Athlet, Land, Ergebnis, Einreicher, Status und Aktionsbuttons.

---

### 8. Admin-Dashboard

![Admin](https://github.com/user-attachments/assets/1a98ec56-daa8-49af-95a5-b779bd5903e6)

Das Admin-Dashboard unter `/de/admin` ist ausschließlich für **Administratoren** zugänglich.

#### Schiedsrichter verwalten
- Übersicht aller registrierten Schiedsrichter mit: Name, E-Mail, Land, Sportarten, Erstellungsdatum.
- **„Neuer Schiedsrichter"**: Formular zum Hinzufügen eines neuen Schiedsrichters (Name, E-Mail, Land, Sportarten kommagetrennt).
- **Löschen**: Einzelne Schiedsrichter können per Schaltfläche entfernt werden.

#### Ergebnisse verwalten
- Vollständige Übersicht aller eingereichten Ergebnisse mit Statusanzeige.
- **„Alle Ergebnisse löschen"**: Löscht alle Einträge auf einmal.
- Einzelne Ergebnisse können ebenfalls gelöscht werden.

---

### 9. Cookie-Banner & Rechtliches

Beim ersten Besuch erscheint am unteren Bildschirmrand ein **Cookie-Banner**:

- **„Alle akzeptieren"**: Akzeptiert alle Cookies.
- **„Optionale ablehnen"**: Akzeptiert nur notwendige Cookies.
- Die Einwilligung wird in der Session gespeichert.

Im **Footer** sind folgende rechtliche Seiten verlinkt:

| Seite | URL |
|---|---|
| Cookie-Richtlinie | `/de/cookie-policy` |
| Datenschutzbestimmungen | `/de/privacy-policy` |
| Nutzungsbedingungen | `/de/terms-of-service` |
| Barrierefreiheit | `/de/accessibility` |

---

### 10. Dark Mode & Sprache

#### Dark Mode
- Der Dark/Light Mode wird über das **Mond-/Sonnen-Symbol** (🌙/☀️) in der Navigation umgeschaltet.
- Die Einstellung wird im Browser (`localStorage`) gespeichert und beim nächsten Besuch wiederhergestellt.

#### Sprachauswahl
- Die Sprache kann über das **Sprachdropdown** in der Navigation gewechselt werden.
- Die URL-Sprache wird dabei aktualisiert (z.B. `/de` → `/en`).
- Unterstützte Sprachen: **Deutsch, Englisch, Französisch, Italienisch**.

---

## Lizenz

Copyright © 2026 Olympia IT Solutions. Alle Rechte vorbehalten.

