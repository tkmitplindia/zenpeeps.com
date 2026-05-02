# ZenPeeps Build Status

| #  | Task                                                              | Status   | Commit     | Notes                               |
|----|-------------------------------------------------------------------|----------|------------|-------------------------------------|
| 1  | Foundation + model scaffolding                                    | DONE     | 14eb46f    |                                     |
| 2  | Create the backed enums upfront                                   | DONE     | 8cdfbaa    |                                     |
| 3  | Extend the default `User` migration to use a UUID primary key...  | DONE     | efd45ad    |                                     |
| 4  | Create `Project` model and migration                              | DONE     | 2a3a617    |                                     |
| 5  | Create `project_members` pivot table migration                    | DONE     | a5620c6    |                                     |
| 6  | Implement `Project::members()` (`belongsToMany` through `proje... | DONE     | ef8cf8c    |                                     |
| 7  | Build Project actions                                             | DONE     | 5abbb52    |                                     |
| 8  | Build Project routes (`routes/web.php`) and Inertia pages         | DONE     | 09e8bd5    | Plan picker upgraded to ProjectPlanSelect radio cards — 9277eb2 |
| 9  | Build the project switcher component (`resources/js/components... | DONE     | d7b867a    |                                     |
| 10 | Build `InviteMemberAction` and `RemoveMemberAction`               | DONE     | 2067ae0    | Mail render bug fixed (ucfirst on enum) — 9277eb2               |
| 11 | Write feature tests                                               | DONE     | ab594c0    |                                     |
| 12 | Create `ProjectLimits` + `ProjectUsage` models, `UsageType` enum | DONE     | 36c11a6    |                                     |
| 13 | Create `app/Support/Plans.php` returning the plan matrix         | DONE     | 60c4878    |                                     |
| 14 | Create `app/Support/RechargePacks.php` — five $5 recharge packs  | DONE     | ac06e25    |                                     |
| 15 | Create `ProjectQuotas` concern with `availableAiTokens()`        | DONE     | 4edba7f    |                                     |
| 16 | Create the payment provider abstraction + FakePaymentProvider    | DONE     | d7c34bc    |                                     |
| 17 | Create `PurchaseRechargeAction`                                   | DONE     | f4d5147    |                                     |
| 18 | Create scheduled command `php artisan billing:reset-period`      | DONE     | 43b50a0    |                                     |
| 19 | Build the recharge purchase UI on the project settings page      | DONE     | f51a45b    |                                     |
| 20 | Write Phase 2 feature tests                                       | DONE     | 4ff2b53    |                                     |
| —  | Billing settings page (`/settings/billing/{project}`)            | DONE     | 35be443    | Plan summary, change plan, recharges; fixes 29c53e7, df361c3 |
| —  | Usage settings page (`/settings/usage/{project}`)                | DONE     | 35be443    | Per-resource progress bars for current billing period       |
| 21 | Configure DigitalOcean Spaces as an S3-compatible disk in `con... | DONE     | d9d4ac5    |                                     |
| 22 | Create `Attachment` model and migration per `PRODUCT.md` (poly... | DONE     | a48abd6    |                                     |
| 23 | Create `app/Models/Concerns/HasAttachments.php` trait providin... | DONE     | a48abd6    |                                     |
| 24 | Create `UploadAttachmentAction` that validates MIME + size + s... | DONE     | a48abd6    |                                     |
| 25 | Create `DeleteAttachmentAction` that deletes the file from dis... | DONE     | a48abd6    |                                     |
| 26 | Build the storage meter component (`resources/js/components/la... | DONE     | 71b93fd    | Links to usage page instead of dedicated storage page       |
| 27 | Build the storage management page (admin only)                    | DONE     | bd222bc    | No dedicated page — storage meter links to existing usage page |
| 28 | Write feature tests for upload, quota enforcement, deletion, a... | DONE     | 71b93fd    |                                     |
| —  | Add "Get more" links on usage page → billing recharge packs       | DONE     | 107d4aa    | Each resource row links to billing#{pack_key}               |
| 29 | Build the persistent app layout component (`resources/js/compo... | SKIPPED  | -          | Already provided by the React starter kit                   |
| 30 | Build the AI assistant panel skeleton                             | SKIPPED  | -          | Deferred until Phase 10 (AI SDK)                            |
| 31 | Build a `ContextBreadcrumb` component for the top bar           | SKIPPED  | -          | Already provided by the React starter kit                   |
| 32 | Wire the global `⌘K` command palette                             | SKIPPED  | -          | Deferred until Phase 12 (Laravel Scout)                     |
| 33 | Create `Board` model and migration                                | DONE     | 5f2160e    |                                     |
| 34 | Create `BoardColumn` model and migration                          | DONE     | 5f2160e    |                                     |
| 35 | Create `app/Support/BoardTemplates.php` mapping each `BoardTem... | DONE     | 5f2160e    |                                     |
| 36 | Build Board actions                                               | DONE     | 5f2160e    | CRUD + MoveTaskAction with position recompaction            |
| 37 | Build Board routes and Inertia pages                              | DONE     | 5f2160e    | index, create, edit, show pages; PATCH move endpoint        |
| 38 | Build the kanban view                                             | DONE     | 5f2160e    | @dnd-kit drag-and-drop with optimistic updates              |
| —  | UI polish & component modularisation (Phase 5)                   | DONE     | 0421d52    | Design alignment; split all board pages into components; ListInput, Fallback, BoardDeleteDialog, date-fns relative time, pagination |
| 39 | Create `Task` model and migration                                 | DONE     | 5f2160e    |                                     |
| 40 | Create `TaskItem` model and migration                             | DONE     | 9ea135f    | task_items with uuid pk, HasUuid, items() + completion accessor on Task |
| 41 | Create `Label` model and migration                                | DONE     | 9657cf4    | labels + task_label pivot; HasUuid; board/tasks relations   |
| 42 | Create `task_assignees` pivot table                               | DONE     | 5f2160e    |                                     |
| 43 | Build Task actions                                                | DONE     | d3aabfb    | 12 actions: CRUD, move, items, timer; tasks table extended with priority/estimate/timer columns |
| 44 | Build Task routes and the task detail page `pages/tasks/show.t... | DONE     | 6bf6ca4    | Full task detail page matching design; sidebar with timer, prev/next nav; 8 tests pass |
| —  | UI polish & component modularisation (Phase 6)                   | DONE     | 326c317    | tasks.create route; component split (TaskCreateForm, TaskHeader, TaskCreateSidebar); DnD handle fix; click-to-navigate on task cards |
| 45 | Create `Chatroom` model and migration                             | TODO     | -          |                                     |
| 46 | Hook chatroom auto-creation                                       | TODO     | -          |                                     |
| 47 | Create `Message` model and migration                              | TODO     | -          |                                     |
| 48 | Create `message_reads` pivot (`message_id`, `user_id`, `read_at`) | TODO     | -          |                                     |
| 49 | Create `message_mentions` pivot (`message_id`, `user_id`)         | TODO     | -          |                                     |
| 50 | Build Message actions                                             | TODO     | -          |                                     |
| 51 | Set up Laravel Reverb                                             | TODO     | -          |                                     |
| 52 | Build the standalone Messages page `pages/messages/index.tsx`...  | TODO     | -          |                                     |
| 53 | Build the inline discussions component used inside Task and Pa... | TODO     | -          |                                     |
| 54 | Write feature tests for messaging, mentions, read receipts, an... | TODO     | -          |                                     |
| 55 | Install Tiptap dependencies (`@tiptap/react`, `@tiptap/starter... | TODO     | -          |                                     |
| 56 | Create `Page` model and migration                                 | TODO     | -          |                                     |
| 57 | Create `PageContent` model and migration                          | TODO     | -          |                                     |
| 58 | Create `Tag` model and migration                                  | TODO     | -          |                                     |
| 59 | Build Page actions:                                               | TODO     | -          |                                     |
| 60 | Build the Tiptap editor component (`resources/js/components/pa... | TODO     | -          |                                     |
| 61 | Wire real-time updates via Reverb                                 | TODO     | -          |                                     |
| 62 | Build Page routes and Inertia pages                               | TODO     | -          |                                     |
| 63 | Write feature tests                                               | TODO     | -          |                                     |
| 64 | Create `Meeting` model and migration                              | TODO     | -          |                                     |
| 65 | Create `meeting_attendees` pivot                                  | TODO     | -          |                                     |
| 66 | Configure VideoSDK keys in env                                    | TODO     | -          |                                     |
| 67 | Build Meeting actions                                             | TODO     | -          |                                     |
| 68 | Build Meeting routes and Inertia pages                            | TODO     | -          |                                     |
| 69 | Write feature tests                                               | TODO     | -          |                                     |
| 70 | Install the Laravel AI SDK (`composer require laravel/ai`), pu... | TODO     | -          |                                     |
| 71 | Create `RecordTokenUsageAction` in `app/Actions/Subscription/`    | TODO     | -          |                                     |
| 72 | Create AI middleware classes in `app/Ai/Middleware/`              | TODO     | -          |                                     |
| 73 | Create the main agent via `php artisan make:agent ZenPeepsAssi... | TODO     | -          |                                     |
| 74 | Create cross-module tools via `php artisan make:tool` in `app/... | TODO     | -          |                                     |
| 75 | Build the streaming endpoint and route                            | TODO     | -          |                                     |
| 76 | Wire suggested-action cards                                       | TODO     | -          |                                     |
| 77 | Implement persistent execution                                    | TODO     | -          |                                     |
| 78 | Wire `GenerateTranscriptAction` and `GenerateSummaryAction` (f... | TODO     | -          |                                     |
| 79 | Write feature tests using `ZenPeepsAssistant::fake()`             | TODO     | -          |                                     |
| 80 | Create the single `Activity` model and migration                  | TODO     | -          |                                     |
| 81 | Implement the `message` accessor on `Activity` returning a mar... | TODO     | -          |                                     |
| 82 | Wire model observers on `Page`, `Task`, `Board`, `Meeting`, `M... | TODO     | -          |                                     |
| 83 | Add scheduled command `php artisan retention:prune` running da... | TODO     | -          |                                     |
| 84 | Build the project dashboard page `pages/dashboard.tsx` matchin... | TODO     | -          |                                     |
| 85 | Build the global dashboard `pages/global-dashboard.tsx` aggreg... | TODO     | -          |                                     |
| 86 | Implement search                                                  | TODO     | -          |                                     |
| 87 | Create marketing routes (`/`, `/pricing`, `/about`, `/sign-up`... | TODO     | -          |                                     |
| 88 | Build the pricing page `pages/marketing/pricing.tsx` with the...  | TODO     | -          |                                     |
| 89 | Build the sign-up flow that creates a User, prompts for first...  | TODO     | -          |                                     |
| 90 | Add `tests/Browser/SmokeTest.php` (Pest 4 browser test) that v... | TODO     | -          |                                     |
| 91 | Add architecture tests in `tests/Feature/ArchitectureTest.php`    | TODO     | -          |                                     |
| 92 | Run `php artisan test --compact` and `composer analyse`           | TODO     | -          |                                     |
| 93 | Create `database/seeders/DemoSeeder.php` that creates a demo u... | TODO     | -          |                                     |
| 94 | Write `README.md` covering                                        | TODO     | -          |                                     |
