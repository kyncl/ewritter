'use client'

import { useState } from 'react'

import {
    EditorCommand,
    EditorCommandEmpty,
    EditorCommandItem,
    EditorCommandList,
    EditorContent,
    EditorRoot,
    Placeholder,
    type JSONContent
} from 'novel'

import { handleCommandNavigation } from 'novel'

import {
    slashCommand,
    suggestionItems
} from '@/src/components/editor/slash-command'
import EditorMenu from '@/src/components/editor/editor-menu'
import { defaultExtensions } from '@/src/components/editor/extensions'
import { TextButtons } from '@/src/components/editor/selectors/text-buttons'
import { LinkSelector } from '@/src/components/editor/selectors/link-selector'
import { NodeSelector } from '@/src/components/editor/selectors/node-selector'
import { MathSelector } from '@/src/components/editor/selectors/math-selector'
import { ColorSelector } from '@/src/components/editor/selectors/color-selector'
import { Separator } from '@/src/components/ui/separator'

import "../../app/prosemirror.css";
import "../../app/novelGlobal.css";

const extensions = [...defaultExtensions, slashCommand]
export const defaultEditorContent = {
    type: 'doc',
    content: [
        {
            type: 'paragraph',
            content: []
        }
    ]
}

interface EditorProps {
    initialValue?: JSONContent
    onChange: (content: string) => void
}

export default function Editor({ initialValue, onChange }: EditorProps) {
    const [openNode, setOpenNode] = useState(false)
    const [openColor, setOpenColor] = useState(false)
    const [openLink, setOpenLink] = useState(false)
    const [openAI, setOpenAI] = useState(false)
    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === "heading") {
                return `Heading ${node.attrs.level}`;
            }
            return "Press '/' for commands...";
        },
        includeChildren: true,
    });

    return (
        <div className='relative w-full'>
            <EditorRoot>
                <EditorContent
                    immediatelyRender={false}
                    initialContent={initialValue}
                    extensions={extensions}
                    className='min-h-screen
                    rounded-xl
                    border p-4'
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) => handleCommandNavigation(event)
                        },
                        attributes: {
                            class:
                                'prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full'
                        }
                    }}
                    onUpdate={({ editor }) => {
                        onChange(editor.getHTML())
                    }}
                >
                    <EditorCommand className='z-50 h-auto max-h-82.5 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
                        <EditorCommandEmpty className='px-2 text-muted-foreground'>
                            No results
                        </EditorCommandEmpty>
                        <EditorCommandList>
                            {suggestionItems.map(item => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={val => item.command?.(val)}
                                    className={`flex w-full items-center 
                                        space-x-2 rounded-md px-2 py-1 
                                        text-left text-sm 
                                        hover:bg-accent 
                                        aria-selected:bg-accent`}
                                    key={item.title}
                                >
                                    <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className='font-medium'>{item.title}</p>
                                        <p className='text-xs text-muted-foreground'>
                                            {item.description}
                                        </p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>

                    <EditorMenu open={openAI} onOpenChange={setOpenAI}>
                        <Separator orientation='vertical' />
                        <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                        <Separator orientation='vertical' />
                        <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                        <Separator orientation='vertical' />
                        <MathSelector />
                        <Separator orientation='vertical' />
                        <TextButtons />
                        <Separator orientation='vertical' />
                        <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                    </EditorMenu>
                </EditorContent>
            </EditorRoot>
        </div>
    )
}
