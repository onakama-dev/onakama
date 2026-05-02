'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './home.module.css'

type Hobby = {
  name: string
  detail?: string
}

type Profile = {
  id: string
  nickname: string
  prefecture: string
  gender: string
  age_range: string
  hobbies: (Hobby | string)[]
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const router = useRouter()

  const [prefecture, setPrefecture] = useState('')
  const [gender, setGender] = useState('')
  const [ageRange, setAgeRange] = useState('')

  useEffect(() => {
    checkLogin()
  }, [])

  useEffect(() => {
    if (currentUserId) {
      fetchProfiles()
    }
  }, [currentUserId])

  // ===== ログイン + プロフィール有無チェック =====
  const checkLogin = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push('/login')
      return
    }

    setIsLoggedIn(true)
    setCurrentUserId(data.user.id)

    // 🔥 プロフィール存在確認
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single()

    // 未登録なら onboarding へ
    if (!profile) {
      router.push(`/profile/`)
      return
    }
  }

  // ===== プロフィール一覧取得 =====
  const fetchProfiles = async () => {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true)

    if (currentUserId) {
      query = query.neq('id', currentUserId)
    }

    const { data } = await query
    if (data) setProfiles(data)
  }

  const handleCardClick = (id: string) => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    router.push(`/profile/${id}`)
  }

  const genderLabel: Record<string, string> = {
    male: '男性',
    female: '女性',
    other: 'その他',
    no_answer: '回答しない',
  }

  const ageRangeLabel: Record<string, string> = {
    '20_early': '20代前半',
    '20_late': '20代後半',
    '30_early': '30代前半',
    '30_late': '30代後半',
    '40_over': '40代以上',
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>公開プロフィール一覧</h1>

        <button
          className={styles.profileButton}
          onClick={() => router.push('/profile')}
        >
          プロフィール編集
        </button>
      </div>

      {!isLoggedIn && (
        <p style={{ color: '#888', fontSize: 12 }}>
          ※ 詳細を見るにはログインが必要です
        </p>
      )}

      <div className={styles.filters}>
        <select onChange={(e) => setPrefecture(e.target.value)}>
          <option value="">都道府県</option>
          <option value="東京都">東京都</option>
          <option value="大阪府">大阪府</option>
        </select>

        <select onChange={(e) => setGender(e.target.value)}>
          <option value="">性別</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>

        <select onChange={(e) => setAgeRange(e.target.value)}>
          <option value="">年代</option>
          <option value="20_early">20代前半</option>
          <option value="20_late">20代後半</option>
        </select>

        <button onClick={fetchProfiles}>検索</button>
      </div>

      <div className={styles.grid}>
        {profiles.map((p) => (
          <div
            key={p.id}
            onClick={() => handleCardClick(p.id)}
            className={styles.card}
          >
            <h3>{p.nickname}</h3>

            <p className={styles.meta}>
              {p.prefecture} /
              {genderLabel[p.gender]} /
              {ageRangeLabel[p.age_range]}
            </p>

            <div className={styles.hobbySection}>
              <span className={styles.hobbyLabel}>趣味</span>

              <div className={styles.hobbyList}>
                {p.hobbies?.map((h, i) => {
                  const name = typeof h === 'string' ? h : h.name

                  return (
                    <span key={i} className={styles.hobbyTag}>
                      {name}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}