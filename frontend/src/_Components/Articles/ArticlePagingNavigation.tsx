import { PaginatedResponse } from "@/src/hooks/useArticle";
import { Dispatch, SetStateAction } from "react";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";


interface ArticlePagingNavigationProps {
    paginatedNonUserArticles: PaginatedResponse | undefined;
    setPage: Dispatch<SetStateAction<number>>;
}

export const ArticlePagingNavigation = ({
    paginatedNonUserArticles,
    setPage
}: ArticlePagingNavigationProps) => {
    return (
        <div className="flex justify-center items-center gap-4 mt-8">
            <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!paginatedNonUserArticles?.prev_page_url}
                className="px-3 py-1 bg-main not-disabled:cursor-pointer rounded disabled:opacity-50"
            >
                <MdOutlineNavigateBefore size={45} />
            </button>

            <span className="text-lg">
                Page {paginatedNonUserArticles?.current_page} of {paginatedNonUserArticles?.last_page}
            </span>

            <button
                onClick={() => setPage(p => p + 1)}
                disabled={!paginatedNonUserArticles?.next_page_url}
                className="px-3 py-1 bg-main not-disabled:cursor-pointer rounded disabled:opacity-50"
            >
                <MdOutlineNavigateNext size={45} />
            </button>
        </div>
    )
}
