# Admin CLI Commands

All artisan admin commands follow the `admin:` prefix convention. They use Laravel Prompts for interactive input and tables for output.

**All commands support CLI options for non-interactive use. Options are optional — if not provided, prompts will appear.**

## Team Commands

| Command | Usage |
|---|---|
| `php artisan admin:team_list` | Lists all teams with member/board counts |
| `php artisan admin:team_create` | `--name='Team Name' --owner_email='user@example.com'` |
| `php artisan admin:team_show` | `--slug='team-slug'` |
| `php artisan admin:team_update` | `--slug='team-slug' --name='New Name'` |
| `php artisan admin:team_delete` | `--slug='team-slug' --force` |

## User Commands

| Command | Usage |
|---|---|
| `php artisan admin:user_list` | Lists all users with team/board counts |
| `php artisan admin:user_show` | `--email='user@example.com'` |
| `php artisan admin:user_create` | `--name='Name' --email='user@example.com' --password='secret' --team_slug='slug'` |
| `php artisan admin:user_update` | `--email='user@example.com' --name='New Name'` |
| `php artisan admin:user_delete` | `--email='user@example.com' --force` |
| `php artisan admin:user_reset_password` | `--email='user@example.com' --password='newpass'` |
| `php artisan admin:user_verify_email` | `--email='user@example.com'` |

## Board Commands

| Command | Usage |
|---|---|
| `php artisan admin:board_list` | `--team_slug='slug' --status='active' --search='name'` |
| `php artisan admin:board_show` | `--slug='board-slug'` |
| `php artisan admin:board_create` | `--team_slug='slug' --name='Board' --description='Desc' --status='active' --creator_email='user@example.com'` |
| `php artisan admin:board_update` | `--slug='board-slug' --name='New Name' --description='New Desc' --status='active'` |
| `php artisan admin:board_delete` | `--slug='board-slug' --force` |
| `php artisan admin:board_archive` | `--slug='board-slug'` |
| `php artisan admin:board_restore` | `--slug='board-slug'` |

## BoardItem Commands

| Command | Usage |
|---|---|
| `php artisan admin:item_list` | `--board_slug='board-slug' --column_id='col-id'` |
| `php artisan admin:item_show` | `--item_id='item-uuid'` |
| `php artisan admin:item_create` | `--board_slug='slug' --column_id='col-id' --title='Title' --description='Desc' --priority='medium' --estimated_minutes='60' --due_date='2026-01-01' --assignee_emails='a@b.com,c@d.com' --tags='tag1,tag2' --creator_email='user@example.com'` |
| `php artisan admin:item_update` | `--item_id='item-uuid' --title='New Title' --description='New Desc' --priority='high' --estimated_minutes='120' --due_date='2026-02-01'` |
| `php artisan admin:item_delete` | `--item_id='item-uuid' --force` |
| `php artisan admin:item_assign` | `--item_id='item-uuid' --assignee_emails='a@b.com,c@d.com'` |
| `php artisan admin:item_move` | `--item_id='item-uuid' --column_id='col-id'` |
| `php artisan admin:item_reorder` | `--board_slug='slug' --columns='[{"id":"col-id","items":["item1","item2"]}]'` |
