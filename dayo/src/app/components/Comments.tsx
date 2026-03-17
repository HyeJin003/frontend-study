"use client";

import { useState } from "react";

export default function Comments({ postId }: { postId: number }) {
  const [newContent, setNewContent] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  useEffect(() => {
    setMyId;
  });
  return (
    <section className="mt-8">
      {/* 댓글 수 + 작성 버튼 */}
      <div className="flex items-center justify-between border-t pt-6 mb-4">
        <h2 className="fot-bold">댓글 0 개 </h2>
        {/* <button onClick={() => setShowInput((prev) => !prev)}>작성</button> */}
      </div>
      {/* 댓글 입력창 */}
      <div className="flex flex-col gap-2 mb-6">
        <textarea
          placeholder="댓글을 입력하세요"
          value={newContent}
          onChange={(event) => setNewContent(event.target.value)}
        />
        <button>등록</button>
      </div>
    </section>
  );
}
