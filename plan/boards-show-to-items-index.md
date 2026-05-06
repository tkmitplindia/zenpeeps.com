# Refactoring Plan: boards.show -> boards.items.index

## Goal
Move the board items list page from `boards.show` to `boards.items.index`. When users navigate to `boards.show`, they are redirected to `boards.items.index`.

## Affected Files

### Backend (5 files)

1. **NEW: `app/Actions/BoardItems/IndexBoardItemsAction.php`**
   - Takes `Board $board`, filters (search, sort, order, view)
   - Returns `LengthAwarePaginator<BoardItem>` with eager-loaded `column`, `assignees`, `tags`, `comments`, `attachments`, `checklistItems`

2. **`app/Http/Controllers/BoardItemController.php`**
   - Add `index()` method using new action
   - Returns `inertia('boards/items/index', [...])`

3. **`app/Http/Controllers/BoardController.php`**
   - `show()`: redirect to `boards.items.index` instead of rendering Inertia page
   - `store()`: redirect target unchanged (still goes to items.index)
   - `update()`: redirect target unchanged

4. **`app/Http/Controllers/BoardColumnController.php`**
   - `store()`, `update()`, `destroy()`: redirect to `boards.items.index` instead of `boards.show`

### Frontend (12 files)

5. **NEW: `resources/js/pages/boards/items/index.tsx`**
   - Moved from `show.tsx` with component name changes

6. **Rename 11 `ShowBoard*` components to `BoardItems*`:**
   - `show-heading.tsx` -> `board-items-heading.tsx`
   - `show-heading-sort.tsx` -> `board-items-heading-sort.tsx`
   - `show-heading-search-bar.tsx` -> `board-items-heading-search-bar.tsx`
   - `show-heading-view-switcher.tsx` -> `board-items-heading-view-switcher.tsx`
   - `show-heading-menu.tsx` -> `board-items-heading-menu.tsx`
   - `show-kanban-view.tsx` -> `board-items-kanban-view.tsx`
   - `show-kanban-column.tsx` -> `board-items-kanban-column.tsx`
   - `show-kanban-card.tsx` -> `board-items-kanban-card.tsx`
   - `show-list-view.tsx` -> `board-items-list-view.tsx`
   - `show-list-section.tsx` -> `board-items-list-section.tsx`
   - `show-list-row.tsx` -> `board-items-list-row.tsx`

7. **`resources/js/types/board.ts`**
   - Add `BoardItemsIndexPageProps` type
   - Remove `BoardShowPageProps` type

8. **DELETE `resources/js/pages/boards/show.tsx`**

### Tests (4 files)

9. **Update `boards.show` references to `boards.items.index` in:**
   - `tests/Feature/BoardItemTest.php` (line 235)
   - `tests/Feature/BoardDestroyTest.php` (lines 37, 50)
   - `tests/Feature/BoardUpdateTest.php` (line 36)
   - `tests/Feature/BoardColumnCreateTest.php` (line 55)

## Unchanged
- All `boards.items.*` routes (store, show, update, destroy, reorder, etc.)
- Drag-and-drop hooks (`use-board-dnd.ts`, `use-board-item-form.ts`)
- Context menus, delete dialog providers
- Route registration (Wayfinder already generates `boards.items.index`)
