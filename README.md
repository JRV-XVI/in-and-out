# In & Out — Banco de Alimentos Jalisco

A mobile application built for **Banco de Alimentos Jalisco**, a social benefit organization dedicated to collecting food and goods and delivering them to families in need. This app digitizes and streamlines their donation and distribution operations, replacing fully manual administrative processes with structured, role-based automated workflows.

---

## Project Overview

**In & Out** manages the complete lifecycle of donation and support projects — from the moment a donor registers a contribution, through admin review and vehicle assignment, all the way to final delivery and completion. The app serves three types of users, each with tailored interfaces and permissions, enabling the organization to coordinate logistics more efficiently and with greater visibility.

---

## Features by Role

### 🧑 Donador (Donor)
- Register donation projects with details such as title, items, weight, load type, address, and photo evidence
- Track the status of active donations in real time
- View personal donation history and stats
- Export own project data as CSV

### 🚚 Responsable (Transport Operator)
- Browse validated projects compatible with registered vehicles
- Accept projects, triggering automatic vehicle assignment based on availability and compatibility
- Advance project state through transport milestones via action cards
- Manage personal vehicle registry and availability

### 🛠️ Admin
- Review and confirm or cancel pending donation projects
- Manage user accounts and send email invitations to new users
- Create outbound ("Salida") projects and assign volunteers
- Export the full project dataset as CSV
- Receive notifications for every new donor submission

---

## Project Lifecycle

Each project moves through the following states:

| State | Label |
|-------|-------|
| 0 | Cancelado |
| 1 | Pendiente *(awaiting admin review)* |
| 2 | Confirmado |
| 3 | En camino |
| 4 | Recolectado |
| 5 | Completado / Finalizado intermedio |
| 6 | Finalizado |

State transitions are triggered by role-appropriate action cards and persisted to the database in real time.

---

## Tech Stack

### Frontend
- **React Native** + **Expo**
- **TypeScript**
- **React Navigation** — stack navigation with modal side panels
- `react-native-modal`, `expo-image-picker`, `expo-file-system`, `expo-sharing`, `expo-document-picker`

### Backend
- **Supabase** — Authentication, PostgreSQL database, Storage, and Realtime subscriptions
- **Supabase Edge Functions** — serverless function for secure account deletion

---

## Architecture

The app follows a clean separation of concerns across four layers:

- **`context/`** — App-wide state management for authentication, user profile, and notifications (`AuthContext`, `UserContext`, `NotificationContext`)
- **`services/`** — All Supabase I/O logic (projects, users, vehicles, notifications)
- **`hooks/`** — Async wrappers around service calls for use in UI components
- **`screens/`** — Role-specific dashboards and views
- **`components/`** — Reusable UI elements and specialized project cards

Navigation is conditional: routing is determined at startup based on the authenticated session and the user's role, via `getInitialRoute(userType)`.

---

## Authentication & Session

- Supabase Auth with persistent sessions via `AsyncStorage`
- On app launch, `AuthContext` restores both the auth session and the cached user profile
- Supports a full **password reset flow** via deep link (`reset-password` route)
- Users can also change their password from within the settings screen

---

## Notifications

- Admins are notified automatically when a donor submits a new project
- Users can mark notifications as read, delete individual ones, or clear all
- Notification state is managed globally via `NotificationContext` with optimistic UI updates

---

## Vehicle Compatibility Logic

When a responsible user accepts a project, the app automatically selects the most suitable vehicle by filtering for:
- Vehicles marked as available (`isAvailable === true`)
- Vehicles not currently assigned to another project (`isInProject === false`)
- Matching `weightType` and `loadType` against the project's requirements

Upon project completion (state `6`), the assigned vehicle is automatically released back to available status.

---

## Media & Export

- **Photo evidence** can be captured via camera or selected from the gallery, and is uploaded to a Supabase Storage bucket (`evidences`)
- **CSV export** is role-scoped: donors see their own projects; admins can export the full dataset
- Export supports both web download and mobile file sharing

---

## Backend & Database

The app relies on the following Supabase resources:

**Tables:** `users`, `project`, `vehicle`, `notifications`

**Storage bucket:** `evidences`

**Edge Function:** Handles secure account deletion, removing records from both `public.users` and `auth.users`, cleaning up related vehicle and project references, and blocking deletion if the user has any active responsible projects (state ≠ `6`).

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file at the project root with the following:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

### 3. Run the app
```bash
npm run start     # Expo dev server
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

> **Note:** A running Supabase project with the required tables, storage bucket, and Edge Function deployed is required for the app to function correctly.

---

## Known Limitations

- No formal automated test suite (a demo screen `testDogs.tsx` is present for manual testing purposes)
- The search screen currently uses local sample data rather than live database queries
- The Expo app scheme (`myapp`) and some password reset URLs may need alignment before production deployment
- Codebase uses a mix of Spanish and English for identifiers and comments, reflecting the bilingual development context

---

## Future Improvements

- Implement live search against the Supabase database
- Add automated testing (unit and integration)
- Standardize deep-link scheme across the app
- Expand CSV export filters and reporting options
- Add push notification support for real-time mobile alerts
