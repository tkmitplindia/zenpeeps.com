<?php

namespace App\Mail;

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProjectInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Project $project,
        public User $inviter,
        public ProjectRole $role,
        public bool $alreadyRegistered,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->inviter->name} invited you to {$this->project->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.project-invitation',
            with: [
                'projectName' => $this->project->name,
                'inviterName' => $this->inviter->name,
                'alreadyRegistered' => $this->alreadyRegistered,
                'ctaUrl' => $this->alreadyRegistered
                    ? route('projects.show', $this->project)
                    : route('register'),
            ],
        );
    }
}
