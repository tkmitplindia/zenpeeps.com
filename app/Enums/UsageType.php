<?php

namespace App\Enums;

enum UsageType: string
{
    case AiTokens = 'ai_tokens';
    case MeetingMinutes = 'meeting_minutes';
    case RecordingMinutes = 'recording_minutes';
    case TranscriptMinutes = 'transcript_minutes';
}
