'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { useEffect } from 'react';

interface TiptapRendererProps {
  content: Record<string, any>;
}

export function TiptapRenderer({ content }: TiptapRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'mx-auto rounded-lg',
        },
      }),
    ],
    content: content,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="text-gray-400 p-4 bg-slate-800 rounded-lg">
        Loading content...
      </div>
    );
  }

  return (
    <div
      className="prose prose-invert max-w-none
        prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
        prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3
        prose-h3:text-xl prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-2
        prose-p:text-gray-200 prose-p:leading-7 prose-p:mb-4
        prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300
        prose-strong:text-white prose-strong:font-semibold
        prose-code:bg-slate-800 prose-code:text-blue-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-lg
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-300
        prose-img:rounded-lg prose-img:shadow-lg
        prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2
        prose-li:text-gray-200
        prose-hr:border-slate-700"
    >
      <EditorContent editor={editor} />
    </div>
  );
}
