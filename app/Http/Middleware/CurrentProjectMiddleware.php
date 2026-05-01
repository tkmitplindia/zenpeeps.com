<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CurrentProjectMiddleware
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $id = $request->session()->get('current_project_id');

        if ($id && Project::whereKey($id)->exists()) {
            return $next($request);
        }

        $request->session()->forget('current_project_id');

        return redirect()->route('projects.index');
    }
}
