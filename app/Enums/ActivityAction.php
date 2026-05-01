<?php

namespace App\Enums;

enum ActivityAction: string
{
    case Created = 'created';
    case Updated = 'updated';
    case Deleted = 'deleted';
    case Restored = 'restored';
    case Completed = 'completed';
    case Assigned = 'assigned';
    case Moved = 'moved';
    case Commented = 'commented';
    case Uploaded = 'uploaded';
}
