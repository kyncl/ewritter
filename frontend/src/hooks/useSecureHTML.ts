import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface UseSecureHTMLOptions {
    allowedTags?: string[];
    allowedAttributes?: string[];
}

const DEFAULT_TAGS = [
    'p', 'h1', 'h2', 'h3', 'h4', 'strong', 'em', 'b', 'i', 'a',
    'ul', 'ol', 'li', 'br', 'code', 'span', 'pre' // Added 'pre'
];
const DEFAULT_ATTRS = ['href', 'target', 'rel', 'class', 'id'];

// thanks Muhammad Hamza, very cool 
// https://dev.to/hijazi313/using-dangerouslysetinnerhtml-safely-in-react-and-nextjs-production-systems-115n
export function useSecureHTML(
    unsafeHTML: string,
    options: UseSecureHTMLOptions = {}
) {
    const sanitizationOptions = useMemo(() => ({
        ALLOWED_TAGS: options.allowedTags || DEFAULT_TAGS,
        ALLOWED_ATTR: options.allowedAttributes || DEFAULT_ATTRS,
        RETURN_TRUSTED_TYPE: false,
    }), [options.allowedTags, options.allowedAttributes]);

    return useMemo(() => {
        if (!unsafeHTML) return { __html: "" };

        return {
            __html: DOMPurify.sanitize(unsafeHTML, sanitizationOptions)
        };
    }, [unsafeHTML, sanitizationOptions]);
}
