<?php

namespace App\Enums;

enum Plan: string
{
    case Spark = 'spark';
    case Basic = 'basic';
    case Pro = 'pro';
    case Advanced = 'advanced';
}
