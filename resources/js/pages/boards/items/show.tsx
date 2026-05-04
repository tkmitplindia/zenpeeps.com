import { Head, usePage } from '@inertiajs/react';
import { ItemForm } from '@/components/boards/items/item-form';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { index, show as showBoard } from '@/routes/boards';
import { show as showItem } from '@/routes/boards/items';
import type { Team } from '@/types';
import type { Board, BoardItem, BoardItemShowPageProps } from '@/types/board';

export default function ShowBoardItemPage() {
    useFlashToast();
    const { item } = usePage<BoardItemShowPageProps>().props;

    return (
        <div className="p-8">
            <Head title={`Task #${item.number} – ${item.title}`} />
            <ItemForm />
        </div>
    );
}

ShowBoardItemPage.layout = (props: {
    currentTeam: Team;
    board: Board;
    item: BoardItem;
}) => ({
    breadcrumbs: [
        {
            title: 'Boards',
            href: index(props.currentTeam.slug).url,
        },
        {
            title: props.board.name,
            href: showBoard({
                current_team: props.currentTeam.slug,
                board: props.board.id,
            }).url,
        },
        {
            title: `Task #${props.item.number}`,
            href: showItem({
                current_team: props.currentTeam.slug,
                board: props.board.id,
                item: props.item.id,
            }).url,
        },
    ],
});
