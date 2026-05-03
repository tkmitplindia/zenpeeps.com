<?php

namespace App\Actions\BoardItems;

use App\Models\BoardItem;

final class StopTimeTrackerAction
{
    public function execute(BoardItem $item): BoardItem
    {
        if ($item->time_tracker_started_at === null) {
            return $item;
        }

        $elapsed = (int) $item->time_tracker_started_at->diffInSeconds(now());

        $item->update([
            'tracked_seconds' => $item->tracked_seconds + $elapsed,
            'time_tracker_started_at' => null,
        ]);

        return $item->refresh();
    }
}
