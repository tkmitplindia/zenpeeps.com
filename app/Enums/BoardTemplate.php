<?php

namespace App\Enums;

enum BoardTemplate: string
{
    case Custom = 'custom';
    case SprintPlan = 'sprint_plan';
    case BugTracker = 'bug_tracker';
    case ContentCalendar = 'content_calendar';
    case HiringPipeline = 'hiring_pipeline';
    case ProductRoadmap = 'product_roadmap';
}
