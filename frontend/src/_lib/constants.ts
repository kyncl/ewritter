import { JSONContent } from "novel"

export const DEFAULT_ARTICLE: JSONContent = {
    type: "doc",
    content: [
        {
            type: "paragraph"
        }
    ]
}

export const EMPTY_ARTICLE: JSONContent = {
    type: 'doc',
    content: []
}
