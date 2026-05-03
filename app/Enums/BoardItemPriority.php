<?php

namespace App\Enums;

enum BoardItemPriority: string
{
    case Low = 'low';
    case Medium = 'medium';
    case High = 'high';
    case Urgent = 'urgent';

    public static function getOptions(): array
    {
        return [
            self::Low->value => __('Low'),
            self::Medium->value => __('Medium'),
            self::High->value => __('High'),
            self::Urgent->value => __('Urgent'),
        ];
    }
}
