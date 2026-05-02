'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

type Message = {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
  read_at: string | null
}

type Profile = {
  id: string
  nickname: string
}


export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const [partner, setPartner] = useState<Profile | null>(null)

  useEffect(() => {
    console.log("🆔 matchId:", matchId)
  }, [matchId])


  /* 自分のID取得 */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])


  // match + 相手プロフィールを取得
  useEffect(() => {
    if (!userId) return

    const fetchPartner = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          user1:profiles!matches_user1_id_fkey ( id, nickname ),
          user2:profiles!matches_user2_id_fkey ( id, nickname )
        `)
        .eq('id', matchId)
        .single<{
          id: string
          user1_id: string
          user2_id: string
          user1: Profile
          user2: Profile
        }>()

      console.log('📦 raw match:', data)
      console.log('❌ fetch partner error:', error)

      console.log('🧑 current userId:', userId)

      if (error) {
        console.error('❌ fetch partner error:', error)
        return
      }

      console.log('👤 user1_id:', data.user1_id)
      console.log('👤 user2_id:', data.user2_id)
      console.log('👤 user1 profile:', data.user1)
      console.log('👤 user2 profile:', data.user2)
      console.log('🧑 me:', userId)

      const partnerProfile =
        data.user1_id === userId
          ? data.user2
          : data.user1

      console.log('🎯 partnerProfile:', partnerProfile)

      setPartner(partnerProfile ?? null)
    }

    fetchPartner()
  }, [userId, matchId])



  /* 初期メッセージ取得 */
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at')

      if (data) setMessages(data)
    }

    fetchMessages()
  }, [matchId])

  /* 🔥 Realtime 購読（INSERT / UPDATE） */
  useEffect(() => {
    if (!matchId) return

    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const updated = payload.new as Message
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId])

  /* 👀 画面表示時に既読 */
  useEffect(() => {
    if (!matchId || !userId) return

    const markAsRead = async () => {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .neq('sender_id', userId)
        .is('read_at', null)

      if (error) {
        console.error('既読更新エラー', error)
      }

      // 再取得
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at')

      if (data) setMessages(data)
    }

    markAsRead()
  }, [matchId, userId])

  /* 最後の自分のメッセージ */
  const lastMyMessageId = [...messages]
    .reverse()
    .find((m) => m.sender_id === userId)?.id

  /* 送信 */
  // const sendMessage = async () => {
  //   if (!text.trim()) return

  //   await supabase.from('messages').insert({
  //     match_id: matchId,
  //     sender_id: userId,
  //     content: text,
  //   })

  //   setText('')
  // }
  const sendMessage = async () => {
    if (!text.trim() || !userId) return

    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: userId,
        content: text,
      })
      .select()
      .single()

    if (error) {
      console.error('送信エラー:', error)
      return
    }

    setText('')
  }


  return (
    <main style={{ padding: 16 }}>
      <h2>チャット</h2>

      <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <h3 style={{ margin: 0 }}>
          {partner?.nickname ?? 'チャット'}
        </h3>
      </header>


      <div style={{ minHeight: 300 }}>
        {messages.map((m) => {
          const isMine = m.sender_id === userId
          const isLastMyMessage = m.id === lastMyMessageId

          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMine ? 'flex-end' : 'flex-start',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  padding: 8,
                  borderRadius: 8,
                  background: isMine ? '#74b9ff' : '#dfe6e9',
                  maxWidth: '70%',
                }}
              >
                {m.content}
              </span>

              {/* 👇 既読表示 */}
              {isMine && isLastMyMessage && (
                <span style={{ fontSize: 12, color: '#888' }}>
                  {m.read_at ? '既読' : '未読'}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </main>
  )
}
