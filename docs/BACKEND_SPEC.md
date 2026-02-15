# Rblx — Backend-Ready API Specification

## Mocked for MVP, production-ready schema

---

## 1. Authentication API

### POST `/api/auth/signup`

```json
// Request
{
  "email": "teen@example.com",
  "username": "CoolPlayer99",
  "password": "hashed_client_side",
  "age": 15
}

// Response 201
{
  "user_id": "u_abc123",
  "account_state": "locked",
  "token": "jwt_token",
  "requires_parent_approval": true
}

// Error 400
{
  "error": "AGE_OUT_OF_RANGE",
  "message": "Rblx is designed for teens aged 13-17"
}
```

### POST `/api/auth/login`

```json
// Request
{
  "email": "teen@example.com",
  "password": "hashed_client_side"
}

// Response 200
{
  "user_id": "u_abc123",
  "account_state": "parent_approved",
  "token": "jwt_token",
  "safety_settings": {
    "friends_only_messaging": true,
    "link_sharing_disabled": true,
    "quiet_hours": { "enabled": false, "start": "22:00", "end": "07:00" }
  }
}
```

---

## 2. Account State Machine API

### GET `/api/account/state`

Returns current account state and permissions.

```json
// Response 200
{
  "user_id": "u_abc123",
  "state": "parent_approved",
  "permissions": {
    "can_message": true,
    "can_add_friends": true,
    "can_browse": true,
    "can_share_links": false,
    "can_upload_images": false,
    "can_voice_chat": false
  },
  "restrictions": [],
  "safety_score": 92
}
```

### State Transitions

| From | To | Trigger |
|---|---|---|
| created | locked | Automatic on signup |
| locked | parent_approved | Parent approves via link |
| parent_approved | trusted | 30+ days good behavior, 0 flags |
| any | restricted | Moderation flag (score 10+) |
| any | suspended | Auto-ban (score 20+) or manual |
| restricted | parent_approved | Mod review clears account |
| suspended | locked | Successful appeal |

---

## 3. Parent Approval API

### POST `/api/parent/request`

```json
// Request
{
  "teen_user_id": "u_abc123",
  "parent_email": "parent@example.com"
}

// Response 200
{
  "request_id": "pr_xyz789",
  "expires_at": "2025-07-03T00:00:00Z",
  "status": "pending"
}
```

### POST `/api/parent/approve`

```json
// Request (from parent's approval link)
{
  "request_id": "pr_xyz789",
  "parent_token": "secure_token",
  "safety_settings": {
    "friends_only_messaging": true,
    "disable_messaging": false,
    "quiet_hours": { "enabled": true, "start": "22:00", "end": "07:00" },
    "link_sharing_disabled": true,
    "report_notifications": true
  }
}

// Response 200
{
  "teen_user_id": "u_abc123",
  "new_state": "parent_approved",
  "settings_applied": true
}
```

### POST `/api/parent/deny`

```json
// Request
{
  "request_id": "pr_xyz789",
  "parent_token": "secure_token"
}

// Response 200
{
  "teen_user_id": "u_abc123",
  "state": "locked",
  "teen_notified": true
}
```

---

## 4. Messaging API

### POST `/api/messages/send`

All messages pass through server-side pipeline before delivery.

```json
// Request
{
  "conversation_id": "c_abc123",
  "sender_id": "u_abc123",
  "recipient_id": "u_def456",
  "text": "hey want to play?"
}

// Response 200 (message accepted)
{
  "message_id": "m_12345",
  "filtered_text": "hey want to play?",
  "delivered": true,
  "safety_flags": []
}

// Response 200 (message flagged)
{
  "message_id": "m_12346",
  "filtered_text": "######",
  "delivered": true,
  "safety_flags": [
    {
      "category": "profanity",
      "severity": "low",
      "action": "filtered"
    }
  ]
}

// Response 403 (blocked)
{
  "error": "MESSAGE_BLOCKED",
  "reason": "STRANGER_DM_BLOCKED",
  "message": "You can only message friends"
}
```

### Message Processing Pipeline

```
1. AUTHENTICATION — verify sender JWT
2. PERMISSION CHECK — are they friends? Is sender restricted?
3. QUIET HOURS CHECK — is recipient in quiet hours? → queue
4. PROFANITY FILTER — scan + replace with ######
   ├── Direct match
   ├── Leetspeak normalization (0→o, 3→e, 4→a, $→s, !→i)
   ├── Symbol/space stripping
   └── Replace all matches with exactly: ######
5. GROOMING DETECTION — pattern match against categories
   ├── age_probing
   ├── location_probing
   ├── image_solicitation
   ├── secrecy
   ├── off_platform
   ├── meetup
   └── flattery_coercion
6. LINK DETECTION — strip URLs if link_sharing_disabled
7. RISK SCORING — update sender's cumulative risk score
8. AUTO ACTIONS — based on risk score thresholds
   ├── score >= 5  → FLAG_FOR_REVIEW
   ├── score >= 10 → SHADOW_RESTRICT
   └── score >= 20 → AUTO_BAN + DEVICE_BAN
9. DELIVER — send to recipient via WebSocket
10. LOG — store in moderation audit trail
```

---

## 5. Grooming Detection API

### POST `/api/safety/analyze`

```json
// Request
{
  "user_id": "u_suspect",
  "message": "how old are you? you seem really mature"
}

// Response 200
{
  "flags": [
    { "category": "age_probing", "severity": "medium", "label": "Age Probing" },
    { "category": "flattery_coercion", "severity": "medium", "label": "Flattery / Coercion" }
  ],
  "risk_score": 4,
  "risk_level": "medium",
  "has_critical": false
}
```

### GET `/api/safety/account-risk/:userId`

```json
// Response 200
{
  "user_id": "u_suspect",
  "cumulative_score": 14,
  "risk_level": "high",
  "category_counts": {
    "age_probing": 3,
    "off_platform": 2,
    "flattery_coercion": 1
  },
  "recommendation": "SHADOW_RESTRICT",
  "flagged_message_count": 6,
  "last_flag_at": "2025-07-01T14:32:00Z"
}
```

---

## 6. Reporting API

### POST `/api/reports/create`

```json
// Request
{
  "reporter_id": "u_abc123",
  "target_id": "u_suspect",
  "reason": "Asking personal questions",
  "evidence": "Asked my age and school multiple times",
  "conversation_id": "c_xyz789"
}

// Response 201
{
  "report_id": "rpt_001",
  "status": "pending",
  "priority": "high",
  "estimated_review": "< 1 hour",
  "auto_actions_taken": ["shadow_restrict_target"]
}
```

### Rate Limiting

- Max 5 reports per user per day
- Duplicate reports on same target within 24h → merged
- False report detection: if 3+ reports dismissed, reporter warned

---

## 7. Block API

### POST `/api/blocks/create`

```json
// Request
{
  "blocker_id": "u_abc123",
  "blocked_id": "u_suspect"
}

// Response 200
{
  "block_id": "blk_001",
  "effects": [
    "blocked_user_cannot_message_you",
    "blocked_user_cannot_see_your_profile",
    "blocked_user_removed_from_friends",
    "you_will_not_see_blocked_user"
  ]
}
```

---

## 8. Friend Request API

### POST `/api/friends/request`

```json
// Request
{
  "sender_id": "u_abc123",
  "target_id": "u_def456"
}

// Response 200
{
  "request_id": "fr_001",
  "status": "pending"
}

// Response 429 (rate limited)
{
  "error": "RATE_LIMITED",
  "message": "You can send up to 10 friend requests per day",
  "retry_after": "2025-07-02T00:00:00Z"
}
```

### Anti-Spam Rules

- Max 10 friend requests per day
- Cannot re-request within 7 days of decline
- Age-band validation: flag requests with 4+ year age gap
- New accounts (< 24h) limited to 3 requests/day

---

## 9. Experience Discovery API

### GET `/api/experiences?genre=adventure&maturity=Everyone&page=1`

```json
// Response 200
{
  "experiences": [
    {
      "id": "exp_001",
      "title": "Adopt Me!",
      "genre": "roleplay",
      "subgenre": "Pet Sim",
      "tags": ["Family Friendly", "Pets", "Trading"],
      "players_online": 142000,
      "rating": 4.8,
      "thumbnail_url": "/thumbs/exp_001.webp",
      "safety": {
        "chat_allowed": true,
        "voice_allowed": false,
        "maturity_rating": "Everyone",
        "link_sharing_allowed": false,
        "image_upload_allowed": false
      }
    }
  ],
  "total": 847,
  "page": 1,
  "per_page": 20
}
```

### Taxonomy

```
Genre (top level)
├── Adventure
│   ├── RPG
│   ├── Open World
│   └── Exploration
├── Roleplay
│   ├── Life Sim
│   ├── Pet Sim
│   └── Fashion
├── Obby
│   ├── Parkour
│   └── Challenge
├── Simulator
│   ├── Collector
│   └── Survival
├── Social
│   ├── Hangout
│   └── Party
├── Horror
│   ├── Mystery
│   └── Escape
├── Tycoon
│   ├── Building
│   └── Management
└── Fighting
    ├── FPS
    └── Melee
```

---

## 10. Device Fingerprinting (Concept)

For bypass prevention (new account creation to evade bans):

```json
// Collected on registration
{
  "device_id": "hash_of(user_agent + screen_res + timezone + language + webgl_renderer)",
  "ip_hash": "sha256(ip_address)",
  "registration_timestamp": "2025-07-01T12:00:00Z"
}

// Rules
// - If device_id matches a suspended account → block registration
// - If 3+ accounts from same device_id in 24h → rate limit
// - If ip_hash matches known bad actor → enhanced monitoring
```

---

## 11. Moderation Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐
│  Automated   │────▶│  Review Queue │────▶│  Human Review  │
│  Detection   │     │  (prioritized)│     │  (< 1 hour)    │
└─────────────┘     └──────────────┘     └────────────────┘
       │                    │                      │
       ▼                    ▼                      ▼
  Auto Actions:        Queue Priority:        Human Actions:
  - Filter msg         - Critical: 15min      - Clear / Dismiss
  - Shadow restrict    - High: 1 hour         - Warn user
  - Auto ban           - Medium: 4 hours      - Restrict
  - Device ban         - Low: 24 hours        - Suspend
                                               - Device ban
                                               - Law enforcement referral
```

---

## 12. WebSocket Events

```json
// Message received
{ "event": "message:new", "data": { "message_id": "m_123", "conversation_id": "c_456", "text": "filtered text", "sender": { "id": "u_789", "display_name": "Sophie" }, "timestamp": "2025-07-01T15:30:00Z" } }

// Safety alert (to recipient)
{ "event": "safety:alert", "data": { "conversation_id": "c_456", "flags": [{ "category": "age_probing", "severity": "medium" }], "suggested_action": "report_or_block" } }

// Account state change
{ "event": "account:state_change", "data": { "new_state": "parent_approved", "permissions_updated": true } }

// Friend request
{ "event": "friend:request", "data": { "from": { "id": "u_new", "display_name": "Ethan", "mutual_count": 3 } } }
```
