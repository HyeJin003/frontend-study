"use client"

import { useAuthGuard } from "@/hook/useAuthGuard";
  import { getMe } from "@/services/authService";                                                                       
  import { useAuthStore } from "@/store/useAuthStore";                                                                  
  import { useRouter } from "next/navigation"                                                                           
  import { useEffect, useState } from "react"   

export default function MainPage() {
    useAuthGuard();

    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [nickname ,  setNickname] = useState("");
        

    useEffect(() => {
        let isMounted = true;
        getMe().then((result) => {
            setNickname(result.data.nickname)
        })
            .catch(() => {
            if (!isMounted) return
        })
        return (() => {
         isMounted= false
     })
    },[])
  return (
    <div>
          <h1>{nickname}님의 공간</h1>
    </div>
  )
}
