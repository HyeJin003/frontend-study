'use client'
  import { useAuthStore } from "@/store/useAuthStore"
  import { getMe } from "@/services/authService"
  import { useSearchParams, useRouter } from "next/navigation"
  import { useEffect } from "react"

  export default function CallbackPage() {
      const searchParams = useSearchParams()
      const router = useRouter()
      const { setAuth } = useAuthStore()
 

      useEffect(() => {
          let isMounted = true

          const fetchToken = async () => {
              try {
                  // 1. URL에서 token 꺼내기
                 const token = searchParams.get('token')

                  // 2. token 없으면 로그인으로
                 if (!token) {
                     router.push('/login')
                return 
                             }

                  // 3. 임시 저장
                 setAuth({ id: 0, email: "", nickname: "" }, token)


                  // 4. getMe() 호출

                const me = await getMe()
                  // 5. 진짜 정보로 덮어쓰고 이동
                   if (isMounted) {
      setAuth(
          { id: me.data.id, email: me.data.email, nickname: me.data.nickname },
          token
      )
      router.push('/main')
  }


              } catch (error) {
                  if (isMounted) router.push('/login')
              }
          }

          fetchToken()
          return () => { isMounted = false }
      }, [])

      return <div>로그인 중...</div>
  }