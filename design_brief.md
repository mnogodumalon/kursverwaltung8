# Design Brief: Kursverwaltung (Course Management System)

## 1. App Analysis
- A comprehensive course management system for managing courses, instructors, participants, rooms, and enrollments. Users can create/edit/delete all entities and track which participants are enrolled in which courses.
- Who uses this: Course administrators at education centers, training companies, or community colleges.
- The ONE thing users care about most: Quick overview of active courses and easy enrollment management.
- Primary actions: Create/manage courses, register participants, assign instructors and rooms, track enrollments and payments.

## 2. What Makes This Design Distinctive
- Visual identity: Academic/professional feel with warm tones - a refined indigo accent on warm cream background, conveying trust and education.
- Layout strategy: Tab-based navigation for 5 entity types, with a hero dashboard showing key metrics (active courses, enrolled participants, revenue). Each tab has a clean data table with inline actions.
- Unique element: A colored status pill system for enrollment/payment status, and a floating action button that contextually creates the entity for the active tab.

## 3. Theme & Colors
- Font: Plus Jakarta Sans (professional, geometric, excellent readability for data)
- Google Fonts URL: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap
- Why: Professional yet approachable, great for data-heavy interfaces, distinctive geometric forms

- Color palette:
  - Background: hsl(40, 33%, 98%) - warm cream
  - Card: hsl(0, 0%, 100%) - white
  - Primary: hsl(234, 62%, 47%) - rich indigo
  - Primary foreground: hsl(0, 0%, 100%) - white
  - Secondary: hsl(234, 40%, 96%) - light indigo tint
  - Accent: hsl(158, 60%, 42%) - teal green for success/paid
  - Destructive: hsl(0, 72%, 51%) - red for unpaid/delete
  - Muted: hsl(40, 10%, 95%) - warm gray
  - Muted foreground: hsl(234, 10%, 45%) - medium gray
  - Border: hsl(234, 15%, 90%) - subtle indigo-tinted border

## 4. Mobile Layout
- Single column, full-width
- Header with app name + hero KPI row (horizontal scroll)
- Tab bar below hero for entity navigation
- Active tab shows entity list as cards (not table)
- Floating action button bottom-right for creating new entities
- Touch-friendly: All buttons minimum 44px, cards have full-width tap targets

## 5. Desktop Layout
- Max-width 1400px centered container
- Top: App header with name
- Below: 3 hero KPI cards in a row (active courses, total participants, revenue)
- Below hero: Tab navigation (Kurse, Dozenten, Teilnehmer, Raume, Anmeldungen)
- Active tab: Data table with columns, sort, inline edit/delete actions
- Create button in tab header area (top right of content)

## 6. Components
- **Hero KPIs**: 3 cards - Active Courses (count), Enrolled Participants (count), Total Revenue (sum of paid enrollments)
- **Tab Navigation**: 5 tabs with icons - Kurse, Dozenten, Teilnehmer, Raume, Anmeldungen
- **Data Tables**: One per entity type with all fields, edit/delete row actions
- **Create/Edit Dialogs**: Modal forms for each entity type
- **Delete Confirmation**: Alert dialog before deletion
- **Primary Action Button**: "Neu erstellen" button, contextual to active tab
- **Status Badges**: Payment status (Bezahlt/Offen), course status (Aktiv/Beendet/Geplant)

## 7. Visual Details
- Border radius: 12px for cards, 8px for inputs/buttons
- Shadows: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06) for cards
- Spacing: 24px page padding, 16px card padding, 8px element gaps
- Animations: Subtle fade-in for tab content, smooth dialog transitions
- Table rows: Hover with indigo-tinted background

## 8. CSS Variables
```css
:root {
  --background: 40 33% 98%;
  --foreground: 234 25% 15%;
  --card: 0 0% 100%;
  --card-foreground: 234 25% 15%;
  --popover: 0 0% 100%;
  --popover-foreground: 234 25% 15%;
  --primary: 234 62% 47%;
  --primary-foreground: 0 0% 100%;
  --secondary: 234 40% 96%;
  --secondary-foreground: 234 25% 25%;
  --muted: 40 10% 95%;
  --muted-foreground: 234 10% 45%;
  --accent: 234 40% 96%;
  --accent-foreground: 234 25% 25%;
  --destructive: 0 72% 51%;
  --border: 234 15% 90%;
  --input: 234 15% 90%;
  --ring: 234 62% 47%;
  --radius: 0.75rem;
  --chart-1: 234 62% 47%;
  --chart-2: 158 60% 42%;
  --chart-3: 40 90% 55%;
  --chart-4: 0 72% 51%;
  --chart-5: 280 60% 50%;
}
```
