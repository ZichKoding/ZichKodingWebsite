'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import YouTube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  LinkIcon,
  ImageIcon,
  Play,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { useCallback } from 'react';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const handleAddImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleAddLink = () => {
    const url = window.prompt('Enter link URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const handleAddYoutube = () => {
    const url = window.prompt('Enter YouTube URL:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className="sticky top-0 flex flex-wrap gap-2 rounded-t-lg border-b border-gray-600 bg-gray-700 p-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`rounded p-2 ${
          editor.isActive('bold')
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`rounded p-2 ${
          editor.isActive('italic')
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Italic"
      >
        <Italic size={18} />
      </button>

      <div className="w-px bg-gray-600"></div>

      <button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded p-2 ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded p-2 ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      <button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        className={`rounded p-2 ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px bg-gray-600"></div>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={`rounded p-2 ${
          editor.isActive('bulletList')
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={`rounded p-2 ${
          editor.isActive('orderedList')
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        className={`rounded p-2 ${
          editor.isActive('blockquote')
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={`rounded p-2 ${
          editor.isActive('codeBlock')
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-600'
        }`}
        title="Code Block"
      >
        <Code2 size={18} />
      </button>

      <div className="w-px bg-gray-600"></div>

      <button
        onClick={handleAddLink}
        className="rounded p-2 text-gray-300 hover:bg-gray-600"
        title="Add Link"
      >
        <LinkIcon size={18} />
      </button>

      <button
        onClick={handleAddImage}
        className="rounded p-2 text-gray-300 hover:bg-gray-600"
        title="Add Image"
      >
        <ImageIcon size={18} />
      </button>

      <button
        onClick={handleAddYoutube}
        className="rounded p-2 text-gray-300 hover:bg-gray-600"
        title="Embed YouTube"
      >
        <Play size={18} />
      </button>

      <div className="w-px bg-gray-600"></div>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="rounded p-2 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
        title="Undo"
      >
        <RotateCcw size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="rounded p-2 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
        title="Redo"
      >
        <RotateCw size={18} />
      </button>
    </div>
  );
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        protocols: ['http', 'https', 'mailto'],
      }),
      YouTube.configure({
        width: 640,
        height: 480,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your post...',
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div className="rounded-lg border border-gray-600 bg-gray-700">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none rounded-b-lg bg-gray-700 p-4 text-gray-100"
        style={{
          minHeight: '400px',
        }}
      />
    </div>
  );
}
