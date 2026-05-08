'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

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

const HOBBIES = [
  '映画','ドラマ','アニメ','漫画','ゲーム',
  '音楽','読書','旅行','グルメ',
  'インドア','アウトドア'
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [prefecture, setPrefecture] = useState('')
  const [ibsType, setIbsType] = useState('')
  const [ibsSeverity, setIbsSeverity] = useState('')
  
  const [hobbies, setHobbies] = useState<
    { name: string; detail: string }[]
  >([])

  const [comment, setComment] = useState('')

  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [birthDate, setBirthDate] = useState('')
  const [ageError, setAgeError] = useState('')

  useEffect(() => {
  const init = async () => {
    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) {
      router.push('/login')
      return
    }

    setUser(authData.user)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profile) {
      setNickname(profile.nickname ?? '')
      setGender(profile.gender ?? '')
      setBirthDate(profile.birth_date ?? '')  
      setAgeRange(profile.age_range ?? '')
      setPrefecture(profile.prefecture ?? '')
      setIbsType(profile.ibs_type ?? '')
      setIbsSeverity(profile.ibs_severity ?? '')
      setHobbies(profile.hobbies ?? [])
      setComment(profile.free_comment ?? '')
    }

    setLoading(false)
  }

  init()
}, [router])


  const toggleHobby = (hobby: string) => {
    setHobbies((prev) => {
      const exists = prev.find(h => h.name === hobby)

      if (exists) {
        return prev.filter(h => h.name !== hobby)
      }

      return [...prev, { name: hobby, detail: '' }]
    })
  }

  const saveProfile = async () => {
    if (!birthDate) {
      setAgeError('生年月日を入力してください')
      return
    }

    if (!validateAge(birthDate)) {
      setAgeError('20歳以上の方のみご利用いただけます')
      return
    }

    setAgeError('')

    const ageRange = calculateAgeRange(birthDate)

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      nickname,
      gender,
      birth_date: birthDate,
      age_range: ageRange,
      prefecture,
      ibs_type: ibsType,
      ibs_severity: ibsSeverity,
      hobbies,
      free_comment: comment,
      is_public: true,
      looking_for: 'chat',
    })

    if (error) {
      alert(error.message)
    } else {
      toast('プロフィールを保存しました')
      setTimeout(() => {
        router.push('/home')
      }, 1200)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert(error.message)
      return
    }

    alert('ログアウトしました')
    router.replace('/')   
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    setDeleting(true)

    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
      setDeleting(false)
      return
    }

    await supabase.auth.signOut()
    router.replace('/')
  }

  const calculateAgeRange = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)

    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    if (age < 25) return '20_early'
    if (age < 30) return '20_late'
    if (age < 35) return '30_early'
    if (age < 40) return '30_late'
    return '40_over'
  }

  const updateHobbyDetail = (name: string, detail: string) => {
    setHobbies(prev =>
      prev.map(h =>
        h.name === name ? { ...h, detail } : h
      )
    )
  }

  const validateAge = (date: string) => {
    const today = new Date()
    const birth = new Date(date)

    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age >= 20
  }

  // ===== Onakama UI version =====

  if (loading) return <p>Loading...</p>

  const isFirstTime = !nickname

  const containerStyle = {
    padding: '64px 24px',
    maxWidth: 640,
    margin: '0 auto',
    fontFamily: 'sans-serif',
    background: '#fafafa',
    minHeight: '100vh'
  }

  const cardStyle = {
    background: '#ffffff',
    padding: 28,
    borderRadius: 20,
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    marginBottom: 28
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 14,
    border: '1px solid #e5e7eb',
    marginBottom: 14,
    fontSize: 14,
    background: '#fcfcfc'
  }

  return (
    <div style={containerStyle}>
      <h1 style={{
        fontSize: 26,
        fontWeight: 500,
        marginBottom: 8,
        color: '#111827'
      }}>
        {isFirstTime ? 'はじめまして。' : 'プロフィール'}
      </h1>

      <p style={{
        color: '#6b7280',
        marginBottom: 40,
        lineHeight: 1.6
      }}>
        少しだけ、あなたのことを教えてください。
        無理のない範囲で大丈夫です。
      </p>

      {/* あなたについて */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 16 }}>あなたについて</h3>

        <input
          style={inputStyle}
          placeholder="ニックネーム"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />

        <select
          style={inputStyle}
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">性別</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
          <option value="no_answer">回答しない</option>
        </select>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              color: '#6b7280',
              marginBottom: 8,
              paddingLeft: 4
            }}
          >
            生年月日（20歳以上）
          </label>

          <input
            type="date"
            style={inputStyle}
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
          />

          <p
            style={{
              fontSize: 12,
              color: '#9ca3af',
              marginTop: -4,
              paddingLeft: 4,
              lineHeight: 1.6
            }}
          >
            年齢確認のために使用します
          </p>
        </div>

        {ageError && (
          <p style={{ color: '#dc2626', fontSize: 13 }}>{ageError}</p>
        )}

        <select
          style={inputStyle}
          value={prefecture}
          onChange={e => setPrefecture(e.target.value)}
        >
          <option value="">居住地</option>
          {PREFECTURES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* IBS */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 16 }}>IBSについて</h3>

        <select
          style={inputStyle}
          value={ibsType}
          onChange={e => setIbsType(e.target.value)}
        >
          <option value="">タイプ</option>
          <option value="diarrhea">下痢型</option>
          <option value="constipation">便秘型</option>
          <option value="mixed">混合型</option>
        </select>

        <select
          style={inputStyle}
          value={ibsSeverity}
          onChange={e => setIbsSeverity(e.target.value)}
        >
          <option value="">症状の重さ</option>
          <option value="light">軽度</option>
          <option value="medium">中度</option>
          <option value="heavy">重度</option>
        </select>
      </div>

      {/* 趣味 */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 20 }}>好きなこと</h3>

        {HOBBIES.map(h => {
          const selected = hobbies.find(x => x.name === h)

          return (
            <div
              key={h}
              style={{
                marginBottom: 16,
                padding: 16,
                borderRadius: 16,
                border: selected
                  ? '1px solid #10b981'
                  : '1px solid #e5e7eb',
                background: selected ? '#f0fdf4' : '#ffffff',
                transition: '0.2s ease'
              }}
            >
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => toggleHobby(h)}
                  style={{ marginRight: 8 }}
                />
                {h}
              </label>

              {selected && (
                <textarea
                  placeholder="どんなところが好きですか？（任意）"
                  value={selected.detail}
                  onChange={e => updateHobbyDetail(h, e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: 10,
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    fontSize: 14,
                    background: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ひとこと */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 16 }}>ひとこと</h3>

        <textarea
          style={inputStyle}
          placeholder="今の気持ちや、伝えたいこと"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>

      <button
        onClick={saveProfile}
        style={{
          width: '100%',
          padding: '14px 20px',
          borderRadius: 999,
          border: 'none',
          background: '#111827',
          color: '#ffffff',
          fontSize: 14,
          letterSpacing: 0.5
        }}
      >
        保存する
      </button>

      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          ログアウト
        </button>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: 13,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            アカウントを削除する
          </button>
        ) : (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
              すべてのデータが削除されます。<br />
              この操作は元に戻せません。
            </p>

            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              style={{
                marginTop: 12,
                padding: '10px 18px',
                borderRadius: 999,
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {deleting ? '削除中…' : '削除する'}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

