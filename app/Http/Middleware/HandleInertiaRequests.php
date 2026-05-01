<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'projects' => fn () => $user
                ? $user->projects()->orderBy('projects.name')->get()
                : [],
            'currentProject' => fn () => $this->resolveCurrentProject($request),
            'storage' => function () use ($request) {
                $project = $this->resolveCurrentProject($request);

                if (! $project) {
                    return null;
                }

                $project->load('limits');

                return [
                    'used_bytes' => $project->usedStorageBytes(),
                    'quota_bytes' => $project->storageQuotaBytes(),
                ];
            },
        ];
    }

    protected function resolveCurrentProject(Request $request): ?Project
    {
        $id = $request->session()->get('current_project_id');

        if (! $id) {
            return null;
        }

        $project = Project::find($id);

        if (! $project) {
            $request->session()->forget('current_project_id');

            return null;
        }

        return $project;
    }
}
