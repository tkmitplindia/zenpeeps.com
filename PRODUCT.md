# ZenPeeps — Product Plan

## Vision

ZenPeeps is a project-first workspace for small teams. It replaces the fragmented stack of Trello, Slack, Notion, Google Meet, and Google Drive with a single, simple platform where everything belongs to a project.

The guiding philosophy is **simplicity first**. Big tools serve big companies with big compliance needs. ZenPeeps serves teams under 50 people — startups, agencies, freelancers, and small companies — who pay for 100% of features but use only 20%. ZenPeeps ships only that 20%, and makes it exceptional.

## Core Principles

1. **Project is the universe.** Every resource — boards, chats, pages, meetings, storage, members, billing — belongs to a project. Switching projects switches everything. There is no org-level abstraction; the project is the top-level entity.
2. **Simplicity over completeness.** Every feature must justify its existence by frequency of use, not by checkbox parity with competitors. If most users don't need it, it doesn't ship.
3. **AI everywhere, one brain.** A single AI assistant lives across the entire platform. It knows the user's preferences, can act across modules (tasks, chat, pages), and maintains context as the user navigates between screens.
4. **Unlimited people, predictable cost.** A project pays one price regardless of how many members it has. No per-seat billing. No ghost accounts draining money.
5. **Integrated by default.** Chat, tasks, pages, meetings, and storage are not separate products stitched together — they are facets of the same project. A task has a chatroom. A board has a chatroom. A page lives in the project. Nothing requires manual glue.

## Target Audience

Teams of 1–50 people who currently cobble together 4–6 SaaS tools to run their work:

- **Digital agencies** managing multiple client projects with rotating freelancers and client stakeholders.
- **Startups** building products with small, fast-moving teams.
- **Freelancers and consultants** who need lightweight project structure without enterprise overhead.
- **Small businesses** that want one tool instead of five but can't afford or justify enterprise platforms.

## Project Model

A **project** is the top-level entity in ZenPeeps. There is no organization, workspace, or team above it. Everything is scoped to a project.

### What a project contains

- **Members** with roles (Admin, Collaborator, Guest)
- **Boards** (kanban-style task management)
- **Chat** (project-level and nested chatrooms)
- **Pages** (block-based collaborative editor)
- **Meetings** (video calls, scheduling, optional recordings)
- **AI Assistant** (contextual, cross-module assistant)
- **Activity feed** (recent project activity, with 7 days of history)
- **Dashboard** (project-level metrics and activity)
- **Storage** (infrastructure — not a user-facing module; see Storage section)

### Membership and Roles

A user can belong to multiple projects. Each project manages its own members independently.

| Role | Create Resources | Edit Resources | View Resources | Chat | Manage Members |
|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Yes |
| Collaborator | No | Yes | Yes | Yes | No |
| Guest | No | No | Yes | Yes | No |

- **Admin**: Full control. Can create boards, manage members, adjust billing.
- **Collaborator**: Can edit existing resources (update tasks, write pages, upload files) but cannot create new top-level resources or manage project settings.
- **Guest**: Read-only access to resources, but can participate in chat. Designed for clients, external stakeholders, or observers.

### Global Dashboard

Every user has a **global dashboard** that aggregates information across all projects they belong to. This provides a 10,000-foot view of their entire workload: overdue tasks, upcoming meetings, unread messages, and project health indicators — all in one place.

## Apps and Features

### Boards

Kanban-style task management. Each board has columns, and each column has cards (tasks).

**Board templates:**
When creating a board, users can pick from a small set of built-in templates that pre-fill the columns: Sprint Plan, Bug Tracker, Content Calendar, Hiring Pipeline, Product Roadmap, or Custom. Templates are starting points; columns can be edited freely afterward.

**Card properties:**
- Title and description
- Assignee(s)
- Due date
- Priority (Low / Medium / High / Urgent)
- Tags (board-scoped labels)
- Checklist (a flat list of items that can be checked off — useful for capturing the small steps inside a task without creating separate tasks for each)
- Estimate (in hours) and a built-in stopwatch that tracks actual elapsed time
- Attachments (uploaded to project storage)
- Linked chatroom (auto-created per card)
- Previous/Next navigation across the board's tasks

**What boards intentionally exclude (for MVP):**
- Gantt charts, timeline views, calendar views
- Task dependencies between cards
- Subtasks (nested tasks with their own assignees, dates, and chatrooms — the in-card checklist covers the common case)
- Granular time tracking with multiple time entries, billable rates, or invoicing integrations (the stopwatch is intentionally simple)
- Recurring tasks
- Custom fields

These may be introduced in future versions based on user demand, but they are out of scope for the initial release. The goal is fast, visual, drag-and-drop task management — nothing more.

### Chat

Real-time messaging integrated into the project structure. Chat is always available on every plan and is not gated by tier.

**Structure:**
- Every project has a **project-level chatroom** (general discussion).
- Every board automatically gets a **board-level chatroom**.
- Every card/task automatically gets a **task-level chatroom**.
- Chatrooms are **nested**: the task chatroom's messages are visible from within the board chatroom as a thread, and the board chatroom is visible from the project chatroom.

**Features:**
- Text messaging with basic formatting
- File sharing (files are stored in project storage)
- @mentions for members
- Read receipts
- Threaded replies on individual messages

**What chat intentionally excludes (for MVP):**
- Voice messages
- Reactions/emoji responses
- Message pinning
- Scheduled messages
- Channels beyond the auto-generated structure

### Pages

A block-based collaborative editor powered by Tiptap. Pages are a ZenPeeps-native concept — not Word documents, not Google Docs. They live inside the project and are not imported from or exported to external tools in the MVP.

**Capabilities:**
- Rich text editing (headings, bold, italic, lists, links, code blocks)
- Tables
- Inline images
- Tags (project-scoped, free-form — show up as `# Research`, `# Methods`, etc.)
- Real-time collaboration — multiple people can have a page open at once and see each other's edits as they happen, with a presence indicator showing who's viewing

**Versioning and durability:**
Every save creates a new immutable version. The "current" version of a page is whatever the latest save points to; older versions are retained for 7 days, after which they are pruned. This is the foundation for the post-MVP rollback feature; for now, retention is silent — users don't see a version history UI, but their work is durable.

**Concurrent edits:**
When two members edit at the same time, both saves succeed. The later save wins as the page's current content; the earlier save is preserved as a retained version. In practice, members see each other's changes within a second of any save, so collisions are rare. The MVP doesn't ship character-level multi-cursor collaboration — that's a post-MVP investment.

**What pages intentionally exclude (for MVP):**
- Page templates
- Wiki/knowledge-base hierarchy
- Database views (redundant — boards serve this purpose)
- Comments and suggestions on specific text ranges (use the linked chatroom instead)
- A user-facing version history or rollback UI (the retention exists; the UI to walk it doesn't)

**Implementation note — AI-assisted editing:** When the AI assists with page editing (rephrasing, revising, expanding), it should output targeted edits rather than regenerating the entire page. For example, "rewrite the introduction" should produce only the new introduction text to be inserted, not a full rewrite of the entire page. This is both better UX (the user sees exactly what changed) and reduces AI token consumption.

### Meetings

Integrated video conferencing powered by VideoSDK. Meetings are a first-class resource within the project, not a link to an external tool.

**Capabilities:**
- Video and audio calls
- Screen sharing
- Meeting scheduling with calendar invites
- Meeting notes (saved as a page within the project)
- Recordings (Advanced plan only, stored in project storage, with recharge packs available)
- AI transcripts and summaries (Advanced plan only, consumes AI tokens, with recharge packs available)

**What meetings intentionally exclude (for MVP):**
- Breakout rooms
- Polls/Q&A during meetings
- Virtual backgrounds
- Waiting rooms
- Webinar mode

### Storage

Storage is **infrastructure, not a module**. There is no Drive page, no folder browser, no file manager in the nav. Files are always accessed in context — a chat attachment is found in chat, a board attachment is found on the task card, a page image is found in the page, a meeting recording is found in the meeting.

**How storage works:**

Every uploaded file in ZenPeeps — chat attachments, board card attachments, page inline images, meeting recordings — counts against the project's storage quota. So do retained page versions (each save adds a small JSON file). The project has a storage quota determined by its plan tier. When the quota is full, uploads fail until the project either purchases additional storage or members delete existing files.

**Storage indicator:**

A compact storage meter is displayed above the user menu in the bottom-left corner of the nav. It shows used/total (e.g., "42 GB / 100 GB") and links to a simple storage management screen where admins can see the largest files across the project and delete them. This is the only storage-related UI in the product.

**Storage quotas by plan:**

| Plan | Included Storage |
|---|---|
| Spark | 10 GB |
| Basic | 100 GB |
| Pro | 150 GB |
| Advanced | 250 GB |

Additional storage recharge packs are available for all plans (see Pricing — Recharge Module).

**What storage intentionally excludes:**
- Folder organization
- Per-file version history (separate from the page-version retention described above)
- File preview as a standalone feature (previews open inline within the module where the file lives)
- A dedicated files/drive page in the nav

### AI Assistant

A centralized AI assistant available on every screen. Unlike tools where each module has its own disconnected AI, ZenPeeps has one AI that understands the user's preferences, has context about the project, and can perform actions across the entire platform.

The assistant is implemented on top of the Laravel AI SDK against LLM Gateway (`llmgateway.io`), using GPT OSS models. The provider routing is invisible to the user — they see one AI, one assistant panel, one token balance.

**Capabilities:**
- **Cross-module actions**: "Mark this task as done and message Richa" — the AI updates the board and sends a chat message, all from a single instruction.
- **Contextual awareness**: The AI knows which screen the user is on and adapts its suggestions accordingly. On a task page, it can summarize the task's chat history. On a board, it can identify bottlenecks.
- **Persistent execution**: If the user starts a complex instruction on the task page and navigates to the meetings page, the AI continues executing in the background. A status indicator shows progress.
- **Page assistance**: Help drafting, editing, summarizing, or rewriting pages — with the user's tone and style preferences, consistent across the entire platform.
- **Suggested actions**: Each screen surfaces a small set of one-tap prompts relevant to the current context (e.g., on a task: "Summarize this task", "Generate checklist", "Suggest next steps", "Find blockers").

**What AI intentionally excludes (for MVP):**
- External integrations (no sending emails, posting to external Slack, etc.)
- Voice input
- Image generation
- Code execution
- Dedicated business-intelligence flows (post-mortems, performance analytics, SOP generation) — the assistant has general capabilities, but no BI-specific tools ship in MVP

**AI tokens are consumed from the project's token pool.** Any member in the project can use the AI, drawing from the shared pool.

**Unified token model**: ZenPeeps uses a single, unified token currency. There is no distinction between input tokens and output tokens from the user's perspective — 1 token consumed is 1 token deducted from the pool, regardless of whether it was used for sending context to the AI or receiving a response. This keeps token accounting intuitive: if a project has 500,000 tokens remaining, every member can see that number and understand exactly what it means.

Under the hood, ZenPeeps absorbs the cost asymmetry between input and output tokens from the underlying API. Both GPT OSS 120B and GPT OSS 20B are priced at $0.10/1M input and $0.50/1M output via LLM Gateway, giving a blended cost of approximately $0.20/1M unified tokens at a typical 3:1 input-to-output ratio. This extremely low cost basis enables aggressive token pricing and generous included allowances across all plans.

### Activity Feed

Every meaningful change inside a project is recorded as an activity entry: tasks created, moved, completed, assigned; pages updated; meetings scheduled; messages posted; files uploaded. The project dashboard surfaces a recent-activity feed; the global dashboard aggregates across all of a user's projects.

Each entry renders as a short markdown line — *"**Tushar** moved task **Setup UX Storyboard** to Done"* — with the actor's name in bold, a verb, the resource type, and the resource title. Entries link back to the underlying resource so a user can jump from "what happened" to "the thing that happened to."

**Retention.** Activity entries are kept for 7 days, then pruned. The same 7-day window applies to retained page versions. Together, these form the index for a future rollback feature — but rollback itself is post-MVP. For now, the feed is read-only.

## Pricing

ZenPeeps uses **project-based pricing**. Each project is on a plan. Members and chat are always unlimited on every plan.

### Plans

| | Spark (Free) | Basic | Pro | Advanced |
|---|---|---|---|---|
| **Price** | Free forever | $20/month | $50/month | $100/month |
| **Members** | Unlimited | Unlimited | Unlimited | Unlimited |
| **Chat** | Unlimited | Unlimited | Unlimited | Unlimited |
| **Boards** | 1 | 3 | 10 | Unlimited |
| **Meetings** | Not included | 5,000 min/month, no recordings | 10,000 min/month, no recordings | 100,000 min/month, 5,000 min recordings, AI transcripts & summaries |
| **Storage** | 10 GB | 100 GB | 150 GB | 250 GB |
| **AI Tokens** | 1M trial (first 30 days only) | 1M/month | 5M/month | 10M/month |

### Recharge Module

The recharge module is ZenPeeps' pay-as-you-go system. It serves two purposes:

1. **Extending allowances** — when a project exceeds its included plan limits (e.g., a Basic project that uses more than 5,000 meeting minutes).
2. **Unlocking features not in the plan** — when a project needs access to a capability that isn't included in its current tier (e.g., a Spark project that wants meeting minutes, or a Pro project that needs recording).

This means a Spark user doesn't have to upgrade to Basic just to get meetings, and a Basic user doesn't have to upgrade to Advanced just to get recording. They can purchase exactly what they need, when they need it, without changing plans. The plan determines the monthly baseline; the recharge module provides flexibility on top.

**Available recharge packs:**

| Resource | Pack Size | Price | Available On |
|---|---|---|---|
| AI Tokens | 1M tokens | $5 | All plans |
| Meeting Minutes | 1,000 minutes | $5 | All plans |
| Recording | 500 minutes | $5 | All plans |
| Transcripts | 500 minutes | $5 | All plans |
| Storage | 10 GB | $5 | All plans |

**How recharges work:**

- Recharge packs are purchased per project by an Admin.
- Recharge balances **do not expire**. Unused recharge balance carries over indefinitely. This is distinct from included plan allowances, which reset monthly.
- Multiple packs of the same type can be purchased and they stack. A Spark project buying 3 meeting minute packs has 3,000 minutes available.
- Recharges unlock the associated feature if it's not included in the plan. A Spark project that purchases a meeting minutes pack can immediately start using video calls. A Basic project that purchases a recording pack can immediately start recording meetings.
- The recharge balance is visible on the project dashboard so all members can see remaining capacity.

**Recharge examples by plan:**

**Spark (Free):** A freelancer on Spark has 1 board, 10 GB storage, chat, and the 30-day AI trial. They don't need to upgrade to Basic just because they have one client call per week. Instead, they buy a meeting minutes pack ($5 for 1,000 min) and an AI token pack ($5 for 1M tokens). Total spend: $10/month for exactly what they need — far less than the $20 Basic subscription.

**Basic ($20/month):** A small team on Basic normally doesn't need recordings. But this month they have a critical client workshop they want to record. They buy one recording pack ($5 for 500 min) — enough for the workshop — without upgrading to Advanced at $100/month.

**Pro ($50/month):** A growing team on Pro hit their 10,000 meeting minute limit mid-month because of a sprint with daily extended standups. They buy a meeting minutes pack ($5 for 1,000 min) to cover the overage rather than upgrading to Advanced.

### Spark Plan — AI Trial

New Spark projects receive 1M AI tokens as a one-time trial for the first 30 days after project creation. This is not a monthly allowance — it is a one-time grant to let teams experience the AI assistant without any purchase. After 30 days or once the trial tokens are consumed (whichever comes first), the project must purchase AI token recharge packs at $5/1M to continue using AI features.

### Pricing rationale

- **Spark (free forever)** is the acquisition engine. Small teams and freelancers can use ZenPeeps indefinitely with 1 board, 10 GB storage, unlimited members, and unlimited chat. The 30-day AI trial (1M tokens) lets every new team experience AI features — no purchase required, no friction. After the trial, AI recharge packs at $5/1M are cheap enough to be an impulse buy. Critically, Spark users can access *any* feature via recharges — they don't have to upgrade plans just to try meetings or recording.
- **No per-seat pricing.** This is a core differentiator. Agencies and startups frequently add and remove freelancers, contractors, and client stakeholders. Per-seat pricing punishes this flexibility. ZenPeeps charges per project, not per person.
- **Plans set the baseline, recharges provide flexibility.** The plan determines what's included monthly. The recharge module lets any project on any plan access any feature without upgrading. This eliminates the common frustration of being forced into a higher tier for one feature you rarely use.
- **AI tokens as the monetization lever.** AI is woven into every part of the platform. Tokens are consumed across all of these. At $5/1M tokens with a blended cost of ~$0.20/1M (96% margin), every token purchase is highly profitable. The generous included allowances at each tier ensure teams use AI heavily — and when they exceed their allowance, the $5 recharge is a no-brainer.
- **Unified token model.** Users see one token currency — no distinction between input and output tokens. ZenPeeps absorbs the underlying cost asymmetry. This keeps things dead simple.
- **Simple recharge pricing.** Every recharge pack is $5 for a round number of units. No complex tiered pricing, no per-plan rate differences. The differentiation between plans is the included monthly allowance, not the recharge price.
- **Basic at $20/month** is positioned as the entry point for teams that need meetings and multiple boards. At typical meeting usage (2,000–3,000 min/month), the VideoSDK cost is $8–12, making Basic comfortably profitable before any recharge purchases.
- **Pro at $50/month** targets growing teams that need more boards, more meeting minutes, and heavier AI usage. With 5M tokens included and 10,000 meeting minutes, it serves teams of 10–20 people who are active across all modules.
- **Advanced at $100/month** is the power-user tier for agencies running client projects. Unlimited boards, 100K meeting minutes, recordings, transcripts, and 10M AI tokens. A 20-person agency currently spending $700+/month across per-seat SaaS tools gets everything for $100. Recording and transcripts (5,000 min each included) are gated to Advanced as premium differentiators.
- **Competitive anchor**: A 10-person team paying per-seat for Slack ($87.50) + Trello ($50) + Notion ($100) + Google Workspace ($120) = $357.50/month minimum. ZenPeeps Pro at $50 replaces all of it for a fraction of the cost.

## User Experience Philosophy

### Design principles

1. **One screen, one purpose.** Every screen should have a clear primary action. Avoid feature-dense interfaces that try to do everything at once.
2. **Navigation = project switching.** The most prominent navigation action should be switching between projects. Within a project, navigation between modules (boards, chat, pages, meetings) should be secondary and effortless.
3. **AI is a layer, not a destination.** The AI assistant should be accessible from every screen as a persistent panel or overlay — not a separate page the user has to navigate to.
4. **Context flows naturally.** When a user clicks on a task, they should see the task details, the task chatroom, and linked pages — all without leaving the page. Context should never require tab-switching or manual lookups.
5. **Progressive disclosure.** Show the essentials first. Advanced options, settings, and configurations should be available but not in the way.

### What the experience should feel like

- **Switching projects feels like switching apps.** Different project, different boards, different chat, different pages, different people. Clean mental separation.
- **Everything is two clicks away.** From any screen, the user should be able to reach any resource in the project within two interactions.
- **The AI is a colleague, not a feature.** Talking to the AI should feel like asking a team member to do something, not like filling out a form or writing a prompt.
- **Storage is invisible.** Users should never think about where their files live. They upload, they access in context. The storage meter only surfaces when it needs to.
- **Saves are silent.** Pages and tasks autosave. Users never see a "Save" button on content they've been editing.

## MVP Scope

The minimum viable product includes:

1. **Project creation and management** — create projects, invite members, assign roles.
2. **Boards** — kanban boards with columns and cards. Card details with title, description, assignee(s), due date, priority, tags, checklist, estimate, stopwatch timer, and attachments.
3. **Chat** — project chatroom, board chatrooms, task chatrooms. Nested visibility. Real-time messaging with file attachments, @mentions, and read receipts.
4. **Pages** — Tiptap-based block editor with rich text, tables, inline images, and tags. Real-time collaborative viewing with optimistic save semantics. Each save retained as an immutable version for 7 days.
5. **Meetings** — video calls with screen sharing and scheduling via VideoSDK. Recordings and transcripts on Advanced tier.
6. **AI Assistant** — cross-module assistant available on every screen, implemented on the Laravel AI SDK against LLM Gateway. Can perform actions across boards, chat, and pages. Persistent execution across navigation. Suggested-action cards on every screen.
7. **Activity Feed** — per-project recent-activity stream and a global aggregation across the user's projects. 7-day retention.
8. **Dashboards** — per-project dashboard and global dashboard.
9. **Storage management** — storage meter in nav, basic admin cleanup screen.
10. **Marketing site and sign-up** — landing page, pricing page, frictionless sign-up that creates the user, their first project, a starter board, and a Welcome page.

### What is NOT in the MVP

- **Workflows / automation.** Trigger/condition/action automation rules. Distribution comes before power-user features.
- **Business intelligence.** Post-mortems, bottleneck analysis, on-time-delivery rate, SOP suggestions. The AI assistant has general capabilities; dedicated BI flows are post-MVP.
- **CRDT-based real-time page collaboration.** The MVP page-collab model is optimistic last-write-wins with broadcast refetch.
- **Page rollback UI.** Page versions are retained for 7 days, but the user-facing rollback experience is post-MVP.
- External integrations (Slack, email, third-party APIs).
- Mobile apps (web-first).
- Task dependencies, subtasks, recurring tasks, custom fields beyond Priority.
- Page templates, wikis, databases-in-pages.
- Meeting features (breakout rooms, polls, virtual backgrounds).
- SSO, audit logs, advanced permissions, compliance features.
- API for third-party developers.
- Folder organization or a file browser.
- File version history.

## Success Metrics

- **Activation**: % of new projects that create at least 1 board, send at least 1 chat message, and invite at least 1 member within the first 7 days.
- **Retention**: % of projects active (at least 1 member login) after 30/60/90 days.
- **Conversion**: % of Spark projects that purchase AI recharge packs or upgrade to Basic/Pro/Advanced.
- **Engagement**: Average daily active members per project. Average AI token consumption per project. Recharge purchase frequency.
