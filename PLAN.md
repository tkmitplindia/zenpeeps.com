# ZenPeeps — Build Plan

This document is the build plan for ZenPeeps. It is consumed by Claude Code, which executes the tasks below sequentially. The product spec is `PRODUCT.md`. Cost and margin context is in `PRICING_ANALYSIS.md`. The high-fidelity designs are JPGs under the `designs/` directory at the project root, organized by surface:

- `designs/Dashboard.jpg`
- `designs/Boards/Index.jpg`, `designs/Boards/Create.jpg`, `designs/Boards/Edit.jpg`, `designs/Boards/Show.jpg`
- `designs/Task/Edit.jpg`
- `designs/Pages/Index.jpg`, `designs/Pages/Show.jpg`
- `designs/Messages/Index.jpg`

All design references in this plan use these exact paths. If you see an older flat-root name (e.g. `Board_Index.jpg`) anywhere, treat it as a typo and resolve to the corresponding path above.

**Designs trump PRODUCT.md.** The designs are the newer iteration of the product. When a design shows a field, behavior, or flow not described in PRODUCT.md (or contradicting it), follow the design. When the design is silent, fall back to PRODUCT.md. PRODUCT.md is reference, not law.

Read this entire file before starting Task 1. Every task references conventions defined in the **Conventions** section — those rules apply to *every* task, not just the one that introduces them.

---

## How to use this plan

1. Work tasks **in order**, one at a time. Do not skip ahead.
2. After completing each task: run the test suite, commit with a message like `task-NN: <short description>`, and update `STATUS.md` with the task number, status, commit SHA, and a one-line note.
3. If a task is blocked or impossible as written, mark it `BLOCKED` in `STATUS.md` with the reason, then move to the next task only if it has no dependency on the blocked one. Do not silently skip.
4. The final step of every task is `php artisan test --compact` passing. If tests fail, fix them in the same task before committing.
5. Before writing any non-trivial Laravel code, use Laravel Boost's `search-docs` MCP tool to verify syntax for the installed version. Boost is the source of Laravel guidance — there is no `LARAVEL_SKILLS.md` in the project.

### STATUS.md format

`STATUS.md` lives at the repo root. Use this exact shape:

```
# ZenPeeps Build Status

| #  | Task                                          | Status   | Commit     | Notes                               |
|----|-----------------------------------------------|----------|------------|-------------------------------------|
| 1  | Foundation + model scaffolding                | DONE     | a1b2c3d    |                                     |
| 2  | Backed enums (Plan, ProjectRole, …)           | DONE     | e4f5g6h    |                                     |
| 3  | Extend User migration with UUID + soft delete | IN PROG  | -          | Wiring HasUuid trait inline         |
```

Statuses: `TODO`, `IN PROG`, `DONE`, `BLOCKED`, `SKIPPED`.

---

## Conventions (apply to every task)

### Backend

- **Primary keys.** Every model uses `$table->uuid('id')->primary()` in the migration and `use HasUuid` in the model. Pivot tables also use UUIDs unless they have a composite key. **Exception:** tables created by Laravel packages (e.g. the Laravel AI SDK's `agent_conversations` and `agent_conversation_messages`) follow whatever the package ships with. We don't fight upstream; we treat those tables as a black box and interact through the package's API.
- **Soft deletes.** Every model except pivot tables uses `use SoftDeletes` and has `$table->softDeletes()` in the migration. **Exception:** explicitly immutable, append-only models with their own retention policy (e.g. `PageContent` versions, `Activity` rows) are hard-deleted by scheduled prunes and skip soft deletes.
- **PHPDoc on every model.** Every model documents: `@property` for every column, `@property-read` for every relationship, `@method` for query scopes, and a one-line class-level summary.
- **Lean models.** Models hold fillables, casts, and the trait list. Relationships go in `app/Models/Concerns/Has{Thing}Relationships.php` traits, attribute accessors/mutators in `app/Models/Concerns/{Model}Attributes.php`, query scopes in `app/Models/Concerns/{Model}Scopes.php`. A model file should rarely exceed 80 lines.
- **Pivots over pivot models.** When a join table only carries foreign keys (and maybe `created_at`), use a plain pivot table accessed via `belongsToMany`. Promote to a model only when extra logic is needed.
- **Enums: PHP-side, string in DB.** Never use `$table->enum(...)` in migrations. Define a backed enum in `app/Enums/{Name}.php`, store the column as `$table->string('column')`, and cast it on the model with `'column' => MyEnum::class`. This avoids painful `ALTER TABLE` operations when adding values.
- **No JSON columns.** SQLite's and MySQL's JSON column implementations diverge enough to bite (operator support, indexing, NULL handling, ordering). Default to relational models. The narrow exceptions are externally-defined opaque blobs we never query *into* — store these as `longText` with the `'array'` cast on the model so behavior is identical across drivers. Do not introduce any other JSON-shaped column without explicit approval. Tiptap document content is *not* an exception here — it lives in disk-backed storage as immutable JSON files (see "Reading the designs" below).
- **Foreign keys.** Use `$table->foreignUuid('project_id')->constrained()->cascadeOnDelete()` (or `nullOnDelete()` where appropriate). Add an index on every column used in `WHERE`, `ORDER BY`, or `JOIN`.
- **No `verified` middleware.** Skip email-verification gating on routes — it makes testing brittle.
- **Current project lives in the session.** Held as `current_project_id` (not in the URL). `HandleInertiaRequests` resolves it into the `currentProject` shared prop on every Inertia response, lazily clearing stale ids. The `current-project` route middleware (alias `current-project`, defined in `app/Http/Middleware/CurrentProjectMiddleware.php`) redirects to `projects.index` if the session is empty or stale. **Project-scoped resources — boards, tasks, pages, messages, meetings — must NOT carry a `{project}` URL parameter.** Their routes join `Route::middleware('current-project')` and read the active project from session inside controllers/actions. The only routes that take `{project}` are project-management itself (`projects.show/update/destroy/select` + member sub-resources). Setting the session is the responsibility of `projects.{store,select,show,update}`; clearing it on delete is the responsibility of `projects.destroy`.
- **Actions for business logic.** One action per file, e.g. `app/Actions/Board/IndexBoardAction.php`. The `handle(...)` method receives explicit typed arguments — never the `Request`. The route extracts inputs from the request, calls `handle`, then returns `inertia(...)`. Database mutations inside `handle` are wrapped in `DB::transaction(...)`.
- **Redirects.** `store` and `update` routes redirect to the model's `show` route. `destroy` redirects to `index`.
- **Eager loading.** Enable `Model::preventLazyLoading(! app()->isProduction())` in `AppServiceProvider::boot()`. Every relationship access in a controller/action must be preceded by `->with(...)`.
- **No raw table names.** Use `(new Model)->getTable()` or Eloquent. Hardcoded `DB::table('foo')` is only acceptable inside migration files.
- **Tests.** Pest 4. Every Action gets a feature test. Every model gets a factory. Use `RefreshDatabase` in feature tests.

### Frontend

- **Stack.** Inertia 3 + React 19 + TypeScript + Tailwind v4 + shadcn (already installed via the React starter kit, with built-in auth).
- **shadcn only.** Use only the shadcn components already in `resources/js/components/ui/`. Do not introduce a new UI library, do not write custom Tailwind designs that bypass shadcn primitives. If a primitive is missing, install it via the shadcn CLI before building on top of it.
- **No custom Tailwind styling.** Layout utilities (`flex`, `grid`, `gap-*`, `p-*`) are fine. Custom colors, custom typography classes, and one-off utility soup are not — extend shadcn instead.
- **Pages are thin.** A page in `resources/js/pages/{model}/{action}.tsx` only composes components. Per-page components live in `resources/js/components/{model}/{component}.tsx`. A component renders JSX only — no fetching, no mutations, no business logic. Page files should rarely exceed ~50 lines; if one grows, split sections out into `components/{domain}/`.
- **Layout zones.** Three layout shells, picked by `app.tsx` based on the page name prefix:
    - `ProjectLayout` (`resources/js/layouts/project-layout.tsx`) — centered, logo on top, no sidebar. Wraps `pages/projects/*.tsx` (the picker + create form, shown to users with no current project).
    - `AppLayout` — sidebar + topbar. Wraps `pages/dashboard.tsx` and any future project-scoped pages (`pages/boards/*`, `pages/tasks/*`, etc.).
    - `SettingsLayout` (composed under `AppLayout`) — settings tabs sidebar. Wraps `pages/settings/*.tsx`. Tabs are Profile / Security / Appearance / Project; the Project tab resolves dynamically from `currentProject` shared prop.
- **Hooks for logic.** All state, mutations, derived data, and side effects live in `resources/js/hooks/use-{thing}.ts`. Components consume hooks. This is non-negotiable; resist the temptation to inline `useState` chains in components beyond trivial UI state.
- **Types.** Backend models have a TypeScript twin in `resources/js/types/{model}.ts`. When a column is added to a migration, update the type in the same task.
- **Skeletons not stock images.** For any image placeholder (marketing site hero, empty states, avatars before load), use the shadcn `Skeleton` component sized to the right aspect ratio. Never embed Unsplash or stock photos.
- **Inertia returns.** Actions return data; the route wraps the action's return in `inertia('boards/index.tsx', $data)`. Match page filename casing exactly.

### Laravel Boost

Laravel Boost is installed and provides an MCP server. Claude Code uses these tools liberally:

- `search-docs` — verify syntax for the installed Laravel/Inertia/Pest/Tailwind/AI-SDK version before writing code.
- `list-routes` — inspect existing routes before adding new ones.
- `tinker` — exercise models from the shell instead of writing throwaway scripts.
- `list-artisan-commands`, `database-schema`, `read-log-entries` — for inspection during debugging.

If a task seems ambiguous, run `search-docs` first.

The Laravel AI SDK in particular is new — `search-docs` is mandatory, not optional, before calling any of its APIs. Do not guess at method names, signatures, or attribute behavior; the SDK's documentation is the source of truth and the surface area is large. When searching the AI SDK, use plain content terms (e.g. `agent fake`, `streaming response`, `middleware then`), not package-prefixed queries.

### Reading the designs

The designs are authoritative for the product surface. A few interpretations of design elements that aren't fully spelled out:

- **Checklist** on `designs/Task/Edit.jpg` — `TaskItem` model (`task_id`, `text`, `done`, `position`). A per-task to-do list, distinct from full subtasks (which would be Task models nested under tasks). The user-facing label is "Checklist"; the model is named `TaskItem` to keep the type generic.
- **Time tracker** on `designs/Task/Edit.jpg` — `elapsed_seconds` integer + `time_tracker_started_at` nullable timestamp on `tasks`. Start/stop bumps `elapsed_seconds`. No `time_entries` model.
- **Tags on tasks** (`designs/Task/Edit.jpg`) — board-scoped `Label` model + `task_label` pivot.
- **Tags on pages** (`designs/Pages/Index.jpg`, `designs/Pages/Show.jpg`) — project-scoped `Tag` model + `page_tag` pivot.
- **Templates** on `designs/Boards/Create.jpg` — a `BoardTemplate` enum + a static helper that returns default columns for a chosen template.
- **Previous/Next Task** on `designs/Task/Edit.jpg` — derived navigation across the current board's tasks ordered by column → position.
- **Page content versioning** — Tiptap documents do not live in the database. Each page save uploads a new immutable JSON file to disk (DigitalOcean Spaces in production, local in dev/test) and creates a new `PageContent` row. The `pages.head_content_id` foreign key advances to the new version atomically. Old versions stay on disk for 7 days as the foundation for the post-MVP rollback feature, then are pruned. This is why page content is not subject to the no-JSON convention — there's no JSON column anywhere; the file is on disk and the database stores only metadata.
- **Real-time page updates.** When `pages.head_content_id` advances, a `PageContentUpdated` event fires on the page's private Reverb channel carrying only the page id. Clients refetch content via a server endpoint — disk paths never leave the server. Concurrent saves both succeed; the later write wins as head, the earlier write lives on as an orphan version (still indexed, still prunable). No version counter, no 409s.

If a design element is genuinely ambiguous, flag it in `STATUS.md` and ask before continuing.

---

## Tasks

### Phase 0 — Foundation

1. **Foundation + model scaffolding.** The Laravel React starter kit is already on disk. Verify the stack matches the pinned versions (these are the source of truth for `search-docs` queries throughout the build):

    - PHP 8.5
    - `laravel/framework` v13
    - `inertiajs/inertia-laravel` v3, `@inertiajs/react` v3
    - React 19, TypeScript, `tailwindcss` v4, shadcn primitives in `resources/js/components/ui/`
    - `laravel/fortify` v1 (auth backend)
    - `laravel/wayfinder` v0 + `@laravel/vite-plugin-wayfinder` v0 (typed route helpers; required for any frontend → backend wiring)
    - `pestphp/pest` v4, `phpunit/phpunit` v12, `laravel/pint` v1
    - `laravel/boost` v2, `laravel/mcp` v0, `laravel/pail` v1, `laravel/sail` v1, `laravel/prompts` v0
    - `laravel/ai` v0 (used in Phase 10)

    Then scaffold the full domain model surface in one pass with `php artisan make:model -a {Name} --no-interaction` for each of: `Project`, `Attachment`, `Board`, `BoardColumn`, `Task`, `TaskItem`, `Label`, `Chatroom`, `Message`, `Page`, `PageContent`, `Tag`, `Meeting`, `Activity`, `FakePayment`. Each `-a` invocation generates the model + empty `id`+`timestamps` migration + factory + seeder + resource controller + Store/Update form requests + policy. Columns are filled in per-task in later phases.

    Pivot tables (`project_members`, `task_label`, `task_assignees`, `message_reads`, `message_mentions`, `page_tag`, `meeting_attendees`) are intentionally **not** scaffolded as models — they get plain `Schema::create` migrations in their owning phases. The Laravel AI SDK's package-owned tables (`agent_conversations`, `agent_conversation_messages`) are also not scaffolded here.

    Resource controllers, form requests, and policies generated by `-a` are kept as stubs even though PLAN.md routes the work through the actions pattern. They will either get adopted or pruned during the Phase 14 cleanup pass.

    Two model renames vs. an early draft: `ChecklistItem` → `TaskItem` (the UI label "Checklist" stays; the model name is generic so it can grow beyond a single per-task list later) and `Column` → `BoardColumn` (avoids collision with `Illuminate\Database\Schema\Column` in board/kanban code; the FK on tasks is `board_column_id`).

    Run `vendor/bin/pint --dirty --format agent`, then `php artisan test --compact`. Commit.
2. Create the backed enums upfront: `app/Enums/Plan.php` (Spark, Basic, Pro, Advanced), `SubscriptionStatus.php` (Active, PastDue, Canceled, Trial), `ProjectRole.php` (Admin, Collaborator, Guest), `BoardTemplate.php` (Custom, SprintPlan, BugTracker, ContentCalendar, HiringPipeline, ProductRoadmap), `TaskPriority.php` (Low, Medium, High, Urgent), `MeetingRsvp.php` (Pending, Accepted, Declined), `ActivityAction.php` (Created, Updated, Deleted, Restored, Completed, Assigned, Moved, Commented, Uploaded). Commit.

### Phase 1 — Users, Projects, Membership

3. Extend the default `User` migration to use a UUID primary key and add columns: `name`, `email`, `email_verified_at` (nullable, kept for the starter kit even though we don't enforce it), `password`, `avatar_url` (nullable). Add `HasUuid`, `SoftDeletes` traits. Commit.
4. Create `Project` model and migration. Columns: `id` (uuid, primary), `name`, `description` (text, nullable), `owner_id` (foreign uuid → users), `plan` (string, cast `Plan::class`, default `Plan::Spark->value`), timestamps + `deleted_at`. The recharge-balance and usage columns are added by Task 12 in a separate migration. Add `ProjectFactory`. **No `slug` column** — projects are identified by their UUID `id` everywhere (route key, session, frontend). Commit.
5. Create `project_members` pivot table migration. Columns: `id` (uuid), `project_id`, `user_id`, `role` (string, cast `ProjectRole::class`), `joined_at`, `created_at`, `updated_at`. Unique index on `(project_id, user_id)`. Commit.
6. Implement `Project::members()` (`belongsToMany` through `project_members`) with `withPivot('role','joined_at')`, `User::projects()` reverse relation, and a `Project::admins()` scope. Place relationships in `Concerns\HasProjectRelationships` trait. Commit.
7. Build Project actions: `IndexProjectAction`, `StoreProjectAction` (creates the project chatroom — auto-creation hook is wired in Phase 7 — and the owner as admin member), `ShowProjectAction`, `UpdateProjectAction`, `DestroyProjectAction`. Each in its own file. Wrap mutations in `DB::transaction`. Commit.
8. Build Project routes and Inertia pages, split across two zones:

    - **No-current-project zone** (under `routes/web.php`, no `current-project` middleware): `GET /projects` (`projects.index`), `GET /projects/create` (`projects.create`), `POST /projects` (`projects.store`), `POST /projects/{project}/select` (`projects.select`). Pages: `pages/projects/index.tsx` (picker — shown when 0 or 2+ projects; auto-selects when exactly 1), `pages/projects/create.tsx` (new-project form). Both wear the centered logo-on-top `ProjectLayout`.
    - **Project-settings zone** (under `routes/settings.php`, behind the `current-project` middleware): `GET/PATCH/DELETE /settings/projects/{project}` (`projects.show/update/destroy`) plus `POST/DELETE /settings/projects/{project}/members[/{user}]` (`projects.members.store/destroy`). Page: `pages/settings/projects.tsx` — a single screen composing `ProjectDetailsForm`, `ProjectMembers`, and `ProjectDeleteCard` from `resources/js/components/project/`.

    `projects.store` and `projects.select` write `current_project_id` to the session and redirect to `dashboard`. `projects.show` writes session as a side effect on visit. `projects.destroy` clears the session if it matches the deleted project. Add a "Project" entry to the settings sidebar that resolves to `projects.show(currentProject.id)` when set, else `projects.index`.

    Sync the `Project` (id/name/description/owner_id/plan/timestamps) and `ProjectMember` (User + pivot{role, joined_at}) types in `resources/js/types/project.ts`. Commit.
9. Build the **project switcher** component (`resources/js/components/layout/project-switcher.tsx`) that renders the current project + plan badge in the top-left of the sidebar (matches `designs/Dashboard.jpg`). Switching navigates to that project's dashboard. Commit.
10. Build `InviteMemberAction` and `RemoveMemberAction`. Inviting sends an email invite (Mailable; synchronous queue is fine for MVP). Add a project members management page. Commit.
11. Write feature tests: project CRUD (store/show/update/destroy/select), authorization (non-member 403, collaborator can't update or delete, only owner can delete), and invite/remove flows. **Future-phase role tests** — Collaborator cannot create boards or pages but can participate in chats; Guest cannot post messages outside chat — are deferred to their own phases (Boards in Phase 5, Pages in Phase 8, Messages in Phase 7) where the routes exist. Commit.

### Phase 2 — Plans, Subscriptions, Recharges

12. Create `ProjectLimits` and `ProjectUsage` models, their migrations, and a `UsageType` enum. Do **not** add columns to `projects`.

    **`project_limits`** — one row per project (`hasOne`). Columns: `id` (uuid), `project_id` (uuid, unique FK → projects, cascadeOnDelete), `subscription_status` (string, cast `SubscriptionStatus::class`), `current_period_starts_at`, `current_period_ends_at`, `ai_tokens_included` (bigint — monthly plan allowance), `recharge_ai_tokens` (bigint, default 0), `recharge_meeting_minutes` (int, default 0), `recharge_recording_minutes` (int, default 0), `recharge_transcript_minutes` (int, default 0), `recharge_storage_bytes` (bigint, default 0), `trial_tokens_granted_at` (timestamp, nullable), timestamps.

    **`project_usage`** — append-only line items (`hasMany`). Columns: `id` (uuid), `project_id` (uuid FK → projects, cascadeOnDelete), `type` (string, cast `UsageType::class`), `amount` (bigint), `description` (string, nullable — e.g. conversation ID or meeting ID), `created_at` only (no `updated_at`, no soft deletes — immutable accounting records). Index `(project_id, type, created_at)`.

    **`app/Enums/UsageType.php`**: `AiTokens`, `MeetingMinutes`, `RecordingMinutes`, `TranscriptMinutes`. Storage usage is derived from `Attachment` sums, not usage rows.

    Add named query scopes to `ProjectUsage`: `forAiTokens()`, `forMeetingMinutes()`, `forRecordingMinutes()`, `forTranscriptMinutes()`, and `currentPeriod(Project $project)` (filters `created_at >= $project->limits->current_period_starts_at`). Use these scopes everywhere — never raw `where('type', ...)` calls.

    Wire `Project hasOne ProjectLimits` and `Project hasMany ProjectUsage` (relationships go in `HasProjectRelationships`). Update `StoreProjectAction` to create the initial `ProjectLimits` row seeded with values from `Plans::for($project->plan)`. Add `ProjectLimitsFactory` and `ProjectUsageFactory`. Commit.
13. Create `app/Support/Plans.php` returning the plan matrix (price, board limit, meeting minutes, storage bytes, AI tokens, includes-recordings, includes-transcripts) for each `Plan` enum value. Source of truth is the table in `PRODUCT.md`. Commit.
14. Create `app/Support/RechargePacks.php` listing the five $5 packs (AI tokens 1M, meeting 1k min, recording 500 min, transcripts 500 min, storage 10 GB). Commit.
15. Create `Project::storageQuotaBytes()`, `availableMeetingMinutes()`, `availableAiTokens()`, `availableRecordingMinutes()`, `availableTranscriptMinutes()` accessors on a `ProjectQuotas` concern. Each available-* accessor reads entitlements from `$this->limits` and subtracts current-period consumption via the `ProjectUsage` scopes — e.g. `$this->usage()->forAiTokens()->currentPeriod($this)->sum('amount')`. `usedStorageBytes()` is derived from `Attachment` sums; Task 57 extends it to also sum `PageContent` rows. Always eager-load `limits` and pre-aggregate `usage` in controllers — never call these accessors in a loop. **Post-MVP:** replace per-request aggregation with a cached or denormalized counter once query volume warrants it. Commit.
16. Create the payment provider abstraction: `app/Services/Payments/PaymentProvider.php` interface, `FakePaymentProvider.php` (always succeeds, records to a `fake_payments` model table for inspection), and a `StripePaymentProvider.php` stub (throws `NotImplementedException`). Bind via the service container based on `config('services.payments.driver')`, default to `fake` outside production. Commit.
17. Create `PurchaseRechargeAction`. Takes project, pack key, the resolved `PaymentProvider`. On success, updates the matching `recharge_*` column. Commit.
18. Create scheduled command `php artisan billing:reset-period` that runs daily and advances `current_period_starts_at` and `current_period_ends_at` on `ProjectLimits` for projects whose period has ended. No column-zeroing needed — old `ProjectUsage` rows fall outside the new period window automatically and are cleaned up by `retention:prune`. Spark trial logic: 1M tokens granted exactly once per project at creation, recorded via `trial_tokens_granted_at`; not refilled on reset. **Note:** the scheduled command is the MVP fallback. In production, `current_period_starts_at` / `current_period_ends_at` must be advanced in response to a Stripe `invoice.paid` webhook — wire this when replacing `FakePaymentProvider` with `StripePaymentProvider` (post-MVP). Commit.
19. Build the recharge purchase UI. Five pack cards, $5 each, click → calls `PurchaseRechargeAction`. **Delivered on the Billing settings page (see below) rather than the project dashboard.** Commit.
20. Write feature tests: plan limits enforced, recharge balances stack, recharge unlocks features not in plan, period reset zeros usage but preserves recharges, Spark trial is one-time, fake provider records the payment row. Commit.

**Ad-hoc additions delivered after task 20:**

- **Billing settings page** (`/settings/billing/{project}`) — three sections: (1) current plan card showing plan name, status badge, billing period dates, and key entitlements; (2) change-plan form using `ProjectPlanSelect` radio cards, backed by `ProjectBillingController@update` → `UpdateProjectAction` which now re-seeds `ai_tokens_included` in `ProjectLimits` whenever the plan changes; (3) recharge packs (moved here from the project settings page). Route name `projects.billing`. Owner/admin only for writes.

- **Usage settings page** (`/settings/usage/{project}`) — shows progress bars for all five resources (AI tokens, meeting minutes, recording, transcripts, storage) scoped to the current billing period. Data aggregated server-side in `ProjectUsageController@edit`; frontend only renders. Route name `projects.usage`. Visible to all project members.

- Both pages are reachable from the settings sidebar. Routes are top-level (`/settings/billing/{id}`, `/settings/usage/{id}`) rather than nested under `/settings/projects/{id}` to avoid the project nav item highlighting when billing or usage is active.

- `RechargePack` and `PlanDetails` value objects implement `JsonSerializable` to output snake_case keys, matching the TypeScript type definitions.

- `StoreProjectAction::seedLimits` is public; billing and usage controllers call it lazily for projects that pre-date the `project_limits` migration.

### Phase 3 — Storage and Attachments

21. Configure DigitalOcean Spaces as an S3-compatible disk in `config/filesystems.php`. Use env vars; default to local disk in tests. Commit.
22. Create `Attachment` model and migration per `PRODUCT.md` (polymorphic `attachable_type`/`attachable_id`, `project_id` denormalized, `uploaded_by`, `filename`, `url`, `disk`, `mime_type`, `size_bytes`). Add `AttachmentFactory`. Index `(project_id)` and `(attachable_type, attachable_id)`. Commit.
23. Create `app/Models/Concerns/HasAttachments.php` trait providing the `attachments()` morphMany. Commit.
24. Create `UploadAttachmentAction` that validates MIME + size + storage quota (rejects if `$project->usedStorageBytes() + $size > $project->storageQuotaBytes()`), uploads to the configured disk, persists the `Attachment` row. Commit.
25. Create `DeleteAttachmentAction` that deletes the file from disk and the row. Commit.
26. Build the storage meter component (`resources/js/components/layout/storage-meter.tsx`) shown above the user menu in the bottom-left (`designs/Dashboard.jpg`). Format: `1.5 / 10 GB`. Commit.
27. ~~Build the storage management page (admin only): list largest attachments project-wide with delete buttons.~~ **Delivered differently:** the storage meter in the sidebar links to the existing Usage settings page (`/settings/usage/{project}`), which already shows the storage progress bar. No dedicated storage management page was built. The Usage page gained "Get more" links on each resource row linking to the corresponding recharge pack on the Billing page.
28. Write feature tests for upload, quota enforcement, deletion, and storage meter accuracy. Commit.

### Phase 4 — App Shell and Navigation

29. ~~Build the persistent app layout component.~~ **SKIPPED** — already provided by the React starter kit.
30. ~~Build the AI assistant panel skeleton.~~ **DEFERRED** — implemented in Phase 10 alongside the AI SDK.
31. ~~Build a `ContextBreadcrumb` component.~~ **SKIPPED** — already provided by the React starter kit.
32. ~~Wire the global `⌘K` command palette.~~ **DEFERRED** — implemented in Phase 12 alongside Laravel Scout.

### Phase 5 — Boards

33. Create `Board` model and migration. Columns: `id` (uuid), `project_id`, `name`, `description` (text, nullable), `template` (string, cast `BoardTemplate::class`), `position` (int), timestamps + soft deletes. `BoardFactory`. Commit.
34. Create `BoardColumn` model and migration. Columns: `id` (uuid), `board_id`, `name`, `position` (int). `BoardColumnFactory`. Commit.
35. Create `app/Support/BoardTemplates.php` mapping each `BoardTemplate` enum value to its default columns. Commit.
36. Build Board actions: `IndexBoardAction`, `CreateBoardAction` (validates plan board limit, creates default columns from template, creates the board chatroom — wired in Phase 7), `StoreBoardAction`, `ShowBoardAction`, `UpdateBoardAction`, `DestroyBoardAction`. Commit.
37. Build Board routes and Inertia pages. `pages/boards/index.tsx` matches `designs/Boards/Index.jpg`, `pages/boards/create.tsx` matches `designs/Boards/Create.jpg`, `pages/boards/show.tsx` matches `designs/Boards/Show.jpg` (kanban), `pages/boards/edit.tsx` matches `designs/Boards/Edit.jpg`. Commit.
38. Build the kanban view: column components horizontally scrollable, task cards, drag-and-drop between columns using `@dnd-kit/core`. Hook `useBoardDragAndDrop` owns reorder state + the optimistic update + the `MoveTaskAction` call. Commit.

### Phase 6 — Tasks

39. Create `Task` model and migration. Columns: `id`, `board_column_id`, `board_id` (denormalized), `project_id` (denormalized), `title`, `description` (text, nullable), `position` (int), `priority` (string, cast `TaskPriority::class`, default `TaskPriority::Medium->value`), `due_date` (date, nullable), `estimate_minutes` (int, nullable), `elapsed_seconds` (int, default 0), `time_tracker_started_at` (timestamp, nullable), `completed_at` (timestamp, nullable). `TaskFactory`. Commit.
40. Create `TaskItem` model and migration. Columns: `id` (uuid), `task_id` (cascade delete), `text` (string), `done` (boolean, default false), `position` (int). `TaskItemFactory`. Implement `Task::items()` hasMany ordered by position; expose a `completion` accessor returning `[done, total]`. Commit.
41. Create `Label` model and migration: `id`, `board_id`, `name`, `color` (hex string). Create `task_label` pivot. `LabelFactory`. Commit.
42. Create `task_assignees` pivot table. Implement `Task::assignees()`. Commit.
43. Build Task actions: `IndexTaskAction`, `StoreTaskAction`, `ShowTaskAction`, `UpdateTaskAction`, `DestroyTaskAction`, `MoveTaskAction`, `AddTaskItemAction`, `ToggleTaskItemAction`, `RemoveTaskItemAction`, `ReorderTaskItemsAction`, `StartTimerAction`, `StopTimerAction`. Commit.
44. Build Task routes and the task detail page `pages/tasks/show.tsx` matching `designs/Task/Edit.jpg`: title + task #, description with formatting toolbar + Ask AI (button stub; wired in Phase 10), Checklist (rendered from `TaskItem` records) with completion bar, Attachments grid, Discussions (linked task chatroom — wired in Phase 7), right sidebar (Column, Priority, Assigned To, Tags, Due Date, Estimate, Time Tracker with elapsed bar + End Task button, Previous/Next Task navigation derived from board ordering). Commit.

### Phase 7 — Chat (Messages)

45. Create `Chatroom` model and migration: `id`, `chatroomable_type` + `chatroomable_id` (polymorphic), `project_id` (denormalized). Index polymorphic columns. `ChatroomFactory`. Commit.
46. Hook chatroom auto-creation: in `StoreProjectAction`, `StoreBoardAction`, `StoreTaskAction`, also create the matching `Chatroom`. Add a one-off command to backfill any rows created earlier in dev. Commit.
47. Create `Message` model and migration: `id`, `chatroom_id`, `user_id`, `body` (text), `parent_message_id` (nullable). Add `HasAttachments`. `MessageFactory`. Commit.
48. Create `message_reads` pivot (`message_id`, `user_id`, `read_at`). Commit.
49. Create `message_mentions` pivot (`message_id`, `user_id`). Parse `@username` references in `StoreMessageAction` and persist mentions. Commit.
50. Build Message actions: `IndexMessageAction` (cursor pagination), `StoreMessageAction`, `UpdateMessageAction`, `DestroyMessageAction`, `MarkAsReadAction`. Commit.
51. Set up Laravel Reverb. Configure Echo on the frontend. Broadcast `MessageSent` and `MessageUpdated` events on private chatroom channels. Auth the channels via `routes/channels.php` against `Project::members()`. Commit.
52. Build the standalone Messages page `pages/messages/index.tsx` matching `designs/Messages/Index.jpg`: left list of chatrooms with All / Unread / Mentions filters, main thread, bottom composer with formatting + Ask AI + send. Commit.
53. Build the **inline discussions** component used inside Task and Page detail pages. Match `designs/Task/Edit.jpg` and `designs/Pages/Show.jpg`. Commit.
54. Write feature tests for messaging, mentions, read receipts, and broadcast authorization. Commit.

### Phase 8 — Pages (S3-versioned content, Reverb-only)

55. Install Tiptap dependencies (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`, `@tiptap/extension-image`, `@tiptap/extension-link`). No Y.js, no Hocuspocus. Commit.
56. Create `Page` model and migration. Columns: `id`, `project_id`, `created_by`, `title`, `head_content_id` (foreign uuid → page_contents, nullable until first save), `last_edited_by`, `last_edited_at`, soft deletes. Add `HasAttachments` (for inline images dropped into pages — these are separate from the Tiptap doc itself). `PageFactory`. Commit.
57. Create `PageContent` model and migration. Columns: `id` (uuid), `page_id` (foreign uuid → pages, cascade delete), `project_id` (denormalized for storage-quota queries), `path` (string, disk-relative path of the JSON file), `disk` (string), `size_bytes` (bigint), `created_by` (foreign uuid → users), `created_at`. **No `updated_at`, no soft deletes** — versions are immutable and pruned by retention. Index `(page_id, created_at desc)`. `PageContentFactory`. Update `Project::usedStorageBytes()` to include `PageContent::where('project_id', $id)->sum('size_bytes')`. Commit.
58. Create `Tag` model and migration: `id`, `project_id`, `name`, `color` (string, nullable). Unique on `(project_id, name)`. Create the `page_tag` pivot. Implement `Page::tags()` and `Tag::pages()`. `TagFactory`. Commit.
59. Build Page actions:
    - `IndexPageAction`, `ShowPageAction` (returns page metadata only — title, tags, last-edited info; **not** content).
    - `StorePageAction` — creates the page row, generates an empty Tiptap doc (`{type:'doc',content:[{type:'paragraph'}]}`), uploads it to disk at `pages/{page_id}/{Str::ulid()}.json`, creates a `PageContent` row, sets `head_content_id`, all in one transaction.
    - `UpdatePageAction` — receives the new Tiptap doc, validates the project's storage quota, uploads to a new path, creates a new `PageContent` row, atomically advances `head_content_id` and `last_edited_*`, broadcasts `PageContentUpdated` (carrying only the page id) on the page's private channel. **No version counter, no 409.**
    - `GetPageContentAction` — reads the file at the head's path via `Storage::disk($head->disk)->get($head->path)`, decodes JSON, returns the array. This is what the editor calls on mount and after each broadcast.
    - `DestroyPageAction` — soft-deletes the page; a follow-on observer (Phase 11) handles the disk-level cleanup of orphaned content files when the page is force-deleted.
    - `AttachTagAction`, `DetachTagAction`.
    Commit.
60. Build the Tiptap editor component (`resources/js/components/page/page-editor.tsx`) — toolbar matches `designs/Pages/Show.jpg` (H, B, I, U, ¶, ul, ol, Ask AI). Hook `usePageEditor` fetches initial content from `GET /pages/{id}/content` (which calls `GetPageContentAction`), holds Tiptap state, and triggers a 1-second debounced autosave to `UpdatePageAction`. Inline images upload via `UploadAttachmentAction` and embed by attachment URL. Commit.
61. Wire real-time updates via Reverb: the hook subscribes to the page's private channel; on `PageContentUpdated`, if the editor is *not* focused, refetch from `GET /pages/{id}/content` and replace silently; if *focused*, show a non-blocking "New changes available" toast that refetches on click. Use a Reverb presence channel to render avatars of users currently viewing the page (matches the Activity sidebar in `designs/Pages/Show.jpg`). Commit.
62. Build Page routes and Inertia pages. `pages/pages/index.tsx` matches `designs/Pages/Index.jpg`. `pages/pages/show.tsx` matches `designs/Pages/Show.jpg`. Commit.
63. Write feature tests: page CRUD; each save creates a new `PageContent` row and the disk file actually exists; `head_content_id` advances atomically with the last-edited fields; concurrent saves both succeed and the later one wins as head; `PageContentUpdated` broadcast fires on every save; tag attach/detach; storage-quota rejection on oversized content (no orphan PageContent row, no orphan disk file). Commit.

### Phase 9 — Meetings

64. Create `Meeting` model and migration: `id`, `project_id`, `title`, `scheduled_at`, `duration_minutes`, `created_by`, `videosdk_room_id` (nullable until started), `notes_page_id` (nullable foreign uuid → pages), `recording_attachment_id` (nullable), `transcript` (longText, nullable), `summary` (text, nullable). Add `HasAttachments`. `MeetingFactory`. Commit.
65. Create `meeting_attendees` pivot: `meeting_id`, `user_id`, `rsvp` (string, cast `MeetingRsvp::class`). Commit.
66. Configure VideoSDK keys in env. Create `app/Services/VideoSdk.php` wrapping create-room, end-room, recording start/stop. Commit.
67. Build Meeting actions: `IndexMeetingAction`, `ScheduleMeetingAction`, `StartMeetingAction`, `EndMeetingAction` (records minutes against `meeting_minutes_used_this_period` with overage drawing from `recharge_meeting_minutes`), `StartRecordingAction` (Advanced/recharge gated), `GenerateTranscriptAction` (Advanced/recharge gated; consumes AI tokens via the agent built in Phase 10), `GenerateSummaryAction` (likewise). Commit.
68. Build Meeting routes and Inertia pages: `pages/meetings/index.tsx`, `pages/meetings/show.tsx` (in-call view with VideoSDK web component), `pages/meetings/schedule.tsx`. Commit.
69. Write feature tests: meeting minutes tracking, recharge overage, recording gating. Transcript and summary tests come in Phase 10 once the agent exists. Commit.

### Phase 10 — AI Assistant (via Laravel AI SDK)

70. Install the Laravel AI SDK (`composer require laravel/ai`), publish the package's config and migrations (`php artisan vendor:publish --provider="Laravel\Ai\AiServiceProvider"`), run the migrations (this creates `agent_conversations` and `agent_conversation_messages` — package-owned, per the conventions exception). Configure `config/ai.php` to route the OpenAI driver through LLM Gateway via `OPENAI_BASE_URL` and `OPENAI_API_KEY`. Set the default text model string to GPT OSS 120B; verify by running a smoke prompt via `tinker`. Commit.
71. Create `RecordTokenUsageAction` in `app/Actions/Subscription/`: checks available tokens via `$project->availableAiTokens()`, throws `OutOfTokensException` (defined in `app/Exceptions/`) if zero, otherwise appends a `ProjectUsage` row with `type = UsageType::AiTokens` and `amount = $tokens`. The `availableAiTokens()` accessor (Task 15) owns the bucket math — this action only records consumption. Commit.
72. Create AI middleware classes in `app/Ai/Middleware/`. Try `php artisan make:agent-middleware` first; if the command isn't registered, create the files by hand — middleware is a plain class with a `handle(AgentPrompt $prompt, Closure $next)` method. `EnforceTokenQuota` rejects with `OutOfTokensException` if the project has zero available tokens *before* the call. `RecordTokenUsage` deducts `$response->usage->totalTokens` via the `then($response)` callback after the call. Each middleware accepts the `Project` in its own constructor — the agent (Task 73) passes `$this->project` to both when it builds its middleware array. Commit.
73. Create the main agent via `php artisan make:agent ZenPeepsAssistant`. Implements `Agent`, `Conversational`, `HasTools`, `HasMiddleware`, uses the `Promptable` and `RemembersConversations` traits. Constructor: `Project $project, User $user`. Instructions describe a colleague who can take action across boards, chat, and pages — not a chatbot. The `tools()` method returns instances of the cross-module tools (Task 74) constructed with `$this->project` and `$this->user` so they have authorization context. The `middleware()` method returns `[new EnforceTokenQuota($this->project), new RecordTokenUsage($this->project)]`. Commit.
74. Create cross-module tools via `php artisan make:tool` in `app/Ai/Tools/`: `MoveTaskTool`, `AssignTaskTool`, `MarkTaskDoneTool`, `CreateTaskTool`, `SendChatMessageTool`, `UpdatePageSectionTool`, `SummarizeChatTool`. Each tool's constructor accepts `Project $project, User $user` (the agent passes these in when building its `tools()` array). The `handle(Request $request)` method receives the LLM's tool-call arguments, authorizes against `$this->project->members()`, and mutates state. Commit.
75. Build the streaming endpoint and route. `POST /assistant/stream` accepts `{ prompt }`, scoped to the current project. The route resolves the agent via `(new ZenPeepsAssistant(project: $project, user: $user))->forUser($user)` and returns `->stream($prompt)`. Wire the assistant panel hook (`resources/js/hooks/use-assistant.ts`) to consume the SSE stream. Commit.
76. Wire suggested-action cards: each Inertia controller passes `suggestedActions` props (e.g., on Boards index → "Clarify project requirements", "Develop initial wireframes"; on Task show → "Summarize this task", "Generate checklist", "Suggest next steps", "Find blockers" — match the cards in the design screenshots). Clicking a card sends the template as the next prompt to `/assistant/stream`. Commit.
77. Implement persistent execution: when the user navigates mid-stream, the request continues server-side via the agent's `broadcastOnQueue` method, broadcasting streamed chunks to a per-user private channel. The panel re-attaches across navigation by subscribing to that channel on every page load and resuming the active stream if any. Commit.
78. Wire `GenerateTranscriptAction` and `GenerateSummaryAction` (from Phase 9) to call dedicated anonymous agents via `Laravel\Ai\agent(...)` configured with the same LLM Gateway provider. Both consume tokens via the same middleware path. Commit.
79. Write feature tests using `ZenPeepsAssistant::fake()`: tokens deducted after each prompt, exhaustion blocks the next prompt with `OutOfTokensException`, tools mutate state and write activity rows, the trial 1M tokens is granted exactly once to new Spark projects and not refilled. Commit.

### Phase 11 — Activity Tracking

80. Create the single `Activity` model and migration. Columns: `id` (uuid), `project_id`, `user_id` (nullable), `model_type` (string), `model_id` (uuid, polymorphic — no FK constraint so activities outlive soft-deletes), `action` (string, cast `ActivityAction::class`), `target` (string, nullable), `from_value` (string, nullable), `to_value` (string, nullable), `excerpt` (text, nullable), `title_snapshot` (string). Index `(project_id, created_at desc)` and `(model_type, model_id)`. **No soft deletes** — activities are pruned. `ActivityFactory`. Commit.
81. Implement the `message` accessor on `Activity` returning a markdown string. Use `app/Support/ActivityMessages.php` with per-action templates: `Created` → `"**{user}** created {model_label} **{title_snapshot}**"`, `Updated` → `"**{user}** updated {model_label} **{title_snapshot}**"`, `Moved` → `"**{user}** moved {model_label} **{title_snapshot}** to **{to_value}**"`, `Commented` → `"**{user}** commented on {model_label} **{title_snapshot}**"`, `Assigned` → `"**{user}** assigned **{target}** to {model_label} **{title_snapshot}**"`. `model_label` is derived from `model_type`. Null user → `"Someone"`. Commit.
82. Wire model observers on `Page`, `Task`, `Board`, `Meeting`, `Message`, `Attachment`, `PageContent` that write `Activity` rows on create/update/delete and on domain-specific events (`MoveTaskAction` → `Moved`; checklist toggle → `Updated`; assignment changes → `Assigned`; new `PageContent` → `Updated` on the page). Every observer captures the model's current title in `title_snapshot`. Commit.
83. Add scheduled command `php artisan retention:prune` running daily that hard-deletes (a) `Activity` rows older than 7 days, (b) `PageContent` rows older than 7 days *except* the row currently referenced by `pages.head_content_id` (each deletion also removes the disk file), and (c) `ProjectUsage` rows older than 90 days. Document in the README. Note in code that S3-versioned rollback is post-MVP and will use the activity history + retained `PageContent` rows as its index. Commit.

### Phase 12 — Dashboards & Search

84. Build the project dashboard page `pages/dashboard.tsx` matching `designs/Dashboard.jpg`: stat cards (Tasks / Messages / Meetings with deltas), Recent Activity feed driven by the `Activity` model (rendered as markdown via the `message` accessor), Boards row, Messages row, Meetings row. The route is `GET /dashboard` (already gated by `current-project`); pull the active project from session — no `{project}` in the URL. Commit.
85. Build the global dashboard `pages/global-dashboard.tsx` aggregating across the user's projects: overdue tasks, upcoming meetings, unread messages, project health indicators. Reachable from a project switcher menu item. Commit.
86. Implement search: a single `SearchAction` that scopes by current project and returns matches across boards, tasks, pages, and messages. Use Laravel Scout's database driver. Wire to the `⌘K` palette. Commit.

### Phase 13 — Marketing & Sign-up

87. Create marketing routes (`/`, `/pricing`, `/about`, `/sign-up`) outside the auth-gated middleware. Build `pages/marketing/landing.tsx` and `pages/marketing/about.tsx`. Use shadcn primitives only; image placeholders are `Skeleton` components in correct aspect ratios. Hero copy is grounded in the differentiators: project-based pricing, no per-seat tax, integrated AI, radical simplicity. Commit.
88. Build the pricing page `pages/marketing/pricing.tsx` with the four-plan table from `PRODUCT.md` and the recharge packs section. The "Get started" CTA on Spark goes to `/sign-up`; Basic/Pro/Advanced go to `/sign-up?plan=…`. Commit.
89. Build the sign-up flow that creates a User, prompts for first project name, creates the project on the selected plan (defaults to Spark), seeds the project chatroom + a "Welcome" page (with an initial `PageContent` version) + a default board, and redirects to the project dashboard. Commit.

### Phase 14 — Polish, Tests, Deploy

90. Add `tests/Browser/SmokeTest.php` (Pest 4 browser test) that visits every authenticated route as a project admin and asserts no JS errors and no console logs. Commit.
91. Add architecture tests in `tests/Feature/ArchitectureTest.php`: actions live in `App\Actions`, models extend nothing but `Model`, controllers thin (no `::query()` calls), and a guard test that asserts no migration uses `->json(...)` (catches future drift from the no-JSON convention). Commit.
92. Run `php artisan test --compact` and `composer analyse`. Fix every failure. Target 100% green. Commit.
93. Create `database/seeders/DemoSeeder.php` that creates a demo user (`tushar@zenpeeps.test` / `password`) on the Pro plan with a project named "Aperture", three boards (mirroring the designs), a few tasks (each with a couple of `TaskItem` rows and a couple of `Label` rows), a few pages (each with one or two `PageContent` versions and a couple of `Tag` rows), some chat history, and a few activity rows. Document `php artisan db:seed --class=DemoSeeder`. Commit.
94. Write `README.md` covering: stack, setup, env vars (Reverb, VideoSDK, Spaces, OpenAI/LLM-Gateway base URL + key, payments driver — `fake` by default), running the seeder, running tests, the daily `retention:prune` schedule, the no-JSON convention with its narrow exceptions, the Reverb-only page collaboration model (S3-versioned with `head_content_id`; concurrent saves preserved as orphan versions; document the post-MVP CRDT-collab and rollback paths), and how to run the Laravel AI SDK against LLM Gateway. Commit.

---

## Out of scope for this build

The following are explicitly deferred to post-MVP and must NOT be added without a separate decision:

- **Workflows.** Trigger/condition/action automation. Distribution comes before power-user features.
- **Business Intelligence.** Post-mortems, bottleneck analysis, on-time-delivery rate, SOP suggestions. The AI assistant has general capabilities but no BI-specific tools.
- **CRDT-based real-time collaboration** on pages. The `head_content_id` swap with broadcast refetch is the MVP collab model.
- **Page rollback / restore UI.** Phase 11 builds the activity tracker and Phase 8 retains 7 days of `PageContent` versions; the user-facing rollback UI is post-MVP.
- **Real Stripe wiring.** The fake payment provider is the default; the Stripe stub throws on use.
- External integrations (Slack/email/third-party APIs).
- Mobile apps.
- Subtasks, task dependencies, recurring tasks, custom fields beyond Priority.
- Page templates, wikis, databases-in-pages.
- Meeting breakout rooms, polls, virtual backgrounds.
- SSO, audit logs, advanced permissions, compliance features.
- Public API.
- File browser / file version history.

If a task above tempts an "easy" expansion into one of these, resist. Flag it in `STATUS.md` and continue.
