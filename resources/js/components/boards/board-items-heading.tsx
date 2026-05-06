import { usePage } from '@inertiajs/react';
import type { BoardItemsIndexPageProps } from '@/types/board';
import Heading from '../heading';
import { BoardItemsHeadingMenu } from './board-items-heading-menu';
import { BoardItemsHeadingSearchBar } from './board-items-heading-search-bar';
import { BoardItemsHeadingSort } from './board-items-heading-sort';
import { BoardItemsHeadingViewSwitcher } from './board-items-heading-view-switcher';

export function BoardItemsHeading() {
    const { board } = usePage<BoardItemsIndexPageProps>().props;

    return (
        <div className="space-y-4">
            <Heading
                title={board.name}
                description={board.description || 'No description'}
                actions={<BoardItemsHeadingMenu />}
            />
            <div className="flex items-center justify-between">
                <BoardItemsHeadingSearchBar />
                <div className="flex items-center justify-end gap-4">
                    <BoardItemsHeadingViewSwitcher />
                    <BoardItemsHeadingSort />
                </div>
            </div>
        </div>
    );
}
