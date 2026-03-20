"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { postRegist, uploadImage } from "../../api/post";
import { useAuthGuard } from "../../hooks/useAuthGuard";
export default function PostNewPage() {
  useAuthGuard();
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "내용을 입력하세요" }),
    ],

    immediatelyRender: false,
  });

  const [title, setTitle] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();

  const fileUpload = useRef<HTMLInputElement>(null);

  async function savePost() {
    const result = await postRegist({
      type: "post",
      title,
      content: editor?.getHTML() ?? "",
      tag: "",
    });
    if (result.status === 201) {
      router.push("/post");
    }
  }
  return (
    <main
      className="flex flex-col gap-4 p-6 max-w-2xl mx-auto      
  w-full"
    >
      <header>
        <input
          className="w-full text-2xl font-bold pb-2 outline-none"
          type="text"
          style={{ borderBottom: "2px solid black" }}
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </header>
      <div className="mt-2">
        {editor && (
          <div className="flex gap-2 p-2 justify-center">
            <button onClick={() => editor.chain().focus().toggleBold().run()}>
              B
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}>
              I
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              ←
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              ≡
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              →
            </button>
          </div>
        )}
        <section
          aria-label="내용"
          className="min-h-64 p-3"
          onClick={() => editor?.commands.focus("end")}
        >
          {/* tiptap 에디터 */}
          <EditorContent editor={editor} />
        </section>
      </div>
      <footer>
        <button onClick={() => fileUpload.current?.click()}>이미지 추가</button>

        <input
          type="file"
          ref={fileUpload}
          accept="image/*"
          multiple
          onChange={async (event) => {
            const files = Array.from(event.target.files ?? []);
            const urls = await uploadImage(files);
            urls.forEach((url) => editor?.commands.setImage({ src: url }));
          }}
          hidden
        />
        <button
          onClick={savePost}
          className="bg-black text-white p-2 rounded w-full mt-2 whitespace-nowrap px-10"
        >
          저장
        </button>
      </footer>
    </main>
  );
}
