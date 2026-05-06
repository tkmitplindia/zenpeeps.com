---
name: cli-admin
description: "ACTIVATE when the user asks to create, read, update, or delete models from the CLI. Trigger when the user mentions admin commands, creating users/teams/boards, finding records by email or slug, soft-deleting, or any CRUD operation via artisan. Covers all 27 admin:* artisan commands. Do NOT activate for raw database queries, migrations, or tinker — use this skill only for the admin: command namespace."
license: MIT
metadata:
  author: zenpeeps
---

# CLI Admin Commands

All admin commands use the `admin:` prefix and support both **interactive prompts** and **CLI options** for automation.

## Quick Reference

### User CRUD

| Operation | Command |
|---|---|
| Create | `php artisan admin:user_create --name='Name' --email='user@example.com' --password='secret'` |
| Show | `php artisan admin:user_show --email='user@example.com'` |
| List | `php artisan admin:user_list` |
| Update | `php artisan admin:user_update --email='user@example.com' --name='New Name'` |
| Delete | `php artisan admin:user_delete --email='user@example.com' --force` |
| Verify email | `php artisan admin:user_verify_email --email='user@example.com'` |
| Reset password | `php artisan admin:user_reset_password --email='user@example.com' --password='newpass'` |

### Team CRUD

| Operation | Command |
|---|---|
| Create | `php artisan admin:team_create --name='Team' --owner_email='user@example.com'` |
| Show | `php artisan admin:team_show --slug='team-slug'` |
| List | `php artisan admin:team_list` |
| Update | `php artisan admin:team_update --slug='team-slug' --name='New Name'` |
| Delete | `php artisan admin:team_delete --slug='team-slug' --force` |

### Board CRUD

| Operation | Command |
|---|---|
| Create | `php artisan admin:board_create --team_slug='slug' --name='Board' --creator_email='user@example.com'` |
| Show | `php artisan admin:board_show --slug='board-slug'` |
| List | `php artisan admin:board_list --team_slug='slug'` |
| Update | `php artisan admin:board_update --slug='board-slug' --name='New Name'` |
| Delete | `php artisan admin:board_delete --slug='board-slug' --force` |
| Archive | `php artisan admin:board_archive --slug='board-slug'` |
| Restore | `php artisan admin:board_restore --slug='board-slug'` |

### BoardItem CRUD

| Operation | Command |
|---|---|
| Create | `php artisan admin:item_create --board_slug='slug' --column_id='col-id' --title='Title' --priority='medium' --creator_email='user@example.com'` |
| Show | `php artisan admin:item_show --item_id='uuid'` |
| List | `php artisan admin:item_list --board_slug='slug'` |
| Update | `php artisan admin:item_update --item_id='uuid' --title='New Title' --priority='high'` |
| Delete | `php artisan admin:item_delete --item_id='uuid' --force` |
| Assign | `php artisan admin:item_assign --item_id='uuid' --assignee_emails='a@b.com'` |
| Move | `php artisan admin:item_move --item_id='uuid' --column_id='col-id'` |
| Reorder | `php artisan admin:item_reorder --board_slug='slug' --columns='[{"id":"col-id","items":["item1","item2"]}]'` |

## Common Workflows

### Create a team, user, and board

```bash
# Create user first
php artisan admin:user_create --name='John Doe' --email='john@example.com' --password='secret123'

# Create team with that user as owner
php artisan admin:team_create --name='My Team' --owner_email='john@example.com'

# Create a board in that team
php artisan admin:board_create --team_slug='my-team' --name='Project Board' --creator_email='john@example.com'
```

### Find and update a user

```bash
# Find user by email
php artisan admin:user_show --email='john@example.com'

# Update their name
php artisan admin:user_update --email='john@example.com' --name='John Updated'
```

### Soft-delete and restore a board

```bash
# Archive a board
php artisan admin:board_archive --slug='board-slug'

# Soft-delete a board
php artisan admin:board_delete --slug='board-slug' --force

# Restore it
php artisan admin:board_restore --slug='board-slug'
```

### Assign users to items

```bash
# First find the item
php artisan admin:item_show --item_id='item-uuid'

# Assign users by email
php artisan admin:item_assign --item_id='item-uuid' --assignee_emails='a@b.com,c@d.com'
```

### Move items between columns

```bash
# Show current column
php artisan admin:item_show --item_id='item-uuid'

# Move to a different column
php artisan admin:item_move --item_id='item-uuid' --column_id='target-col-id'
```

## Important Notes

- **All options are optional** — if omitted, the command falls back to interactive prompts
- **Destructive operations** (`delete`, `archive`) use `--force` to skip confirmation prompts
- **Soft-deleted models** use `withTrashed()` — use `admin:*_show` to find them
- **Email lookups** require the user to already exist in the database
- **UUID primary keys** — always pass UUIDs as string values
- **Status values** for boards: `active`, `archived`
- **Priority values** for items: `low`, `medium`, `high`

## Best Practices

1. **Always verify before destructive operations** — use `admin:*_show` first to confirm the target
2. **Use `admin:*_list`** to find IDs/slugs before performing operations
3. **Prefer options over prompts** when automating — it's the whole point of this skill
4. **Check output tables** for confirmation of success after each command
5. **For team_slug lookups**, use the team's slug (URL-friendly version of the name), not the UUID
6. **For board_slug lookups**, commands accept either the board's slug or its UUID
