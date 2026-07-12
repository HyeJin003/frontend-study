 "use client"
  import Link from "next/link"
  import { useAuthStore } from "@/store/useAuthStore"
  import { useEffect, useState } from "react"
  import { motion, type Variants } from "framer-motion"
  import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  export default function HomePage() {
    const [mounted, setMounted] = useState(false)
    const { isLoggedIn } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
      // eslint-disable-next-line
      setMounted(true)
    
    }, [])

    return (
      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col items-center
  justify-center px-4 text-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex
  flex-col items-center gap-6">
          <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight sm:text-5xl">
            소중한 순간,
            <span className="text-violet-400 block mt-2">여기에 남겨요.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            오늘의 순간을 기록해보세요.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
            {!mounted ? (
              <>
                <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
                <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
              </>
            ) : isLoggedIn() ? (
              <Link href="/main">
                <Button size="lg">내 공간 가기</Button>
              </Link>
            ) : (
                  <>
                     <Button size="lg" onClick={() => router.push("/auth/signup")}>
                          <Link href="/auth/signup">회원가입</Link>
                     </Button>
                       <Button size="lg" variant="outline" onClick={() => router.push("/auth/login")}>
                           <Link href="/auth/login">로그인</Link>
                      </Button>
    </>
            )}
          </motion.div>
        </motion.div>
      </section>
    )
  }