<?php

namespace App\Actions\BoardItems;

use App\Models\BoardItem;

final class StartTimeTrackerAction
{
    public function execute(BoardItem $item): BoardItem
    {
        if ($item->time_tracker_started_at !== null) {
            return $item;
        }

        $item->update([
            'time_tracker_started_at' => now(),
            'started_at' => $item->started_at ?? now(),
        ]);

        return $item->refresh();
    }
}
