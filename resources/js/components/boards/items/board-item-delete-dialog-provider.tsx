import { useForm } from '@inertiajs/react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { destroy } from '@/routes/boards/items';
import type { BoardItem } from '@/types/board';

type BoardItemDialogContextValue = {
    confirmDelete: (item: BoardItem) => void;
};

const BoardItemDialogContext =
    createContext<BoardItemDialogContextValue | null>(null);

export function useBoardItemDialog(): BoardItemDialogContextValue {
    const ctx = useContext(BoardItemDialogContext);

    if (!ctx) {
        throw new Error(
            'useBoardItemDialog must be used inside a BoardItemDeleteDialogProvider',
        );
    }

    return ctx;
}

export function BoardItemDeleteDialogProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [item, setItem] = useState<BoardItem | null>(null);

    const confirmDelete = useCallback((target: BoardItem) => {
        setItem(target);
    }, []);

    const close = useCallback(() => setItem(null), []);

    const value = useMemo(() => ({ confirmDelete }), [confirmDelete]);

    return (
        <BoardItemDialogContext.Provider value={value}>
            {children}
            <BoardItemDeleteDialog item={item} onClose={close} />
        </BoardItemDialogContext.Provider>
    );
}

function BoardItemDeleteDialog({
    item,
    onClose,
}: {
    item: BoardItem | null;
    onClose: () => void;
}) {
    const currentTeam = useCurrentTeam();
    const open = item !== null;

    const { delete: destroyForm, processing, reset } = useForm({});

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    if (!item) {
        return (
            <Dialog open={false} onOpenChange={() => onClose()}>
                <DialogContent />
            </Dialog>
        );
    }

    const submit = () => {
        destroyForm(
            destroy({
                current_team: currentTeam.slug,
                board: item.board_id,
                item: item.id,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => onClose(),
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete task</DialogTitle>
                    <DialogDescription>
                        This will permanently delete{' '}
                        <span className="font-semibold text-foreground">
                            #{item.number} {item.title}
                        </span>{' '}
                        and any of its comments, attachments, and checklist
                        items. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={submit}
                        disabled={processing}
                    >
                        Delete task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
