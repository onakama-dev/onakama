'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import styles from './profile.module.css'

type Profile = {
  id: string
  nickname: string
  prefecture: string
  gender: string
  age_range: string
  hobbies: string[]
  free_comment: string | null
  bio: string | null
}

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isMatched, setIsMatched] = useState(false)
  const [matchId, setMatchId] = useState<string | null>(null)



  // ログインユーザー取得
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // プロフィール取得
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (data) setProfile(data)
    }

    fetchProfile()
    
  }, [id])

  // いいね済みか確認
  useEffect(() => {
    if (!user || !profile) return

    const checkLiked = async () => {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('from_user_id', user.id)
        .eq('to_user_id', profile.id)
        .maybeSingle()

      setIsLiked(!!data)
    }

    checkLiked()
  }, [user, profile])

  // マッチ判定関数
  const checkMatched = async () => {
    if (!user || !profile) return

    const { data, error } = await supabase
      .from('matches')
      .select('id')
      .or(
        `and(user1_id.eq.${user.id},user2_id.eq.${profile.id}),and(user1_id.eq.${profile.id},user2_id.eq.${user.id})`
      )
      .maybeSingle()

    if (error) {
      console.error('MATCH CHECK ERROR:', error)
      return
    }

    setIsMatched(!!data)
    setMatchId(data?.id ?? null)
  }



  useEffect(() => {
    checkMatched()
  }, [user, profile])

  const handleLike = async () => {
    if (!user || !profile) return

    if (isLiked) {
      // 解除
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('from_user_id', user.id)
        .eq('to_user_id', profile.id)

      if (error) {
        console.error('DELETE ERROR:', error)
        alert(`解除に失敗しました：${error.message}`)
        return
      }

      setIsLiked(false)
      return
    }

    // ① 自分 → 相手 に like
    const { error: insertError } = await supabase.from('likes').insert({
      from_user_id: user.id,
      to_user_id: profile.id,
    })

    if (insertError) {
      console.error('INSERT ERROR:', insertError)
      alert(`気になるに失敗しました：${insertError.message}`)
      return
    }

    setIsLiked(true)

    // ② 相手 → 自分 の like があるか確認
    const { data: reverseLike } = await supabase
      .from('likes')
      .select('id')
      .eq('from_user_id', profile.id)
      .eq('to_user_id', user.id)
      .maybeSingle()

    // ③ 両想いなら matches を作成
    if (reverseLike) {
      const { error: matchError } = await supabase
        .from('matches')
        .insert({
          user1_id: user.id,
          user2_id: profile.id,
        })

      if (matchError) {
        console.error('MATCH INSERT ERROR:', matchError)
      }
    }

    await checkMatched()
  }



  if (!profile) return <p>読み込み中...</p>

  return (
    <main className={styles.container}>
      
      {/* 🔥 ヘッダー */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => router.back()}
        >
          ←
        </button>
        <h1>{profile.nickname}</h1>
      </div>

      <p>{profile.prefecture}</p>

      {isMatched && (
        <div
          style={{
            background: '#ffeaa7',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          🎉 マッチしました！
        </div>
      )}

      {isMatched && matchId && (
        <button
          onClick={() => router.push(`/chat/${matchId}`)}
          style={{
            padding: '10px 16px',
            background: '#6c5ce7',
            color: '#fff',
            borderRadius: 8,
            marginBottom: 12,
            fontWeight: 'bold',
          }}
        >
          💬 チャットを始める
        </button>
      )}

      <button
        onClick={handleLike}
        style={{
          padding: '8px 16px',
          background: isLiked ? '#ff6b81' : '#ccc',
          color: '#fff',
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        {isMatched ? 'マッチ済み 💕'
          : isLiked ? '気になるを解除 💔' : '気になる ❤️'}
      </button>

      <hr />

      <h3>趣味</h3>
      <div className={styles.hobbyList}>
        {profile.hobbies?.map((h: any, i: number) => {
          const name = typeof h === 'string' ? h : h.name
          const detail = typeof h === 'string' ? '' : h.detail

          return (
            <span key={i} className={styles.hobbyTag}>
              {name}
              {detail && `（${detail}）`}
            </span>
          )
        })}
      </div>

      <h3>ひとこと</h3>
      <p>{profile.free_comment || '未入力'}</p>
    </main>
  )
}
