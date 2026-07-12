 'use client'
  import { useState, useRef } from 'react'
import { sendFriendRequest } from "@/services/friendService"; 
  type ProfileSidebarProps = {
    nickname: string
    friendCount: number
    isOwner: boolean
  }

export default function ProfileSidebar({ nickname, friendCount, isOwner }: ProfileSidebarProps) {
    
  const inputRef = useRef<HTMLInputElement>(null)
  
   const [imageUrl, setImageUrl] = useState<string | null>(() => {
  

     if (typeof window === 'undefined') return null
    return localStorage.getItem('profile-image')
   })
  
    const [isSending, setIsSending] = useState(false);
     const [sent, setSent] = useState(false)
    // 이미지 업로드 처리
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        localStorage.setItem('profile-image', base64)
        setImageUrl(base64)
      }
      reader.readAsDataURL(file)
    }
  const handleSendFriendRequest = async () => {
    setIsSending(true);
    try {
      await sendFriendRequest(nickname);
      setSent(true);
    } catch {
        alert("친구 신청에 실패했어요");
    } finally {
      setIsSending(false);
    }
      }
  
    return (
       <div className="w-full md:w-64 p-6 flex flex-col items-center gap-4">
        {/* 프로필 이미지 */}
        <div
          className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
          onClick={() => isOwner && inputRef.current?.click()}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
              {/* 👤 */}
            </div>
          )}
        </div>

        {/* TODO: 백엔드 POST /api/members/me/image 완성 후 교체 */}
        {isOwner && (
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        )}
       
        <p className="font-bold text-lg">{nickname}</p>
        <p className="text-sm text-gray-500">친구 {friendCount}명</p>
          {!isOwner && (
         <p><button onClick={handleSendFriendRequest} disabled={isSending || sent}
            className="px-4 py-2 bg-violet-500 text-white rounded-md text-sm hover:bg-violet-600 transition-colors disabled:opacity-50">
        {isSending ? "보내는 중..." : sent ? "신청 완료" : "친구 신청"}      
          </button> 
            </p>
        )}
      </div>
    )
  }
