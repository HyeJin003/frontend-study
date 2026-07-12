"use client"
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button"

import Link from "next/link";
import {  usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { getMe } from "@/services/authService";


export function Header() {

    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
     const [nickname, setNickname] = useState("")
    const { isLoggedIn, clearAuth, _hasHydrated } = useAuthStore()
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, [])

    useEffect(() => {
        if (!_hasHydrated || !isLoggedIn()) return;
        let isMounted = true;
        getMe().then((result) => {
            if (isMounted) setNickname(result.data.nickname)
        }).catch(() => {})
        return () => { isMounted = false }
    }, [_hasHydrated])
    

    if (pathname === '/' || pathname.startsWith('/auth')) return null  // ← 추가 (/ 면 헤더 안 그림)
    return (
        <header className="sticky top-0 z-50 border-border bg-background/80 backdrop-blur-sm">
             <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                 <Link href={mounted && isLoggedIn() ? "/main" : "/"}>MyProject</Link>
                {!mounted ? null : isLoggedIn() ? (
                    <div className="flex items-center gap-3">
                        <Link href="/my" className="text-sm hover:underline">{nickname ?? ""}님 환영합니다.</Link>
                        <Link href={`/${nickname}`}>내 공간</Link>
                        <Button onClick={() => {
                            clearAuth(); router.push("/")
                        }}>로그아웃</Button>
           </div>

            
        ) : (
               <Button onClick={() => router.push("/auth/login")}>로그인</Button>
        )}
        </div>
      </header>
    )
    
}
 