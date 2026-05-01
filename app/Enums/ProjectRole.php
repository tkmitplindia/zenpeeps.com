<?php

namespace App\Enums;

enum ProjectRole: string
{
    case Admin = 'admin';
    case Collaborator = 'collaborator';
    case Guest = 'guest';
}
