export interface PublicMemberProfile {
  id: number;
  nickname: string;
  profileImage: string | null;
  bio: string | null;
  provider: string;
  createdAt: string;
}
export interface FriendshipEntry{
  id: number;
  friendNickname: string;
  friendBio: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
 
}
