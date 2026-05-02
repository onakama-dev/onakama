'use client'

import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/terms" className={styles.link}>
          利用規約
        </Link>
        <span className={styles.separator}>｜</span>
        <Link href="/privacy" className={styles.link}>
          プライバシーポリシー
        </Link>
      </div>
    </footer>
  )
}