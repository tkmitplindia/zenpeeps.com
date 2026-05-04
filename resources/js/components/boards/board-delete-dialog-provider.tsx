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
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrentTeam } from '@/hooks/use-current-team';
import { destroy } from '@/routes/boards';
import type { Board } from '@/types/board';

type BoardDialogContextValue = {
    confirmDelete: (board: Board) => void;
};

const BoardDialogContext = createContext<BoardDialogContextValue | null>(null);

export function useBoardDialog(): BoardDialogContextValue {
    const ctx = useContext(BoardDialogContext);

    if (!ctx) {
        throw new Error(
            'useBoardDialog must be used inside a BoardDeleteDialogProvider',
        );
    }

    return ctx;
}

export function BoardDeleteDialogProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [board, setBoard] = useState<Board | null>(null);

    const confirmDelete = useCallback((target: Board) => {
        setBoard(target);
    }, []);

    const close = useCallback(() => setBoard(null), []);

    const value = useMemo(() => ({ confirmDelete }), [confirmDelete]);

    return (
        <BoardDialogContext.Provider value={value}>
            {children}
            <BoardDeleteDialog board={board} onClose={close} />
        </BoardDialogContext.Provider>
    );
}

function BoardDeleteDialog({
    board,
    onClose,
}: {
    board: Board | null;
    onClose: () => void;
}) {
    const currentTeam = useCurrentTeam();
    const open = board !== null;

    const {
        data,
        setData,
        delete: destroyForm,
        processing,
        errors,
        reset,
    } = useForm({ name: '' });

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    if (!board) {
        return (
            <Dialog open={false} onOpenChange={() => onClose()}>
                <DialogContent />
            </Dialog>
        );
    }

    const matches = data.name === board.name;

    const submit = () => {
        destroyForm(
            destroy({ current_team: currentTeam.slug, board: board.id }).url,
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
                    <DialogTitle>Delete board</DialogTitle>
                    <DialogDescription>
                        This will permanently delete{' '}
                        <span className="font-semibold text-foreground">
                            {board.name}
                        </span>{' '}
                        and all of its columns and tasks. This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                    <Label htmlFor="board-delete-confirm-name">
                        To confirm, type{' '}
                        <span className="font-semibold text-foreground">
                            {board.name}
                        </span>{' '}
                        below.
                    </Label>
                    <Input
                        id="board-delete-confirm-name"
                        autoComplete="off"
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && matches && !processing) {
                                e.preventDefault();
                                submit();
                            }
                        }}
                    />
                    <InputError message={errors.name} />
                </div>

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
                        disabled={!matches || processing}
                    >
                        Delete board
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
