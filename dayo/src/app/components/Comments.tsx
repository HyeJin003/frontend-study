"use client";

import { useEffect, useState } from "react";
import {
  commentList,
  commentWrite,
  commentDelete,
  commentUpdate,
} from "../../../api/comment";
import { ReplyItem } from "../../../type/posts";
import UserProfile from "./UserProfile";
export default function Comments({ postId }: { postId: number }) {
  const [newContent, setNewContent] = useState("");
  const [reply, setReply] = useState<ReplyItem[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [myId, setMyId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setMyId(Number(localStorage.getItem("userId")));
    commentList(postId).then((result) => {
      if (result.status === 200) setReply(result.data.item);
    });
  }, [postId]);
  async function handleAdd() {
    if (newContent.trim() === "") {
      return;
    }
    const result = await commentWrite(postId, newContent);
    if (result.status === 201) {
      setReply((prev) => [...prev, result.data.item]);
      setNewContent("");
      setShowInput(false);
    }
  }
  async function handleDelete(replyId: number) {
    const answer = confirm("삭제하시겠습니까?");
    if (answer === false) {
      return;
    }
    const result = await commentDelete(postId, {
      _id: replyId,
      reply_id: replyId,
    });
    if (result.status === 200) {
      setReply((prev) => prev.filter((result) => result._id !== replyId));
    }
  }
  async function handleUpdate(replyId: number) {
    if (editContent.trim() === "") {
      return;
    }
    const result = await commentUpdate(postId, replyId, editContent);
    if (result.status === 200) {
      const newReply = reply.map((result) => {
        if (result._id === replyId) {
          return { ...result, content: editContent };
        }
        return result;
      });
      setReply(newReply);
      setEditId(null);
      setEditContent("");
    }
  }
  return (
    <section className="mt-8">
      {/* 댓글 수 + 작성 버튼 */}
      <div className="flex items-center justify-between border-t pt-6 mb-4">
        <h2 className="font-bold">댓글 {reply.length}개 </h2>
        <button
          onClick={() => setShowInput((prev) => !prev)}
          className="text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded-full"
        >
          작성
        </button>
      </div>
      {/* 댓글 입력창 */}
      <div className="flex flex-col gap-2 mb-6">
        {showInput && (
          <textarea
            placeholder="댓글을 입력하세요"
            value={newContent}
            onChange={(event) => setNewContent(event.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none"
          />
        )}
        {showInput && (
          <button
            onClick={handleAdd}
            className="self-end text-sm bg-black text-white px-4 py-2 rounded-full"
          >
            등록
          </button>
        )}
      </div>
      <div>
        {reply.map((result) => (
          <div key={result._id} className="border-b border-gray-300 py-4">
            <div className="flex justify-between items-center">
              <UserProfile name={result.user.name} image={result.user.image} />
              {myId === result.user._id && (
                <div>
                  <button
                    onClick={() => {
                      setEditId(result._id);
                      setEditContent(result.content);
                    }}
                    className="text-xs text-gray-400 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(result._id)}
                    className="text-xs text-red-400"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            {/* <p>{result.content}</p> */}
            {/* 댓글내용 */}
            {editId === result._id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(event) => {
                    setEditContent(event.target.value);
                  }}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none"
                />
                <button
                  onClick={() => {
                    handleUpdate(result._id);
                  }}
                  className="text-xs text-gray-400 mr-2"
                >
                  완료
                </button>
                <button
                  onClick={() => {
                    setEditId(null);
                  }}
                  className="text-xs text-red-400"
                >
                  취소
                </button>
              </div>
            ) : (
              <p>{result.content}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
