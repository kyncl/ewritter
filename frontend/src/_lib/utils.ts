import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const copyLink = (url?: string, doAlert: boolean = true) => {
    const copyUrl = () => {
        if (!url)
            return window.location.href;
        else
            return url
    };
    navigator.clipboard.writeText(copyUrl()).then(() => {
        if (doAlert)
            alert("Link copied to clipboard!");
    }).catch(() => { alert("Couldn't copy the link") });
};
