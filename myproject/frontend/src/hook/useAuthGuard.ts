 import { useAuthStore } from "@/store/useAuthStore"
  import { useRouter } from "next/navigation"
  import { useEffect } from "react"

  export function useAuthGuard() {
    const { isLoggedIn } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
      if (!isLoggedIn()) {
        router.push("/auth/login")
      }
    }, [])
  }
