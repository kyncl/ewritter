import { PaginatedResponse } from "@/src/hooks/useArticle";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

interface ArticlePagingNavigationProps {
    paginatedNonUserArticles: PaginatedResponse | undefined;
    setPage: Dispatch<SetStateAction<number>>;
}

export const ArticlePagingNavigationButtons = ({
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

export const ArticlePagingNavigationLinks = ({
    paginatedNonUserArticles,
    urlBeforePage,
    currentPage
}: {
    paginatedNonUserArticles: PaginatedResponse | undefined;
    urlBeforePage: string
    currentPage: number;
}) => {
    const prevPage = currentPage > 1 ? currentPage - 1 : 1;
    const nextPage = currentPage + 1;
    const linkStyles = "px-3 py-1 bg-main rounded flex items-center justify-center transition-opacity";
    const disabledStyles = "opacity-50 pointer-events-none cursor-not-allowed";

    return (
        <div className="flex justify-center items-center gap-4 mt-8">
            <Link
                href={`${urlBeforePage}${prevPage}`}
                aria-disabled={!paginatedNonUserArticles?.prev_page_url}
                className={`${linkStyles} ${!paginatedNonUserArticles?.prev_page_url ? disabledStyles : "hover:opacity-80"}`}
            >
                <MdOutlineNavigateBefore size={45} />
            </Link>

            <span className="text-lg font-medium">
                Page {paginatedNonUserArticles?.current_page ?? 1} of {paginatedNonUserArticles?.last_page ?? 1}
            </span>

            <Link
                href={`${urlBeforePage}${nextPage}`}
                aria-disabled={!paginatedNonUserArticles?.next_page_url}
                className={`${linkStyles} ${!paginatedNonUserArticles?.next_page_url ? disabledStyles : "hover:opacity-80"}`}
            >
                <MdOutlineNavigateNext size={45} />
            </Link>
        </div>
    );
};
