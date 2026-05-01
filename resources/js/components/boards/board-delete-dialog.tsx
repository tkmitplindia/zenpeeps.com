import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { destroy } from '@/routes/boards';
import type { Board } from '@/types';

type Props = {
    board: Board;
    children: ReactNode;
};

export function BoardDeleteDialog({ board, children }: Props) {
    const [open, setOpen] = useState(false);

    function handleDelete() {
        router.delete(destroy.url(board.id as any), {
            onSuccess: () => setOpen(false),
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete "{board.name}"?</DialogTitle>
                    <DialogDescription>
                        This will permanently delete the board and all its
                        tasks. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete board
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
