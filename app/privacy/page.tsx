import styles from './privacy.module.css'

export const metadata = {
  title: 'プライバシーポリシー | Onakama',
}

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>プライバシーポリシー</h1>

      <section>
        <h2 className={styles.sectionTitle}>1. 取得する情報</h2>
        <p className={styles.text}>
          本サービスでは、以下の情報を取得する場合があります。
        </p>

        <h3 className={styles.subTitle}>（1）ユーザーが登録する情報</h3>
        <ul className={styles.list}>
          <li className={styles.listItem}>ニックネーム</li>
          <li className={styles.listItem}>性別</li>
          <li className={styles.listItem}>年代または生年月日</li>
          <li className={styles.listItem}>居住地（都道府県）</li>
          <li className={styles.listItem}>趣味・自己紹介</li>
          <li className={styles.listItem}>体調・症状に関する情報（任意入力）</li>
        </ul>

        <h3 className={styles.subTitle}>（2）サービス利用に伴い取得する情報</h3>
        <ul className={styles.list}>
          <li className={styles.listItem}>ログイン情報（ユーザーID等）</li>
          <li className={styles.listItem}>利用履歴（いいね、マッチ、メッセージ送信等）</li>
          <li className={styles.listItem}>アクセス情報（IPアドレス、ブラウザ情報等）</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>2. 利用目的</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>本サービスの提供・運営のため</li>
          <li className={styles.listItem}>ユーザー同士のマッチング機能提供のため</li>
          <li className={styles.listItem}>不正利用の防止・安全性向上のため</li>
          <li className={styles.listItem}>サービス改善・分析のため</li>
          <li className={styles.listItem}>お問い合わせ対応のため</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>3. 個人情報の第三者提供</h2>
        <p className={styles.text}>
          当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>本人の同意がある場合</li>
          <li className={styles.listItem}>法令に基づく場合</li>
          <li className={styles.listItem}>人の生命・身体・財産の保護に必要な場合</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>4. 外部サービスの利用</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>Supabase（認証・データベース）</li>
          <li className={styles.listItem}>ホスティングサービス（例：Vercel等）</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>5. 広告配信およびCookie等の利用</h2>
        <p className={styles.text}>
          本サービスでは、将来的に第三者配信の広告サービス（例：Google AdSense等）を利用する場合があります。
          これにより、ユーザーの興味に応じた広告を表示するため、Cookieや類似技術を使用することがあります。
        </p>
        <p className={styles.text}>
          ユーザーはブラウザ設定によりCookieを無効にすることが可能です。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>6. センシティブ情報の取り扱い</h2>
        <p className={styles.text}>
          本サービスでは、健康状態等に関する情報が入力される場合があります。
          これらの情報は、ユーザーの同意に基づき取得し、サービス提供の目的の範囲内でのみ利用します。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>7. 匿名性について</h2>
        <p className={styles.text}>
          本サービスは、ユーザーが匿名で利用することを前提としています。
          実名や個人を特定できる情報の公開は推奨しておりません。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>8. 情報の管理</h2>
        <p className={styles.text}>
          当社は、個人情報の漏洩・滅失・改ざんを防止するため、適切な安全管理措置を講じます。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>9. ユーザーの権利</h2>
        <p className={styles.text}>
          ユーザーは、自己の個人情報について、開示・訂正・削除を求めることができます。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>10. 退会およびデータ削除</h2>
        <p className={styles.text}>
          ユーザーが退会した場合、当社は退会後30日以内に個人情報を削除します。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>11. お問い合わせ</h2>
        <p className={styles.text}>
          <a
            href="https://forms.gle/BEnLAZWcLC9PYRTA6"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            お問い合わせフォームはこちら
          </a>
        </p>
      </section>
    </main>
  )
}