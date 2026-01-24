// src/app/page.tsx
import Link from 'next/link'
import SafeNote from '@/components/SafeNote'

export default function Home() {
  return (
    <main className="container">
      <h1 className="title">Onakama</h1>
      <p className="subtitle">～ IBS Connect ～</p>

      <p className="lead">
        体調を最優先にしていい出会いがあります。<br />
        IBS当事者同士だから、説明しなくていい。
      </p>

      <SafeNote />

      <Link href="/login" className="button">
        はじめる
      </Link>
    </main>
  )
}
