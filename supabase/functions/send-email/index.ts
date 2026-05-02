import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const body = await req.json()
  console.log("Webhook body:", body)

  const record = body.record

  // 🔥 未読でない場合は通知しない
  if (record.read_at !== null) {
    console.log("Already read. Skip notification.")
    return new Response("Already read", { status: 200 })
  }

  const senderId = record.sender_id
  const matchId = record.match_id
  const message = record.content ?? ""

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  // ① 送信者のnickname取得
  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", senderId)
    .single()

  const nickname = senderProfile?.nickname ?? "誰か"

  // ② matchに紐づくユーザー2人取得
  const { data: match } = await supabase
    .from("matches")
    .select("user1_id, user2_id")
    .eq("id", matchId)
    .single()

  if (!match) {
    console.error("Match not found")
    return new Response("Match not found", { status: 400 })
  }

  // ③ 相手ユーザーID特定
  const receiverId =
    match.user1_id === senderId
      ? match.user2_id
      : match.user1_id

  // ④ 相手のemail取得（auth.users）
  const { data: userData, error } =
    await supabase.auth.admin.getUserById(receiverId)

  if (error || !userData.user?.email) {
    console.error("User email not found", error)
    return new Response("User email not found", { status: 400 })
  }

  const receiverEmail = userData.user.email

  // ⑤ メール送信
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "psjhp0808@gmail.com",
      subject: "新しいメッセージが届きました",
      html: `
        <h2>${nickname} さんからメッセージ</h2>
        <p>${message}</p>
      `,
    }),
  })

  const data = await res.text()
  console.log("Resend response:", data)

  return new Response(data, { status: res.status })
})
