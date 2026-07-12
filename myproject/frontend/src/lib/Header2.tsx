// "use client"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import { useAuthStore } from "@/store/useAuthStore"
// import { Button } from "@/components/ui/button"
// import { LayoutDashboard, LogOut } from "lucide-react"
// import { useState, useEffect } from "react"

// const headerVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// }
//         export function Header() {
//     const [mounted, setMounted] = useState(false)
//     const router = useRouter()
//     const { user, isLoggedIn, clearAuth } = useAuthStore()

//             useEffect(() => {
//         // eslint-disable-next-line
//       setMounted(true)
//     }, [])
            
//             /
//       return (
//       <motion.header
//         variants={headerVariants}
//         initial="hidden"
//         animate="visible"
//         className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md"
//       >
//         <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
//           <Link href="/" className="text-sm font-semibold hover:opacity-75 transition-opacity">
//             MyProject
//           </Link>

//           <div className="flex items-center gap-2">
//             {!mounted ? (
//               <div className="h-7 w-24 animate-pulse rounded-lg bg-muted" />
//             ) : isLoggedIn() ? (
//               <>
//                 <span className="text-sm text-muted-foreground">{user?.nickname ?? ""}</span>
//                 <Button variant="ghost" size="sm" onClick={() => router.push("/my")}>
//                   <LayoutDashboard /> 내 공간
//                 </Button>
//                 <Button variant="ghost" size="sm" onClick={() => { clearAuth(); router.push("/") }}>
//                   <LogOut />
//                 </Button>
//               </>
//             ) : (
//               <Button size="sm" onClick={() => router.push("/auth/login")}>로그인</Button>
//             )}
//           </div>
//         </div>
//       </motion.header>
//     )
            
// }
  