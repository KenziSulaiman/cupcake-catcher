# Rblx — Product Requirements Document

## A Re-Engineered Social Gaming Platform for Teenagers

---

## 1. Executive Summary

Rblx is a next-generation social gaming platform designed specifically for teenagers (13–17), addressing critical safety failures found in existing platforms while delivering a psychologically-informed, accessible, and ethically-designed user experience.

**Core Differentiators:**

- Safety-first architecture — safety is a system design problem, not an afterthought
- AI-powered grooming detection with real-time risk scoring
- Parent-gated social features with granular controls
- Zero-tolerance anti-predator system with layered enforcement
- Premium, majestic dark UI built for teens
- WCAG 2.2 accessibility compliance

---

## 2. Target Audience

| Segment | Age | Role |
|---|---|---|
| Primary | 13–17 | Teen users — discover, play, socialize |
| Secondary | 25–55 | Parents/Guardians — approve, configure safety, monitor |

---

## 3. Account State Machine

All users begin in **Locked Mode**. Social features unlock only after parent approval.

```
                    ┌────────────────┐
                    │    Created     │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
              ┌─────│     Locked     │─────┐
              │     └───────┬────────┘     │
              │             │              │
              │     ┌───────▼────────┐     │
              │     │ ParentApproved │     │
              │     └───────┬────────┘     │
              │             │              │
              │     ┌───────▼────────┐     │
              │     │    Trusted     │     │
              │     └────────────────┘     │
              │                            │
      ┌───────▼────────┐        ┌─────────▼───────┐
      │   Restricted   │        │    Suspended     │
      └────────────────┘        └─────────────────┘
```

| State | Description | Social Access |
|---|---|---|
| Created | Account just registered | None |
| Locked | Default state — awaiting parent | Browse only, no chat/friends |
| ParentApproved | Parent verified and approved | Friends-only messaging |
| Trusted | Established good behavior | Full social (still monitored) |
| Restricted | Flagged by moderation | Read-only, no sending |
| Suspended | Severe violation | Fully locked, appeal only |

---

## 4. Core Features

### 4.1 Login / Signup

- **Fields:** Email, password, username, age (signup only)
- **Age gating:** 13–17 only. Under 13 blocked. Over 17 routed to standard experience.
- **Authentication:** Email + password or magic link
- **Post-login routing:** Based on account state (Locked → SafetyGate, Approved → Discover)

### 4.2 Parent-First Safety Gate

- Warm, illustrated onboarding explaining why safety matters
- Teen enters parent email → approval link sent
- Parent receives link and configures:
  - Friends-only messaging (default: ON)
  - Disable messaging entirely
  - Quiet hours (start/end times)
  - Report notifications
  - Link sharing (default: DISABLED)

**Edge cases:**
- Approval link expires after 48h → resend flow
- Parent denies → teen stays Locked, notified with friendly message
- Parent never responds → reminder at 24h and 48h

### 4.3 Discover (Home)

- Hero banner with safety branding
- Genre → Subgenre → Tags taxonomy
- Filter chips: genre, maturity rating, chat enabled, voice enabled
- Card-based grid with:
  - Thumbnail, title, genre/subgenre
  - Player count (live)
  - Star rating
  - Maturity badge (Everyone / Everyone 10+)
  - Safety metadata icons (chat, voice, links)

**Experience Safety Metadata:**

```json
{
  "chat_allowed": true,
  "voice_allowed": false,
  "maturity_rating": "Everyone",
  "link_sharing_allowed": false,
  "image_upload_allowed": false
}
```

### 4.4 Friends

- Friend list with online/offline status, currently playing info
- Trust badges (Trusted / New Friend)
- Friend request system with rate limiting (max 10/day)
- Pending requests with mutual friend count
- 1-tap Block + 1-tap Report always visible
- Search and filter (all/online/offline)

**Locked state:** Friends page shows locked state with link to Safety Gate.

### 4.5 Chat (Safety-First Messaging)

- Conversation list with safety labels (Friends Only, New Friend, Parent Approved)
- Real-time grooming detection with visual alerts
- Profanity filtering (all messages pass through filter)
- Safety hint in composer: "Never share your address, phone, or school name"
- Block/Report buttons always visible in chat header
- Flagged messages highlighted with red border + shield icon
- New friend warning banner for recently added contacts

**Demo feature:** Type "test groomer" to trigger simulated grooming detection.

### 4.6 Profile

- Avatar, display name, username, join date, friend count
- Account safety status card (Parent Approved, messaging mode, link sharing, trust level)
- Recently played experiences
- Badges earned
- Favorite experiences
- Stats (experiences played, hours, friends, reports)

### 4.7 Safety Dashboard

- **Overview tab:** Stats (threats blocked, messages scanned, reports filed, users blocked), safety score (0–100), protection checklist, grooming detection category breakdown
- **Threat Log tab:** Chronological event log with severity color coding, flagged messages from live sessions
- **Settings tab:** Toggle friends-only messaging, link blocking, quiet hours. Always-on protections listed as non-toggleable.

---

## 5. Anti-Predator System

### 5.1 Structural Prevention

| Control | Implementation |
|---|---|
| No stranger DMs | Messaging structurally blocked for non-friends |
| Friend request rate limiting | Max 10 requests/day per account |
| Age-band matching | Block messaging across large age gaps |
| External links disabled | Links stripped from all messages by default |
| Image uploads disabled | No image sharing in chat by default |

### 5.2 Grooming Detection Engine

Pattern-matching categories with severity scoring:

| Category | Examples | Severity Range |
|---|---|---|
| Age Probing | "how old are you", "what grade" | Medium |
| Location Probing | "where do you live", "what school" | High–Critical |
| Image Solicitation | "send me a pic", "show me what you look like" | High |
| Secrecy / Isolation | "don't tell your parents", "our secret" | Critical |
| Off-Platform Contact | "add me on snapchat", "what's your number" | High |
| Meetup Attempts | "can we meet up", "come to my place" | Critical |
| Flattery / Coercion | "you're so mature", "not like other kids" | Medium–High |

### 5.3 Risk Scoring

```
Per-message score = sum(severity_weights of matched patterns)
Account score = total_score × persistence_multiplier

Severity weights: low=1, medium=2, high=4, critical=8
Persistence multiplier: 2+ categories = 1.5x, 3+ categories = 2x
```

### 5.4 Auto Actions

| Account Score | Action |
|---|---|
| 5+ | FLAG_FOR_REVIEW — queued for human moderation |
| 10+ | SHADOW_RESTRICT — messages delayed, visibility reduced |
| 20+ | AUTO_BAN — immediate account suspension + device ban |

---

## 6. Profanity Masking

**Hard requirement:** All curse words replaced with exactly `######`.

- Evasion detection: leetspeak (`f*ck` → `fuck`), symbol substitution (`$h!t`), spacing (`f u c k`)
- Applied everywhere: chat messages, usernames, bios, experience titles, descriptions, comments
- Server-side authoritative (client filtering is supplementary)

---

## 7. Accessibility (WCAG 2.2)

| Requirement | Implementation |
|---|---|
| Minimum text size | 16px body, scaled headings |
| Focus states | 2px violet outline with 2px offset on `:focus-visible` |
| Keyboard navigation | Full tab order, Enter/Space activation |
| Tap targets | Minimum 44px interactive elements |
| Color contrast | AA compliant on dark surfaces |
| Reduced motion | `prefers-reduced-motion` disables all animations |
| Error states | Icons + text, never color alone |
| ARIA | Roles on navigation, menus, dialogs, alerts, switches |

---

## 8. Edge Cases

| Case | Handling |
|---|---|
| Parent approval link expires | Resend button in Safety Gate, 48h expiry |
| Parent denies approval | Teen stays Locked, friendly notification |
| Bypass via new accounts | Device fingerprint concept + registration rate limiting |
| Obfuscated links/phones | Leetspeak normalization + symbol stripping |
| Report spam / false reports | Rate-limited to 5 reports/day, mod review queue |
| Keyboard-only users | Full navigation without mouse |
| Reduced-motion users | All animations disabled via media query |
| Message during quiet hours | Queued, delivered when quiet hours end |

---

## 9. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Routing | react-router-dom 7 |
| Font | Inter (Google Fonts) |
| State | React Context (AuthContext, SafetyContext) |

---

## 10. File Structure

```
src/
├── main.jsx                    # Entry point with providers
├── App.jsx                     # Router setup
├── index.css                   # Tailwind + design tokens
├── context/
│   ├── AuthContext.jsx          # Auth state machine
│   └── SafetyContext.jsx        # Safety monitoring state
├── utils/
│   ├── profanityFilter.js       # Profanity detection + masking
│   └── groomerDetection.js      # Grooming pattern engine
├── components/
│   └── Layout/
│       ├── AppLayout.jsx        # Shell (nav + sidebar + outlet)
│       ├── TopNav.jsx           # Top navigation bar
│       └── Sidebar.jsx          # Left sidebar navigation
├── pages/
│   ├── Login.jsx                # Login / Signup
│   ├── SafetyGate.jsx           # Parent approval flow
│   ├── Discover.jsx             # Experience discovery
│   ├── Profile.jsx              # User profile
│   ├── Friends.jsx              # Friends list
│   ├── Chat.jsx                 # Messaging with safety
│   └── Safety.jsx               # Safety dashboard
└── docs/
    ├── PRD.md                   # This document
    └── BACKEND_SPEC.md          # Backend-ready API spec
```
