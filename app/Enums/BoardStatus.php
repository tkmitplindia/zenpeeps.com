<?php

namespace App\Enums;

enum BoardStatus: string
{
    case Active = 'active';
    case Archived = 'archived';

    public static function getOptions(): array
    {
        return [
            self::Active->value => __('Active'),
            self::Archived->value => __('Archived'),
        ];
    }
}
