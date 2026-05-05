'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  nickname: string
  age_range: string
}

type MatchRow = {
  id: string
  user1_id: string
  user2_id: string
}

type MatchView = {
  id: string
  partner: Profile | null
}

type UnreadCount = {
  match_id: string
  unread_count: number
}

const AGE_RANGE_LABEL: Record<string, string> = {
  '20_early': '20代前半',
  '20_late': '20代後半',
  '30_early': '30代前半',
  '30_late': '30代後半',
  '40_over': '40代以上',
}


export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchView[]>([])
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  /* =====================
   * ログインユーザー取得
   * ===================== */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user ?? null

      console.log('👤 user:', user)
      setUserId(user?.id ?? null)
    }

    init()
  }, [])

  /* =====================
   * マッチ一覧 + 相手プロフィール取得
   * ===================== */
  useEffect(() => {
    if (!userId) return

    const fetchMatches = async () => {
      /* ① matches 取得 */
      const { data: matchRows, error: matchError } =
        await supabase
          .from('matches')
          .select('id, user1_id, user2_id')
          .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

      console.log('📦 matchRows:', matchRows)
      console.log('❌ matchError:', matchError)

      if (!matchRows || matchRows.length === 0) {
        setMatches([])
        return
      }

      /* ② 相手ユーザーID抽出 */
      const partnerIds = matchRows.map((m) =>
        m.user1_id === userId ? m.user2_id : m.user1_id
      )

      console.log('🧑‍🤝‍🧑 partnerIds:', partnerIds)

      /* ③ profiles 一括取得 */
      const { data: profiles, error: profileError } =
        await supabase
          .from('profiles')
          .select('id, nickname, age_range')
          .in('id', partnerIds)

      console.log('📘 profiles:', profiles)
      console.log('❌ profileError:', profileError)

      /* ④ Map 化 */
      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.id, p])
      )

      /* ⑤ 表示用データ生成 */
      const view: MatchView[] = matchRows.map((m) => {
        const partnerId =
          m.user1_id === userId ? m.user2_id : m.user1_id

        return {
          id: m.id,
          partner: profileMap.get(partnerId) ?? null,
        }
      })

      console.log('🧩 match view:', view)
      setMatches(view)
    }

    fetchMatches()
  }, [userId])

  /* =====================
   * 未読件数取得
   * ===================== */
  useEffect(() => {
    if (!userId) return

    const fetchUnread = async () => {
      const { data } = await supabase
        .from('unread_counts')
        .select('*')

      if (!data) return

      const map: Record<string, number> = {}
      data.forEach((row: UnreadCount) => {
        map[row.match_id] = row.unread_count
      })

      setUnreadMap(map)
    }

    fetchUnread()
  }, [userId])

  /* =====================
   * 表示
   * ===================== */
  return (
    <main style={{ padding: 16 }}>
      <h2>マッチ一覧</h2>

      {matches.length === 0 && (
        <p style={{ color: '#666' }}>マッチはまだありません</p>
      )}

      {matches.map((match) => {
        const unread = unreadMap[match.id] ?? 0
        const partner = match.partner

        return (
          <div
            key={match.id}
            onClick={() => router.push(`/chat/${match.id}`)}
            style={{
              padding: 12,
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>
                {partner?.nickname ?? '未設定'}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {partner?.age_range
                  ? AGE_RANGE_LABEL[partner.age_range] ?? partner.age_range
                  : ''}
              </div>
            </div>

            {unread > 0 && (
              <span
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '2px 8px',
                  fontSize: 12,
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                {unread}
              </span>
            )}
          </div>
        )
      })}
    </main>
  )
}
