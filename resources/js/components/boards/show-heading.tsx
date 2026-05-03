import { usePage } from '@inertiajs/react';
import type { BoardShowPageProps } from '@/types/board';
import Heading from '../heading';
import { BoardShowHeadingMenu } from './show-heading-menu';
import { ShowBoardHeadingSearchBar } from './show-heading-search-bar';
import { ShowBoardHeadingSort } from './show-heading-sort';
import { ShowBoardHeadingViewSwitcher } from './show-heading-view-switcher';

export function ShowBoardHeading() {
    const { board } = usePage<BoardShowPageProps>().props;

    return (
        <div className="space-y-4">
            <Heading
                title={board.name}
                description={board.description || 'No description'}
                actions={<BoardShowHeadingMenu />}
            />
            <div className="flex items-center justify-between">
                <ShowBoardHeadingSearchBar />
                <div className="flex items-center justify-end gap-4">
                    <ShowBoardHeadingViewSwitcher />
                    <ShowBoardHeadingSort />
                </div>
            </div>
        </div>
    );
}
