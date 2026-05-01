<x-mail::message>
# You've been invited to {{ $projectName }}

{{ $inviterName }} added you to **{{ $projectName }}** as a **{{ ucfirst($role->value) }}**.

@if ($alreadyRegistered)
Sign in to start collaborating.
@else
Create your ZenPeeps account to accept the invitation. Make sure to register with this email address so we can link you to the project.
@endif

<x-mail::button :url="$ctaUrl">
@if ($alreadyRegistered) Open project @else Create account @endif
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
