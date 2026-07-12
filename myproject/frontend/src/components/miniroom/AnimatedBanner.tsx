import { motion, Variants } from 'framer-motion'
type AnimatedBannerProps = {
    nickname: string;
    bio: string | null;
    isOwner: boolean;
}
 const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

export default function AnimatedBanner({nickname, bio,isOwner}:AnimatedBannerProps) {
    return (
        <div className="relative h-48 overflow-hidden rounded-xl bg-gray-900">

    {/* Orbs — 배경, 텍스트보다 먼저 */}
    <motion.div animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-64 h-64 rounded-full bg-rose-400 blur-3xl opacity-30"
    />
    <motion.div animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-64 h-64 rounded-full bg-violet-500 blur-3xl opacity-30"
    />
    <motion.div animate={{ x: [0, 20, -10, 0], y: [0, 30, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-64 h-64 rounded-full bg-amber-400 blur-3xl opacity-30"
    />

    {/* 텍스트 — z-10으로 위에 올라옴 */}
    <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 p-6">
      <motion.h1 variants={item} className="text-white text-2xl font-bold">
        {nickname}
      </motion.h1>
      {bio ? (
        <motion.p variants={item} className="text-white">{bio}</motion.p>
      ) : isOwner ? (
        <motion.p variants={item} className="text-white opacity-60 text-sm cursor-pointer">
          ✏️  한마디를 입력해보세요
        </motion.p>
      ) : null}
    </motion.div>

  </div>)
 }