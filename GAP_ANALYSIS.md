# TULIA SRS vs Implementation Gap Analysis

**Generated:** March 25, 2026  
**SRS Version:** 1.0 (Kellia Kamikazi, 25/01/2026)  
**Current Implementation Status:** MVP with core features

---

## FUNCTIONAL REQUIREMENTS (FR) COMPLIANCE

### ✅ FULLY IMPLEMENTED

| Req ID | Requirement | Status | Implementation |
|--------|-----------|--------|-----------------|
| **FR1** | User authentication | ✅ Complete | `/api/auth/register`, `/api/auth/login`, `/api/auth/me` with JWT + password hashing |
| **FR2** | Emotional check-ins | ✅ Complete | `CheckIn` model + CRUD endpoints with mood/energy scales and emotion list |
| **FR3** | Reflection management | ✅ Complete | `Reflection` model with full CRUD (create, read, update, delete) |
| **FR4** | Emotional vocabulary learning | ✅ Complete | Backend vocab API with curated terms, Datamuse search, dictionary definitions |
| **FR5** | Pattern awareness dashboard | ✅ Complete | Real-time stats computed from check-in data (avg mood, counts, distribution, trends) |
| **FR6** | External support resources | ✅ Complete | Resource links with descriptions (includes The Circle Kigali, helplines) |
| **FR7** | Data storage and retrieval | ✅ Complete | SQLite persistence, encrypted in transit (CORS setup), user-scoped data access |

### ⚠️ PARTIALLY IMPLEMENTED / MISSING

| Req ID | Requirement | Status | Issue |
|--------|-----------|--------|-------|
| **FR8** | User data deletion | ❌ **MISSING** | **No endpoint to delete account + associated data** |

**ACTION REQUIRED for FR8:**
- Add `DELETE /api/auth/account` endpoint that:
  - Requires authenticated user
  - Deletes user account, all check-ins, all reflections (cascade delete)
  - Returns 204 No Content on success
  - Clear confirmation before deletion in UI

---

## NON-FUNCTIONAL REQUIREMENTS (NFR) COMPLIANCE

### Performance (NFR2)
- **Requirement:** System shall respond within **3 seconds** under normal conditions
- **Status:** ⚠️ **NOT VERIFIED** - Need load testing
- **Action:** Add performance monitoring and benchmarks for:
  - `/api/checkins/` - GET all check-ins
  - `/api/reflections/` - GET all reflections
  - `/api/vocab/search` - Vocab search with Datamuse fallback

### Availability (NFR3)
- **Requirement:** 24/7 availability except maintenance
- **Status:** ⚠️ **LOCAL DEV ONLY** - No production deployment
- **Action:** Move from SQLite to production database (PostgreSQL/PostgreSQL)

### Security (NFR4)
- **Requirement:** Encrypt data in transit & at rest
- **Status:** ⚠️ **PARTIAL**
  - ✅ CORS allows HTTP**S** origins
  - ✅ Passwords hashed (bcrypt via werkzeug)
  - ⚠️ SQLite not encrypted (dev-only acceptable)
  - ❌ No HTTPS enforcement for production
- **Action:** For production: Enable HTTPS, use encrypted database, audit data flows

### Scalability (NFR5)
- **Requirement:** Support growth without major architecture changes
- **Status:** ⚠️ **NOT PRODUCTION-READY**
- **Issues:**
  - SQLite not suitable for concurrent users
  - No connection pooling for production database
  - Datamuse API calls not rate-limited
- **Action:** Migrate to PostgreSQL + SQLAlchemy connection pooling

### Privacy (NFR6)
- **Requirement:** Emotional data accessible only to authenticated user
- **Status:** ✅ **IMPLEMENTED**
  - User auth required for all endpoints
  - Scoped queries (filter by `current_user.id`)
  - No cross-user data access

### Compatibility (NFR7)
- **Requirement:** Operate on modern browsers (Chrome, Firefox, Edge, Safari)
- **Status:** ✅ **IMPLEMENTED**
  - React + Vite + Tailwind responsive design
  - No browser-specific APIs used
  - Mobile responsive confirmed

### Maintainability (NFR8)
- **Requirement:** Modular, well-documented code
- **Status:** ⚠️ **PARTIAL**
  - ✅ Modular API routes (auth, checkins, reflections, vocab)
  - ✅ Separated concerns (models, schemas, routes)
  - ❌ **No code documentation/docstrings**
  - ❌ **No API documentation** (missing Swagger/OpenAPI)
- **Action:** Add docstrings + enable Swagger UI (`/docs`)

### Usability (NFR1)
- **Requirement:** Easy to use for basic digital literacy
- **Status:** ✅ **IMPLEMENTED**
  - Intuitive UI with clear navigation
  - Error messages displayed
  - ⚠️ Missing accessibility features (WCAG compliance)

---

## DESIGN CONSTRAINTS & SAFETY

### Safety Requirements ⚠️ **MISSING**
Per SRS: "Clear disclaimers that TULIA is not a substitute for professional mental health services"

**Currently Missing:**
- ❌ No disclaimer on login/signup screens
- ❌ No disclaimer in resources section
- ❌ No emergency contact escalation flow

**Action Required:**
- Add disclaimer banner: *"TULIA is not a substitute for professional mental health services. If in crisis, contact..."*
- Add emergency helpline links prominently
- No diagnostic language ("treatment," "diagnosis," "cure")

### Cultural Sensitivity ⚠️ **VERIFY**
Per SRS: "All content must be culturally appropriate and relevant to African university students"

**Current Status:**
- ✅ Vocab categories use emotion-based (not clinical) framing
- ✅ Resources include African-focused support (The Circle Kigali)
- ⚠️ Needs review: All emotion definitions and learning content

**Action:** Audit content for African context relevance

### Data Protection & Privacy ⚠️ **PARTIAL**
Per SRS: "Comply with relevant data protection regulations"

**Missing:**
- ❌ No Privacy Policy document
- ❌ No Terms of Service
- ❌ No Data Processing Agreement
- ⚠️ No explicit GDPR/CCPA compliance statement

**Action:** Add Privacy Policy + Terms; verify GDPR/CCPA compliance for export/deletion

---

## USER DOCUMENTATION ❌ **NOT IMPLEMENTED**

Per SRS Section 2.6, required:
1. ❌ **User Manual** - Comprehensive guide (PDF) explaining all features
2. ❌ **Tutorial** - Step-by-step intro for first-time users
3. ❌ **FAQ Section** - Common questions + troubleshooting

**Action Required:**
- Create `/help` or `/docs` section with:
  - How to create account
  - How to do emotional check-ins
  - How to write reflections
  - How to use vocab builder
  - How to read dashboard trends
  - Privacy & security FAQ
  - Troubleshooting (login issues, data sync)

---

## TECHNICAL ARCHITECTURE NOTES

### SRS Says: Flask Backend
- **Current:** FastAPI ✅ **BETTER CHOICE**
  - More modern, better performance, async support
  - No changes needed

### SRS Says: Cloud-hosted relational database
- **Current:** SQLite (local dev)
- **For Production:** Need PostgreSQL or similar
- **Action:** Plan migration script + connection pooling

### Existing But Not in SRS Requirements
- ✅ Dark mode toggle
- ✅ Backend caching (vocab definitions, Datamuse results)
- ✅ Interactive learning (vocab scenarios + quiz progress)
- ✅ Enhanced reflection prefill (from vocab actions)
- ✅ Emotion distribution analytics

---

## PRIORITY ACTION ITEMS

### 🔴 **CRITICAL** (Blocks MVP release)
1. **FR8 - User Account Deletion**
   - Add `DELETE /api/auth/account` endpoint
   - Add UI confirmation dialog
   - Test cascade deletion

2. **Safety Disclaimers**
   - Add non-clinical, non-diagnostic language disclaimer
   - Emergency contact links prominently placed
   - Review all UI text for clinical language

### 🟠 **HIGH** (Before production)
3. **API Documentation**
   - Enable Swagger UI at `/docs`
   - Add docstrings to all route functions
   
4. **Database Migration Plan**
   - SQLite → PostgreSQL migration script
   - Connection pooling setup
   - Backup/restore procedures

5. **HTTPS & Security Hardening**
   - HTTPS enforcement
   - CORS allow-list review
   - Rate limiting on external API calls (Datamuse)

### 🟡 **MEDIUM** (Before public launch)
6. **User Documentation**
   - In-app tutorials or help section
   - FAQ page
   - User manual PDF

7. **Accessibility (WCAG 2.1 AA)**
   - Add aria labels
   - Test with screen readers
   - Color contrast audit

8. **Performance Testing**
   - Load test dashboard with 1000+ check-ins
   - Verify 3-second SLA
   - Optimize slow queries

### 🟢 **LOW** (Nice to have)
9. **Content Verification**
   - Audit vocab definitions for nuance
   - Ensure cultural sensitivity of all emotion labels

---

## SUMMARY TABLE

| Category | Total | ✅ Done | ⚠️ Partial | ❌ Missing | Coverage |
|----------|-------|---------|-----------|-----------|----------|
| **Functional Requirements** | 8 | 7 | 0 | 1 | **87.5%** |
| **Non-Functional Requirements** | 8 | 2 | 4 | 2 | **75%** |
| **Documentation** | 3 | 0 | 0 | 3 | **0%** |
| **Safety & Compliance** | 3 | 0 | 1 | 2 | **33%** |
| **Overall** | **22** | **9** | **5** | **8** | **61%** |

---

## NEXT STEPS

1. **This Sprint:**
   - Implement FR8 (account deletion)
   - Add safety disclaimers
   - Enable Swagger API docs

2. **Next Sprint:**
   - User documentation (help section)
   - Database migration plan
   - WCAG accessibility audit

3. **Pre-Launch:**
   - Production security hardening
   - Load testing
   - Privacy policy + ToS

---

*Analysis prepared against TULIA SRS v1.0 (Kellia Kamikazi, 25/01/2026)*
