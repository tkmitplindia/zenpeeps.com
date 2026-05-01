<?php

namespace App\Support;

use App\Enums\BoardTemplate;

class BoardTemplates
{
    /** @return string[] */
    public static function columnsFor(BoardTemplate $template): array
    {
        return match ($template) {
            BoardTemplate::Custom => ['Backlog', 'In Progress', 'In Review', 'Done'],
            BoardTemplate::SprintPlan => ['Backlog', 'Sprint', 'In Progress', 'In Review', 'Done'],
            BoardTemplate::BugTracker => ['Reported', 'Triaged', 'In Progress', 'Fixed', 'Closed'],
            BoardTemplate::ContentCalendar => ['Ideas', 'Writing', 'Review', 'Scheduled', 'Published'],
            BoardTemplate::HiringPipeline => ['Applied', 'Screen', 'Interview', 'Offer', 'Hired'],
            BoardTemplate::ProductRoadmap => ['Discovery', 'Planned', 'In Progress', 'Launched'],
        };
    }
}
