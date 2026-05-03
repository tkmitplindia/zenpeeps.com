<?php

namespace App\Http\Controllers;

use App\Actions\BoardItems\StartTimeTrackerAction;
use App\Actions\BoardItems\StopTimeTrackerAction;
use App\Models\Board;
use App\Models\BoardItem;
use App\Models\Team;

class BoardItemTimeTrackerController extends Controller
{
    public function start(
        Team $current_team,
        Board $board,
        BoardItem $item,
        StartTimeTrackerAction $startTimeTrackerAction,
    ) {
        if (request()->user()->cannot('update', $item)) {
            abort(403);
        }

        $startTimeTrackerAction->execute($item);

        return back();
    }

    public function stop(
        Team $current_team,
        Board $board,
        BoardItem $item,
        StopTimeTrackerAction $stopTimeTrackerAction,
    ) {
        if (request()->user()->cannot('update', $item)) {
            abort(403);
        }

        $stopTimeTrackerAction->execute($item);

        return back();
    }
}
