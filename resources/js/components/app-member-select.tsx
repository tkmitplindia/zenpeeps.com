import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/auth';
import { ChevronDown, UsersIcon } from 'lucide-react';

export interface AppMemberSelectProps {
    value: string[];
    members: User[];
    onChange: (data: string[]) => void;
    variant: 'grid' | 'dropdown';
}

export function AppMemberSelect({
    value,
    members,
    onChange,
    variant,
}: AppMemberSelectProps) {
    const toggleMember = (id: string) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    function selectedMembers() {
        if (value.length === 0) {
            return <span>Select members</span>;
        }

        return (
            <div className="flex gap-2">
                {value.map((id) => (
                    <div className="flex items-center gap-1">
                        <Avatar key={id}>
                            <AvatarImage
                                src={members.find((m) => m.id === id)?.avatar}
                                alt={members.find((m) => m.id === id)?.name}
                            />
                            <AvatarFallback>
                                {members
                                    .find((m) => m.id === id)
                                    ?.name.substring(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span>{members.find((m) => m.id === id)?.name}</span>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'grid') {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center space-x-3 rounded-lg border p-3 shadow-xs"
                    >
                        <Checkbox
                            id={`member-${member.id}`}
                            checked={value.includes(member.id)}
                            onCheckedChange={() => toggleMember(member.id)}
                        />
                        <label
                            htmlFor={`member-${member.id}`}
                            className="flex flex-1 cursor-pointer items-center space-x-3"
                        >
                            <Avatar>
                                <AvatarImage
                                    src={member.avatar}
                                    alt={member.name}
                                />
                                <AvatarFallback>
                                    {member.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                                {member.name}
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" />
                        <div className="flex gap-2">{selectedMembers()}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-xl" align="start">
                {members.map((member) => (
                    <DropdownMenuCheckboxItem
                        key={member.id}
                        checked={value.includes(member.id)}
                        onCheckedChange={() => toggleMember(member.id)}
                        className="flex items-center gap-3"
                    >
                        <Avatar className="h-6 w-6">
                            <AvatarImage
                                src={member.avatar}
                                alt={member.name}
                            />
                            <AvatarFallback>
                                {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
