# Multi-Dialect Translate & 36-State Nigeria Power Grid Maps

A comprehensive upgrade to CaseBox Utility adding a clean **Translate** header dropdown with regional African languages and Jamaican Patois, alongside a dedicated **Nigeria Grid Maps** page featuring all 36 states and the Federal Capital Territory grouped across Nigeria's six geopolitical zones, detailing high-voltage transmission substations and grid injection points.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed in Phase 1:
> - **State Map Content**: Displaying high-voltage power transmission substations (330kV/132kV) and Transmission Company of Nigeria (TCN) / DISCO grid injection points for each state.
> - **Layout Structure**: Responsive grid of state cards with expandable Google Maps embeds, filterable by the six geopolitical zones and instant state search.
> - **Translate Feature**: Clean header button labeled simply **"Translate"** (zero vendor branding in the UI) triggering an integrated translation menu with support for Nigerian languages, Benin/Togo/Ghanaian languages, and Jamaican Patois.

---

## 1. Overview & Core Concept

### What It Delivers
1. **White-Labeled Translate Header Dropdown**:
   - A single clean button in the header labeled strictly **"Translate"**.
   - Custom styled dropdown menu categorized into:
     - **Major Nigerian Languages & Dialects**: Nigerian Pidgin, Yoruba, Hausa, Igbo, Kanuri, Tiv, Fulani (Fulfulde), Ijaw, Urhobo, Ibibio, Ikwerre, Edo (Bini), Igala, Nupe, Ebira.
     - **West African Neighbors (Benin, Togo, Ghana)**: Twi (Akan), Ga, Fante, Ewe, Fon, Gen (Mina), Dagbani, Bariba.
     - **Cultural Diaspora**: Jamaican Patois.
   - Connects to web translation engine while keeping the interface styled in CaseBox Utility navy and orange.

2. **Dedicated "Nigeria Grid Maps" Page (`activeTab: 'maps'`)**:
   - Adds a **"Grid Maps"** tab to desktop and mobile navigation.
   - Full directory of all **36 Nigerian States + Abuja FCT** categorized into the **Six Geopolitical Zones**:
     - **South-West** (Lagos, Ogun, Oyo, Osun, Ondo, Ekiti)
     - **South-South** (Rivers, Delta, Edo, Akwa Ibom, Bayelsa, Cross River)
     - **South-East** (Enugu, Anambra, Abia, Imo, Ebonyi)
     - **North-Central** (Abuja FCT, Niger, Kogi, Benue, Plateau, Kwara, Nasarawa)
     - **North-West** (Kano, Kaduna, Katsina, Sokoto, Kebbi, Zamfara, Jigawa)
     - **North-East** (Borno, Bauchi, Adamawa, Gombe, Taraba, Yobe)
   - Interactive grid of state cards displaying:
     - State capital, franchised DISCO, and operational zone.
     - Key **330kV / 132kV transmission substations** (e.g., Ikeja West, Egbin, Oshogbo National Control Centre, Kainji, Shiroro, Afam, Ughelli, Jebba, Katampe, etc.).
     - Primary **grid injection points & 33kV feeder interfaces**.
     - Expand/collapse interactive Google Maps embed focused on the state's transmission substations with custom pin markers and satellite/roadmap toggle.

---

## 2. User Experience & Visual Design

### Header Translate Experience
- Sits seamlessly in Zone 3 of the header next to Customer Login / Dashboard.
- Pill-free, styled with navy background `#0c1833` and subtle orange border `border-orange-500/30`.
- Clicking opens a categorized flyout modal with search filtering to quickly find any language or dialect.
- Switching language updates page text instantly with active selection highlighted.

### Nigeria Grid Maps Page Experience
- **Hero & Zone Filter Toolbar**:
  - Clear overview: *"Nigeria National Grid & Transmission Substation Directory"*.
  - Six geopolitical zone filter pills (All, South-West, South-South, South-East, North-Central, North-West, North-East) + live search input by state name or substation.
- **State Card Grid**:
  - Responsive 1-col / 2-col / 3-col grid (`max-w-7xl`).
  - Card header: State name, capital, DISCO badge, and zone.
  - Substation badge list detailing the 330kV and 132kV transmission infrastructure.
  - **"View Transmission Map"** button: expands an interactive Google Map centered on the state's primary power hubs with coordinates and facility details.

```
┌────────────────────────────────────────────────────────────────────────┐
│ [CaseBox Utility]  Vend | Retrieve | Saved | Tariff | Dashboard | Maps │ [Translate ▼] [Login]
├────────────────────────────────────────────────────────────────────────┤
│  NIGERIA NATIONAL GRID MAPS & TRANSMISSION SUBSTATIONS                 │
│  Explore 36 states and FCT across 6 geopolitical zones                 │
│  [Search state or substation...]                                       │
│  [All] [South-West] [South-South] [South-East] [North-Central] [NW] [NE]│
├────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────┐ │
│  │ LAGOS STATE           │  │ OYO STATE             │  │ RIVERS      │ │
│  │ Zone: South-West      │  │ Zone: South-West      │  │ South-South │ │
│  │ DISCO: IKEDC / EKEDC  │  │ DISCO: IBEDC          │  │ PHEDC       │ │
│  │ Substations:          │  │ Substations:          │  │             │ │
│  │ • Ikeja West (330kV)  │  │ • Ayede (330/132kV)   │  │ • Afam      │ │
│  │ • Egbin Gen / Switch  │  │ • Jericho (132kV)     │  │ • Port Hct  │ │
│  │ • Akoka / Alagbon     │  │ • Oyo Town Substation │  │             │ │
│  │ [▼ Expand State Map]  │  │ [▼ Expand State Map]  │  │ [▼ Expand]  │ │
│  │ ┌───────────────────┐ │  └───────────────────────┘  └─────────────┘ │
│  │ │ Google Map Embed  │ │                                             │
│  │ │ Lat/Lng + Hubs    │ │                                             │
│  │ └───────────────────┘ │                                             │
│  └───────────────────────┘                                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Technical Architecture & Implementation Steps

### 1. Header Language Dropdown (`TranslateDropdown.tsx`)
- Lightweight, zero-external dependency dropdown component.
- Curated linguistic list of 25+ West African dialects and Jamaican Patois with native language titles and ISO codes.
- Mounts and coordinates the translation bridge.

### 2. Comprehensive Nigeria Transmission Grid Dataset (`nigeriaGridData.ts`)
- Complete data structure covering all 36 States + FCT:
  - `name`, `code`, `capital`, `zone` (South-West, South-South, South-East, North-Central, North-West, North-East).
  - `disco`: Primary electricity distribution company.
  - `coordinates`: `{ lat: number, lng: number, zoom: number }`.
  - `substations`: Array of key 330kV / 132kV substations with capacity and location.
  - `gridInjectionPoints`: Key regional feeder connections supplying the distribution network.

### 3. Nigeria Grid Maps Page Component (`NigeriaGridMaps.tsx`)
- Geopolitical zone selector tabs with active state counts.
- Search filter for states, DISCOs, or specific substation names.
- Individual state cards featuring expandable Google Maps embeds.
- Embed utilizes Google Maps Embed API or Maps JS SDK with responsive 16:9 / 4:3 container aspect ratios and explicit minimum heights (`h-80`) preventing collapse.

### 4. Navigation & Route Updates (`Header.tsx`, `App.tsx`, `Footer.tsx`)
- Add `'maps'` to `activeTab` union: `'vend' | 'lookup' | 'saved' | 'tariff' | 'dashboard' | 'maps' | 'admin'`.
- Add **"Grid Maps"** to desktop nav and mobile nav.
- Add **Translate** dropdown to the top right header action area.
- Connect **"Nigeria Grid Maps"** link in the Footer under Services.

---

## 4. Verification & Testing Checklist
- [ ] Verify Translate dropdown contains Nigerian Pidgin, Yoruba, Hausa, Igbo, Kanuri, Tiv, Fulani, Fon, Ewe, Ga, Twi, Ijaw, Urhobo, Ibibio, Ikwerre, and Jamaican Patois.
- [ ] Verify button is labeled strictly **"Translate"** without any vendor brand names.
- [ ] Verify all 36 states and FCT are present and properly classified across the 6 political zones.
- [ ] Verify power transmission substations and grid injection points are accurately populated for each state.
- [ ] Verify each state card expands cleanly with a responsive embedded map.
- [ ] Run `compile_applet` and `lint_applet` to ensure error-free compilation.
