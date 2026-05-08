import Link from "next/link";
import "./top.css";
import Image from "next/image";

const Wave = ({ flip = false }: { flip?: boolean }) => (
  <div className={`wave ${flip ? "flip" : ""}`}>
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
      <path
        d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,53.3C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64V120H0Z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
);

export default function TopPage() {
  return (
    <main className="top-wrapper">

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-inner">

          <div className="hero-header">
            <div className="hero-logo">
              <Image
                src="/logo.png"
                alt="Onakama ロゴ"
                width={1200}
                height={300}
                priority
                className="logo-img"
              />
            </div>

            <Link href="/login" className="login-link">
              ログイン
            </Link>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">
              そのままで、
              <br className="pc-break" />
              <span className="line2 highlight">つながれる。</span>
            </h1>

                <p className="hero-lead">
                  過敏性腸症候群を抱えながら、<br />
                  人と会うことに少し勇気がいる
                  <span className="emphasis">あなたへ。</span>
                </p>

            <p className="hero-sub">
              体調を説明しなくていい。<br />
              無理をしなくていい。
            </p>

            <Link href="/login" className="cta-button">
              無料ではじめる
            </Link>
          </div>

        </div>
      </section>

      <Wave />

      <section className="section bg-white experience-section">
        <div className="experience-card">

          <div className="experience-text">
            <h2 className="section-title">こんな経験はありませんか？</h2>
            <ul className="experience-list">
              <li>約束の前に、トイレの場所を確認してしまう</li>
              <li>食べられない理由を説明するのがつらい</li>
              <li>体調の不安を抱えながら外出する</li>
              <li>人と会うこと自体が重たく感じる</li>
            </ul>
          </div>

          <div className="experience-art">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>

        </div>
      </section>



      <Wave flip />

      <section className="section about-section">
        <div className="about-card reverse">

          <div className="about-illustration">
            <img src="/about-illustration.png" alt="人が歩きながら会話しているイラスト" />
          </div>

          <div className="about-text">
            <h2 className="section-title">Onakamaについて</h2>
            <p className="about-sub">
              Onakamaは、過敏性腸症候群の当事者同士が体調を前提にしてつながれる場所です。
            </p>
            <ul className="experience-list">
              <li>途中で抜けても大丈夫</li>
              <li>トイレ休憩は前提</li>
              <li>無理をしないことが当たり前</li>
            </ul>
          </div>

        </div>
      </section>

      <Wave />

      <section className="reason-section">
        <div className="reason-container">

          <h2 className="reason-title">安心して使える理由</h2>

          <p className="reason-lead">
            同じ悩みを持つ人と出会える場所だからこそ、<br className="pc-break" />
            心の距離が近づくまでは匿名でいられる安心を。
          </p>
          
          <div className="reason-cards">

            <div className="reason-card">
              <div className="reason-image">
                <img src="/nophotp.png" alt="顔写真不要" />
              </div>
              <h3>顔写真の登録は不要</h3>
            </div>

            <div className="reason-card">
              <div className="reason-image">
                <img src="/nickname.png" alt="ニックネーム登録" />
              </div>
              <h3>本名ではなくニックネームで登録</h3>
            </div>

            <div className="reason-card">
              <div className="reason-image">
                <img src="/range.png" alt="年代表示のみ" />
              </div>
              <h3>年齢ではなく年代のみ表示</h3>
            </div>

          </div>

        </div>
      </section>

      <Wave flip />

      <section className="how-section">
        <div className="how-container">

          <h2 className="how-title">onakamaの使い方</h2>

          <p className="how-lead">
            はじめてでも大丈夫。<br />
            やさしい3ステップで、つながれます。
          </p>

          <div className="how-steps">

            <div className="how-step">
              <span className="step-bg">01</span>
              <h3>プロフィールを作成</h3>
              <p>
                ニックネームや症状、趣味などを入力。<br />
                無理のない範囲で大丈夫です。
              </p>
            </div>

            <div className="how-step">
              <span className="step-bg">02</span>
              <h3>「気になる」でアプローチ</h3>
              <p>
                共感した相手に「気になる」をタップ。<br />
                あなたのペースで進められます。
              </p>
            </div>

            <div className="how-step">
              <span className="step-bg">03</span>
              <h3>マッチしたらトーク開始</h3>
              <p>
                お互いが「気になる」をタップするとマッチ。<br />
                同じ悩みと趣味を持つ人とメッセージができます。
              </p>
            </div>

          </div>

        </div>
      </section>

      <section className="cta-section">
        <Link href="/login" className="cta-button">
          まずは登録してみる
        </Link>
      </section>

    </main>
  );
}
