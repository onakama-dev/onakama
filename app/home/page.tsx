'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './home.module.css'

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県',
  '岐阜県','静岡県','愛知県','三重県',
  '滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
  '鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県',
  '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県',
  '沖縄県'
]

const GENDER_LABELS: Record<string, string> = {
  male: '男性',
  female: '女性',
  other: 'その他',
  no_answer: '回答しない',
}

const AGE_RANGE_LABELS: Record<string, string> = {
  '20_early': '20代前半',
  '20_late': '20代後半',
  '30_early': '30代前半',
  '30_late': '30代後半',
  '40_over': '40代以上',
}


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

 // 1. ログインチェック（初回のみ）
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setIsLoggedIn(true)
      setCurrentUserId(user.id)

      // プロフィール未作成なら onboarding へ
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (!profile) {
        router.push('/profile')
        return
      }
      
      // ログインとプロフィール確認ができたら初期表示（全件）を行う
      await handleSearch(user.id)
    }
    init()
  }, [])

  // 2. 検索・一覧取得ロジック（フィルタが空なら全件、入っていれば絞り込み）
  const handleSearch = async (overrideUserId?: string) => {
    const targetUserId = overrideUserId || currentUserId
    
    // SQLのRPCを呼び出し
    const { data, error } = await supabase.rpc('search_profiles', {
      filter_gender: gender || null,      // 空文字なら null を渡すことでSQL側で「全表示」扱いになる
      filter_prefecture: prefecture || null,
      min_age: 0,
      max_age: 100
    })

    if (error) {
      console.error('取得エラー:', error)
      return
    }

    if (data) {
      // 「自分以外」かつ「公開中」のユーザーを抽出
      let filtered = data.filter((p: any) => p.id !== targetUserId && p.is_public === true)
      
      // 年代フィルタ（SQL側でage_rangeを判定していない場合のフロント補完）
      if (ageRange) {
        filtered = filtered.filter((p: any) => p.age_range === ageRange)
      }
      
      setProfiles(filtered)
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>おなかまを探す</h1>
        <button className={styles.profileButton} onClick={() => router.push('/profile')}>
          プロフィール編集
        </button>
      </div>

      <div className={styles.filters}>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">性別（すべて）</option>
          {Object.entries(GENDER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
          <option value="">年代（すべて）</option>
          {Object.entries(AGE_RANGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select value={prefecture} onChange={(e) => setPrefecture(e.target.value)}>
          <option value="">居住地（すべて）</option>
          {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <button className={styles.searchButton} onClick={() => handleSearch()}>検索</button>
      </div>

      <div className={styles.grid}>
        {profiles.length > 0 ? (
          profiles.map((p) => (
            <div key={p.id} className={styles.card} onClick={() => router.push(`/profile/${p.id}`)}>
              <h3>{p.nickname}</h3>
              <p className={styles.meta}>
                {p.prefecture} / {GENDER_LABELS[p.gender] || '不明'} / {AGE_RANGE_LABELS[p.age_range] || '不明'}
              </p>
              <div className={styles.hobbyList}>
                {p.hobbies?.map((h: any, i: number) => (
                  <span key={i} className={styles.hobbyTag}>{typeof h === 'string' ? h : h.name}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noData}>ユーザーが見つかりませんでした。</p>
        )}
      </div>
    </main>
  )
}