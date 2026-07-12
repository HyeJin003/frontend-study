"use client";

import { useEffect, useState } from "react";
import { getGuestbooks, GuestbookEntry } from "@/services/guestbookService";

type GuestbookPreviewProps = {
  nickname: string;
};

export default function GuestbookPreview({ nickname }: GuestbookPreviewProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    getGuestbooks(nickname)
      .then((data) => setEntries(data.guestbooks.slice(0, 3)))
 // 최근 3개만
      .catch(() => {});
  }, [nickname]);

  return (
    <div className="p-4 border rounded-xl">
      <h2 className="font-bold mb-3">💌 방명록</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 방명록이 없어요.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div key={entry.id} className="text-sm border-b pb-2">
              <span className="font-medium">{entry.writerNickname}</span>
              <span className="text-gray-500 ml-2">{entry.content}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
