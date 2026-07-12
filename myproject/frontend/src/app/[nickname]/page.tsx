'use client'
import { getPublicProfile } from "@/services/memberService";
import { useAuthStore } from "@/store/useAuthStore";
import { PublicMemberProfile } from "@/types";
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import AnimatedBanner from '@/components/miniroom/AnimatedBanner'
import ProfileSidebar from '@/components/miniroom/ProfileSidebar'
import MiniRoomNav from '@/components/miniroom/MiniRoomNav'
import GuestbookPreview from '@/components/miniroom/GuestbookPreview'
import AboutMe from "@/components/miniroom/AboutMe";
import Guestbook from "@/components/Guestbook";
import Friends from "@/components/miniroom/Friends";


export default  function MiniRoomPage() {

    const [profile, setProfile] = useState<PublicMemberProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<'홈'|'글'|'방명록'|'타임캡슐'|'랜덤연결'|'친구'>('홈')

    const params = useParams();
    const nickname = decodeURIComponent(params.nickname as string)
    const { user } = useAuthStore();

    const isOwner = user?.nickname === nickname

  

    useEffect(() => {
        let isMounted = true; 
        const fetchProfile = async () => {
            try {
                const result = await getPublicProfile(nickname)
                if (isMounted) setProfile(result.data);
            } catch (error) {
                if(isMounted) setError(error instanceof Error ?  error.message :  "불러오기 실패")
            } finally {
                if (isMounted) setIsLoading(false);
            }
      
    }
        fetchProfile()
        return()=>{isMounted = false}
  }, [nickname])
  // 로딩 중일 때
  if (isLoading) return <div>로딩 중...</div>

  // 에러일 때
  if (error) return <div>{error}</div>

  // 데이터 없을 때
  if (!profile) return <div>프로필이 없어요</div>

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto w-full px-4">
      <MiniRoomNav activeTab={activeTab} isOwner={isOwner} onTabChange={setActiveTab} />

      {activeTab === '홈' && (
        <div className="flex flex-col md:flex-row flex-1">
          <ProfileSidebar nickname={nickname} friendCount={0} isOwner={isOwner} />
          <div className="flex-1 p-6 flex flex-col gap-4">
            <AnimatedBanner nickname={nickname} bio={profile.bio} isOwner={isOwner} />
            <AboutMe bio={profile.bio} isOwner={isOwner} />
            <GuestbookPreview nickname={nickname} />
          </div>
        </div>
      )}
      {activeTab === '글' && <div className="p-4 text-gray-500">글 준비 중</div>}
      {activeTab === '방명록' && <Guestbook ownerNickname={nickname} />}
      {activeTab === '타임캡슐' && <div className="p-4 text-gray-500">타임캡슐 준비 중</div>}
      {activeTab === '랜덤연결' && <div className="p-4 text-gray-500">랜덤연결 준비 중</div>}
      {activeTab === '친구' && (isOwner ? <Friends /> : <div className="p-4 text-gray-500">친구 목록은 본인만 볼 수 있어요</div>)}
    </div>
  )
}

