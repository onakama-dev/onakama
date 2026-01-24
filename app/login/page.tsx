// src/app/login/page.tsx
export default function LoginPage() {
  return (
    <main className="container">
      <h2>ログイン / 新規登録</h2>

      <p>体調が落ち着いたときに、無理のないペースでどうぞ。</p>

      <input type="email" placeholder="メールアドレス" />
      <input type="password" placeholder="パスワード" />

      <button className="button">メールで続ける</button>
    </main>
  )
}
