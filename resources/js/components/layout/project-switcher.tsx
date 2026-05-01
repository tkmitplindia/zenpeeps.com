import { Link, router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { create, select } from '@/routes/projects';
import type { Project } from '@/types';

const projectInitial = (name: string): string =>
    (name.trim().charAt(0) || '?').toUpperCase();

export function ProjectSwitcher() {
    const { projects, currentProject } = usePage().props;
    const { isMobile } = useSidebar();

    const active =
        currentProject ??
        (projects.length > 0 ? (projects[0] as Project) : null);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent"
                            data-test="project-switcher-trigger"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                                {active ? projectInitial(active.name) : '·'}
                            </div>
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-semibold">
                                    {active?.name ?? 'No project'}
                                </span>
                                {active && (
                                    <span className="truncate text-xs text-muted-foreground uppercase">
                                        {active.plan}
                                    </span>
                                )}
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 opacity-60" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                        className="max-w-72 min-w-(--radix-dropdown-menu-trigger-width)"
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Projects
                        </DropdownMenuLabel>

                        {projects.length === 0 && (
                            <DropdownMenuItem disabled>
                                You have no projects yet.
                            </DropdownMenuItem>
                        )}

                        {projects.map((project) => (
                            <DropdownMenuItem
                                key={project.id}
                                onSelect={() =>
                                    router.post(select(project.id).url)
                                }
                                className="flex items-center gap-2"
                            >
                                <div className="flex aspect-square size-6 items-center justify-center rounded bg-muted text-xs font-medium">
                                    {projectInitial(project.name)}
                                </div>
                                <span className="flex-1 truncate">
                                    {project.name}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="ml-auto text-[10px] uppercase"
                                >
                                    {project.plan}
                                </Badge>
                                {active?.id === project.id && (
                                    <Check className="size-4" />
                                )}
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link
                                href={create()}
                                className="flex items-center gap-2 text-muted-foreground"
                            >
                                <Plus className="size-4" />
                                New project
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
