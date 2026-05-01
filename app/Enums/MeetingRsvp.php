<?php

namespace App\Enums;

enum MeetingRsvp: string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Declined = 'declined';
}
