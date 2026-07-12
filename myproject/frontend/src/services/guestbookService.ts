

 import { useAuthStore } from "@/store/useAuthStore";

interface ApiResponse<T>{
  success: boolean;
  message: string;
  data: T;

}

export interface GuestbookEntry{
  //방명록 1개 모양 이라 
  id: number;
  writerNickname: string;
  content: string;
  createdAt: string;

}

export interface GuestbookPageResponse{
  guestbooks: GuestbookEntry[];
  nextCursor: number | null;
  hasNext: boolean;
}
export interface WriteGuestbookRequest{
  content: string;
  isAnonymous: boolean;
}

//설정  
const BASE_URL = "http://localhost:8080";


function authHeaders(): Record<string, string>{
  
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
   "Content-Type": "application/json"
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;

}

export async function getGuestbooks(nickname: string,cursor?:number | null ):Promise<GuestbookPageResponse> {
 
  const params = new URLSearchParams({ size: "5" }); 
   if (cursor) params.append("cursor", String(cursor));
  const result = await fetch(`${BASE_URL}/api/guestbook/${nickname}?${params}`);
  if (!result.ok) {
    throw new Error("방명록 조회 실패");
 }
  const body: ApiResponse<GuestbookPageResponse> = await result.json();
  return body.data ;
}

export async function writeGuestbook(nickname:string, data:WriteGuestbookRequest):Promise<void> {
  const result = await fetch(`${BASE_URL}/api/guestbook/${nickname}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!result.ok) throw new Error("방명록 작성 실패");
}

export async function deleteGuestbook(id: number): Promise<void>{
  const result = await fetch(`${BASE_URL}/api/guestbook/${id}`,{
    method: "DELETE",
    headers: authHeaders(),
  })
   if (!result.ok) throw new Error("방명록 삭제 실패");
}

