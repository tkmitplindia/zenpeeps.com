# Admin CLI Commands

All artisan admin commands follow the `admin:` prefix convention. They use Laravel Prompts for interactive input and tables for output.

## Team Commands

| Command | Usage |
|---|---|
| `php artisan admin:team_list` | Lists all teams with member/board counts |
| `php artisan admin:team_create` | Prompts for name + owner email → creates team |
| `php artisan admin:team_show` | Prompts for slug → shows team + members + invitations |
| `php artisan admin:team_update` | Prompts for slug → prompts for new name |
| `php artisan admin:team_delete` | Prompts for slug → confirmation → soft-deletes |

## User Commands

| Command | Usage |
|---|---|
| `php artisan admin:user_list` | Lists all users with team/board counts |
| `php artisan admin:user_show` | Prompts for email → shows user details + teams |
| `php artisan admin:user_create` | Prompts for name, email, password, optional team slug |
| `php artisan admin:user_update` | Prompts for email → prompts for new name |
| `php artisan admin:user_delete` | Prompts for email → confirmation → soft-deletes |
| `php artisan admin:user_reset_password` | Prompts for email → prompts for new password |
| `php artisan admin:user_verify_email` | Prompts for email → marks verified |

## Board Commands

| Command | Usage |
|---|---|
| `php artisan admin:board_list` | Prompts for team slug → optional status filter + search |
| `php artisan admin:board_show` | Prompts for slug/ID → shows board + members + columns |
| `php artisan admin:board_create` | Prompts for team slug, name, description, status, creator email |
| `php artisan admin:board_update` | Prompts for slug/ID → prompts for new name/description/status |
| `php artisan admin:board_delete` | Prompts for slug/ID → confirmation → soft-deletes |
| `php artisan admin:board_archive` | Prompts for slug/ID → sets status to archived |
| `php artisan admin:board_restore` | Prompts for slug/ID → restores soft-deleted board |

## BoardItem Commands

| Command | Usage |
|---|---|
| `php artisan admin:item_list` | Prompts for board slug/ID → optional column filter |
| `php artisan admin:item_show` | Prompts for item ID → shows full details + assignees/tags/checklist |
| `php artisan admin:item_create` | Prompts for board slug → column → title → description → priority → estimated minutes → due date → assignee emails → tags → creator email |
| `php artisan admin:item_update` | Prompts for item ID → prompts for new title/description/priority/minutes/due date |
| `php artisan admin:item_delete` | Prompts for item ID → confirmation → soft-deletes |
| `php artisan admin:item_assign` | Prompts for item ID → prompts for comma-separated assignee emails |
| `php artisan admin:item_move` | Prompts for item ID → shows current column → prompts for target column ID |
| `php artisan admin:item_reorder` | Prompts for board slug → shows current order → prompts for new item IDs per column |
