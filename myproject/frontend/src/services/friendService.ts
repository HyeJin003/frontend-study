import { FriendshipEntry } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";


interface ApiResponse<T>{
    success: boolean;
    message: string;
    data: T;
}
//설정  
const BASE_URL = "http://localhost:8080";


function authHeaders(): Record<string, string>{

    const token = useAuthStore.getState().accessToken;
    const headers: Record<string, string> =  {
        "Content-Type": "application/json"
    };
      if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;

}
export async function getFriends(): Promise<FriendshipEntry[]> {
    const result = await fetch(`${BASE_URL}/api/friends`, {
        headers: authHeaders(),
    });

      if (!result.ok) {
    throw new Error("친구 조회 실패 ");
    }
        const body: ApiResponse<FriendshipEntry[]> = await result.json();  
    
    return body.data;
}

export async function  sendFriendRequest(nickname:string){

    const result = await fetch(`${BASE_URL}/api/friends/${nickname}`, {
        method: "POST",
        headers: authHeaders()
    })
    if (!result.ok) throw new Error("친구 신청 실패");
    
    
    const body: ApiResponse<FriendshipEntry> = await result.json();

    return body.data;
}