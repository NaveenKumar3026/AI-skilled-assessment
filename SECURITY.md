# Security Architecture & Hardening Guide — SkillSet AI RPL Platform

This document describes the security principles, hardening mechanisms, access controls, AI safety measures, and threat model implemented for the **SkillSet AI: AI-Assisted Recognition of Prior Learning (RPL)** platform.

---

## 1. Security Principles

SkillSet AI handles sensitive candidate data including personal identity information, employment history, RPL assessment answers, practical task videos/audio, assessor comments, and government-aligned NSQF certifications.

The system is engineered according to core security principles:

1. **Defense in Depth**: Security controls operate across multiple layers—reverse proxy headers, network CORS filters, rate limiters, authentication tokens, session registries, RBAC middleware, object-level ownership checks, and schema validation.
2. **Least Privilege**: Users operate solely within the permissions necessary for their assigned role (`CANDIDATE`, `ASSESSOR`, `ADMIN`).
3. **Secure Defaults**: Strict CORS policies, HttpOnly/SameSite cookies, fail-fast environment validation, and conservative rate limiting.
4. **Input Authoritativeness**: Every request body, parameter, and query string is parsed and validated server-side using strict Zod schemas; client-supplied inputs are never trusted.
5. **Data Minimization**: Personal identifiable information (PII) is restricted to necessary fields; Aadhaar numbers are explicitly excluded in this release.
6. **Error Isolation**: Error messages returned to clients conceal internal implementation details, database internals, stack traces, and local filesystem paths.
7. **Human Oversight of AI**: AI operates strictly as an advisory system. Automated models are programmatically prohibited from approving certifications or altering official candidate records.

---

## 2. Authentication & Session Architecture

### Argon2id Password Hashing with Legacy Bcrypt Migration
- **Primary Algorithm**: Argon2id (`hash-wasm`), configured with 64MB memory cost, 3 iterations, and 4 parallel threads.
- **Backward Compatibility**: Existing bcrypt hashes are automatically verified and dynamically migrated to Argon2id upon successful authentication without service interruption.
- **Brute Force Protection**: Failed login attempts trigger progressive delays and account throttling. Error messages return a constant `"Invalid credentials."` to prevent email/account enumeration.

### Dual-Token Architecture & Rotation
- **Access Tokens**: Short-lived (15 minutes), signed with `JWT_ACCESS_SECRET`. Can be transmitted via `Authorization: Bearer <token>` or encrypted HttpOnly cookies.
- **Refresh Tokens**: Cryptographically random 64-byte tokens hashed using SHA-256 before persistence in the `sessions` table.
- **Rotation & Reuse Detection**: Refresh tokens are rotated upon each renewal. If a previously consumed token is replayed, the session is immediately invalidated.
- **Session Registry**: Multi-device tracking via the `Session` model:
  - `POST /api/auth/logout`: Revokes the current active session.
  - `POST /api/auth/logout-all`: Revokes all sessions associated with the user account.

### CSRF & Cookie Configuration
- Cookies are provisioned with `HttpOnly`, `SameSite=Lax`, and `Secure` (in production).
- State-altering operations (`POST`, `PUT`, `DELETE`, `PATCH`) utilizing cookie authentication require double-submit CSRF verification via `X-CSRF-Token`.

---

## 3. Authorization & Access Control

### Role-Based Access Control (RBAC)
User roles are authoritative and resolved solely from the validated database user record:
- **`CANDIDATE`**: Can view own profile, complete assigned RPL diagnostic assessments, upload evidence documents, record practical assessments, and download their own issued certificates.
- **`ASSESSOR`**: Can view candidates assigned for RPL evaluation, inspect candidate evidence files, view AI-generated scoring recommendations, and submit final human RPL decisions.
- **`ADMIN`**: Can view system analytics, manage job roles, and inspect compliance audit logs.

Middleware enforcement:
- `requireAuth`: Validates JWT token and checks for non-revoked session status.
- `requireRole(...)`: Restricts route access to specified roles.
- `requireCandidate`, `requireAssessor`, `requireAdmin`: Dedicated guards for route security.

### Object-Level Authorization (IDOR / BOLA Defense)
Every resource-level request validates resource ownership or authorized assignment before returning or mutating data:
- `GET /api/assessments/:id`: Verifies `candidateProfile.userId === user.id` or that caller is an authorized `ASSESSOR`/`ADMIN`.
- `POST /api/assessments/:id/responses`: Blocks candidates from submitting answers to assessments belonging to other candidates.
- `GET /api/evidence/:id/download`: Enforces ownership before streaming evidence files.
- `GET /api/certifications/:id`: Prevents cross-candidate certificate inspection.

---

## 4. Input Validation & Request Throttling

### Authoritative Zod Schemas
All endpoints validate payloads with strict schemas (`backend/src/validators/schemas.ts`):
- `registerSchema`: Password complexity (minimum 8 characters, upper/lower/digit/special), email normalization, primary trade validation.
- `assessmentResponseSchema`: Enforces single-character option selection (`A`, `B`, `C`, `D`) and alphanumeric question IDs.
- `assessorReviewSchema`: Enforces scoring boundaries (0-100) and mandatory rationale comments.
- `paginationSchema`: Caps query limit at 100 items to prevent Denial of Service via unbounded database queries.

### Rate Limiting Hierarchy
Configured using `express-rate-limit` with differentiated limits:
| Endpoint Category | Window | Max Requests | Purpose |
|-------------------|--------|--------------|---------|
| Login | 15 min | 5 per IP/Account | Mitigates credential stuffing |
| Registration | 60 min | 10 per IP | Mitigates automated account flooding |
| AI Endpoints | 1 min | 20 per user | Protects model inference resources |
| Assessment Submit | 1 min | 15 per user | Prevents scripted answer flooding |
| File Uploads | 15 min | 10 per user | Manages disk I/O and processing load |
| General API | 1 min | 100 per user | Baseline API abuse protection |

---

## 5. File Upload Security & Storage Isolation

1. **Storage Isolation**: Uploaded files are stored in `backend/uploads/evidence` outside the web application document root. Direct URL access (`/uploads/*`) is completely disabled.
2. **Path Traversal Elimination**: Storage filenames are generated using UUIDv4 values (`uuidv4() + ext`). User-supplied filenames are never used on the filesystem.
3. **Magic Byte Signature Inspection**: In addition to extension filtering, files undergo binary header inspection (`FileSecurityService.validateFileSignature`):
   - PDF: Magic bytes `%PDF-` (`0x25 0x50 0x44 0x46`)
   - JPEG: Magic bytes `0xFF 0xD8 0xFF`
   - PNG: Magic bytes `0x89 0x50 0x4E 0x47`
   - MP4: Container ftyp signature inspection
4. **Malware Scanning Interface**: Implemented via `FileSecurityService.scan()` interface, ready for production integration with ClamAV or cloud object scanning.
5. **Controlled File Delivery**: Files are served exclusively via authenticated, streamed HTTP endpoints (`GET /api/evidence/:id/download`) with `Content-Disposition: attachment` to mitigate browser MIME-sniffing and cross-site scripting risks.

---

## 6. AI Safety, Prompt Injection & Human Oversight

### Untrusted Input Quarantine
Transcripts, uploaded resume texts, and candidate answers are treated as untrusted data:
- `PromptInjectionDetector.scan()`: Checks for system-override attempts, prompt leaking instructions, and score manipulation keywords.
- `PromptInjectionDetector.sanitize()`: Quarantines suspicious inputs before passing context to AI evaluation models.

### Structured Schema Output
AI responses are parsed against rigid schemas ensuring:
```json
{
  "score": 82,
  "confidence": 0.88,
  "skillsIdentified": ["Wiring", "Safety Protocols"],
  "observations": ["Candidate demonstrated strong grounding in Indian Electricity Rules."],
  "aiGenerated": true,
  "requiresHumanValidation": true
}
```

### Strict Human-in-the-Loop Constraint
- **AI CANNOT**: Approve certifications, change user roles, modify official candidate records, or finalize RPL evaluations.
- **Human Authority**: Only certified human assessors (`ASSESSOR` role) can submit official RPL evaluation decisions (`APPROVED`, `NEEDS_ADDITIONAL_TRAINING`, `REJECTED`).

---

## 7. Tamper-Resistant Audit Logging

The platform maintains an audit trail in the `AuditLog` table:
- **Tracked Events**: `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `ROLE_CHANGE`, `ASSESSMENT_STARTED`, `ASSESSMENT_SUBMITTED`, `EVIDENCE_UPLOADED`, `AI_ANALYSIS_REQUESTED`, `ASSESSOR_REVIEW_CREATED`, `CERTIFICATION_APPROVED`.
- **Logged Attributes**: `actorId`, `action`, `resourceType`, `resourceId`, `requestId`, `details`, `ipAddress`, `createdAt`.
- **Sanitization**: Password hashes, JWTs, bearer tokens, and private candidate notes are excluded from log storage.
- **Traceability**: Every request is assigned an `X-Request-ID` correlated through middleware, application services, and error handlers.

---

## 8. Public Certificate Verification

Certificates feature a cryptographically random verification ID (e.g., `RPL-7F4K-92MX-X8P2`):
- Verification route: `GET /api/certifications/verify/:verificationId`.
- **Public Disclosure Boundary**: Returns only public credential attributes:
  - Candidate Name
  - Job Role Title & NSQF Target Level
  - Issuance Date & Expiry Date
  - Validity Status (`isValid: true/false`)
- **Privacy Protection**: Candidate phone number, email address, physical location, and raw assessment scores are stripped from public verification responses.

---

## 9. Comprehensive Threat Model

| # | Threat Description | Severity | Mitigation Implemented | Residual Risk |
|---|-------------------|----------|------------------------|---------------|
| 1 | **Account Takeover / Credential Guessing** | Critical | Argon2id hashing, progressive delays, 5-attempt/15-min lockout, generic login error responses | Weak passwords chosen before registration policy enforcement |
| 2 | **Brute Force Login** | High | IP- and account-keyed rate limiting, lockout tracking in memory/cache | Distributed botnet attacks across rotating IPs (addressed in production via WAF) |
| 3 | **IDOR / BOLA (Insecure Direct Object Reference)** | Critical | Object-level ownership validation on assessments, responses, evidence, and certificates | None identified within protected resource routes |
| 4 | **Privilege Escalation** | Critical | Role state resolved strictly from database user record; client-supplied roles ignored | Insider database compromise |
| 5 | **Malicious File Upload (Web Shell / Malware)** | Critical | Storage outside public root, UUID filenames, extension allowlist, magic byte verification, download-only streaming | Zero-day polyglot files (mitigated in production via sandboxed ClamAV) |
| 6 | **Path Traversal (`../`)** | High | System-generated UUID filenames, strict extension allowlists, `path.resolve` boundary verification | None |
| 7 | **SQL Injection / Parameter Tampering** | Critical | Prisma ORM parameterized queries; raw SQL concatenation strictly avoided | None in current ORM usage |
| 8 | **Cross-Site Scripting (XSS)** | High | Helmet CSP, `X-Content-Type-Options: nosniff`, frontend framework data-binding, download attachment headers | Reflected XSS in legacy browser quirks |
| 9 | **Cross-Site Request Forgery (CSRF)** | High | SameSite=Lax cookies + double-submit CSRF verification header on mutating endpoints | Non-cookie API clients omitting CSRF header (protected by Bearer auth) |
| 10 | **Prompt Injection / Jailbreak** | High | Keyword and pattern scanning, untrusted input wrapping, schema-validated responses | Sophisticated adversarial phrasing evading regex (mitigated by mandatory human decision) |
| 11 | **AI Decision Manipulation** | Critical | AI outputs are marked `requiresHumanValidation: true`; certification endpoints accept decisions ONLY from human assessors | Biased or hurried human assessor approving flawed AI recommendation |
| 12 | **Assessment Score Tampering** | High | Client score inputs rejected; scores calculated strictly server-side upon immutable submission | Candidate obtaining leaked answer keys |
| 13 | **Certificate Forgery** | High | Cryptographically random verification tokens (`RPL-XXXX-XXXX-XXXX`), public verification endpoint | Offline printed visual copies without digital QR/verification lookup |
| 14 | **Token Theft / Replay** | High | Short-lived access tokens (15m), SHA-256 hashed refresh tokens, automatic rotation, reuse detection | Physical compromise of client endpoint memory |
| 15 | **Sensitive Data Leakage** | High | Centralized DTO mapping, strict error middleware masking Prisma and system paths, minimal public verification fields | Misconfigured third-party analytics scripts |
| 16 | **Denial of Service (DoS)** | Medium | 1MB payload caps, tiered rate limiters, database query pagination (limit <= 100) | Layer 7 volumetric HTTP floods (requires Cloudflare/AWS Shield in production) |

---

## 10. Prototype vs. Production Infrastructure

To maintain complete architectural honesty, the platform distinguishes between controls active in this prototype and enterprise capabilities intended for high-scale cloud production:

| Security Capability | Implemented in Current Build | Planned for Cloud Production |
|---------------------|------------------------------|-----------------------------|
| **Authentication** | Argon2id + Bcrypt migration + Refresh Rotation | SAML / OAuth 2.0 / DigiLocker / Aadhaar OTP |
| **Session Storage** | Relational Database (`Session` table) | Distributed In-Memory Redis Cluster |
| **File Storage** | Local isolated storage + Magic Bytes | Encrypted AWS S3 / Azure Blob + KMS Envelope Encryption |
| **Malware Scanning** | `FileSecurityService` signature inspection + interface | Asynchronous ClamAV daemon / VirusTotal Enterprise API |
| **WAF / DDoS** | Helmet + Express Rate Limiters | Cloudflare Magic Transit / AWS WAF with bot heuristics |
| **Secrets Management**| Validated `.env` startup parser | HashiCorp Vault / AWS Secrets Manager |
| **Audit Logs** | SQLite / PostgreSQL relational audit table | Append-only Elasticsearch / Datadog / AWS CloudTrail |
| **AI Inference** | Local mock AI + prompt injection defense | Isolated VPC sandboxed endpoint with guardrail models |
