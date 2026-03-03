import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>HJblog</h1>
      <Link href={"/customer/login"}>로그인</Link>
    </main>
  );
}
