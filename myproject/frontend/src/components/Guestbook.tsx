// ├── 1. 상태(State) 선언     → 이 컴포넌트가 뭘 기억하고 있나
//   ├── 2. useEffect           → 처음 열릴 때 목록 자동 조회
//   ├── 3. handleWrite()       → 작성 버튼 눌렀을 때
//   ├── 4. handleDelete()      → 삭제 버튼 눌렀을 때
//   └── 5. JSX (화면)          → 실제 보여지는 UI


"use client"

import {   getGuestbooks,
  writeGuestbook,
  deleteGuestbook,
    GuestbookEntry,
} from "@/services/guestbookService";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState, useRef } from "react";

interface GuestbookProps{
    ownerNickname: string;// 방명록 주인 닉네임 (URL에서 옴)
}
export default function Guestbook({ ownerNickname }: GuestbookProps) {
    

    //"방명록 목록을 담는 상자, 처음엔 비어있음" 이에요.

    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [content , setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isLoading ,setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const { isLoggedIn } = useAuthStore();
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasNext, setHasNext] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);
    const isFetchingRef = useRef(false);
    const loadMoreRef = useRef<() => Promise<void>>(() => Promise.resolve());

  // 컴포넌트 마운트 시 방명록 목록 조회
  useEffect(() => {
    getGuestbooks(ownerNickname)
        .then((data) => {
            setEntries(data.guestbooks);
            setNextCursor(data.nextCursor);
            setHasNext(data.hasNext);
      })
      .catch(() => setErrorMessage("방명록을 불러오지 못했어요."))
      .finally(() => setIsLoading(false));
  }, [ownerNickname]);
    
    
    const loadMore = async () => {
        if (!hasNext || isFetchingRef.current) return;
        isFetchingRef.current = true;
        try {
            const data = await getGuestbooks(ownerNickname, nextCursor);
            setEntries((prev) => [...prev, ...data.guestbooks]);
            setNextCursor(data.nextCursor);
            setHasNext(data.hasNext);
        } finally {
            isFetchingRef.current = false;
        }
    };
    useEffect(() => {
        loadMoreRef.current = loadMore;
    });

    //무한 스크롤
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const nearBottom =
                    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
                if (nearBottom) loadMoreRef.current();
                ticking = false;
            });
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  // 방명록 작성
  const handleWrite = async () => {
    if (!content.trim()) return;
    try {
      await writeGuestbook(ownerNickname, { content, isAnonymous });
      setContent("");
      setIsAnonymous(false);
      // 작성 후 목록 새로고침
      const updated = await getGuestbooks(ownerNickname);
        setEntries(updated.guestbooks);
        setNextCursor(updated.nextCursor);
        setHasNext(updated.hasNext);
    } catch {
      setErrorMessage("작성에 실패했어요.");
    }
  };

  // 방명록 삭제
  const handleDelete = async (id: number) => {
    if (!window.confirm("삭제할까요?")) return;
    try {
      await deleteGuestbook(id);
      // 삭제된 항목만 제거 (서버 재요청 없이)
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setErrorMessage("삭제에 실패했어요.");
    }
    };
    
 



  if (isLoading) return <p className="text-sm text-muted-foreground">로딩중...</p>;
    return (
        <div className="flex flex-col gap-3">

        <h2 className="text-center text-xl font-bold">방명록</h2>
               {/* {에러메시지}       */}
            {errorMessage && (<p className="text-sm text-red-500">{errorMessage}</p>
            
            )}
              {/* 작성 폼 — 로그인한 사람만 보임 */}
            {isLoggedIn() && (
                <div className="flex flex-col gap-2 border border-border rounded-xl p-4">
                    <textarea value={content} onChange={(event) => setContent(event.target.value)}
                        placeholder="방명록을 남겨보세요" rows={3}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm
                    outline-none focus:ring-2 focus:ring-violet-400/50 resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                               <input type="checkbox"
                                   checked={isAnonymous}
                                   onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                    익명으로 남기기
                        </label>
                        <button onClick={handleWrite}
                            className="px-4 py-2 bg-violet-500 text-white rounded-md
                                     text-sm  hover:bg-violet-600 transition-colors">
                            작성
                        </button>
                    </div>
                </div>
            )}
                        
            {/* 방명록 목록 */}
            {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">아직 방명록이 없어요.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex flex-col gap-1 border border-border rounded-xl p-4"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{entry.writerNickname}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(entry.createdAt).toLocaleDateString("ko-KR")}
                                    </span>
                                    {isLoggedIn() && (
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm">{entry.content}</p>
                        </div>
                    ))}
                    </div>
                    
            )}
                    <div ref={observerTarget}/>
        </div>
    )
}