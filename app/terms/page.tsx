import styles from './terms.module.css'

export const metadata = {
  title: '利用規約 | Onakama',
}

export default function TermsPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>利用規約</h1>

      <p className={styles.text}>
        本利用規約（以下「本規約」といいます。）は、本サービス「おなかま」（以下「本サービス」といいます。）の利用条件を定めるものです。ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って本サービスをご利用いただきます。
      </p>

      <section>
        <h2 className={styles.sectionTitle}>第1条（適用）</h2>
        <p className={styles.text}>
          本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されます。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第2条（利用登録）</h2>
        <ol className={styles.list}>
          <li className={styles.listItem}>
            本サービスの利用を希望する者は、本規約に同意のうえ、当社の定める方法により利用登録を申請するものとします。
          </li>
          <li className={styles.listItem}>
            本サービスは、20歳未満の方は利用することができません。ユーザーは、利用登録時において20歳以上であることを保証するものとします。
          </li>
          <li className={styles.listItem}>
            運営者は、以下の場合に登録を拒否することがあります。
            <ul className={styles.subList}>
              <li>虚偽の情報を提供した場合</li>
              <li>過去に規約違反があった場合</li>
              <li>その他、運営者が不適切と判断した場合</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第3条（アカウント管理）</h2>
        <p className={styles.text}>
          ユーザーは自己の責任においてアカウント情報を管理するものとし、不正利用について運営者は責任を負いません。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第4条（サービス内容）</h2>
        <p className={styles.text}>
          本サービスは、ユーザー同士の交流・マッチングの機会を提供するものであり、特定の成果を保証するものではありません。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第5条（禁止事項）</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>虚偽のプロフィール登録</li>
          <li className={styles.listItem}>他者への誹謗中傷、嫌がらせ</li>
          <li className={styles.listItem}>性的・わいせつな目的での利用</li>
          <li className={styles.listItem}>商業目的の勧誘・営業行為</li>
          <li className={styles.listItem}>法令または公序良俗に反する行為</li>
          <li className={styles.listItem}>他ユーザーの個人情報の収集・公開</li>
          <li className={styles.listItem}>なりすまし行為</li>
          <li className={styles.listItem}>その他運営者が不適切と判断する行為</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第6条（投稿内容の取り扱い）</h2>
        <ol className={styles.list}>
          <li className={styles.listItem}>
            ユーザーが投稿した内容の責任はユーザー自身にあります。
          </li>
          <li className={styles.listItem}>
            運営者は、必要に応じて投稿内容を削除することができます。
          </li>
        </ol>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第7条（マッチングおよびチャット）</h2>
        <ol className={styles.list}>
          <li className={styles.listItem}>
            本サービスにおけるマッチングおよびチャットは、ユーザー間の自己責任において行われるものとします。
          </li>
          <li className={styles.listItem}>
            ユーザー間のトラブルについて、運営者は一切の責任を負いません。
          </li>
        </ol>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第8条（広告の表示について）</h2>
        <ol className={styles.list}>
          <li className={styles.listItem}>
            本サービスでは、第三者配信による広告を掲載する場合があります。
          </li>
          <li className={styles.listItem}>
            広告内容および広告先のサービスについては、各広告主の責任において提供されるものであり、運営者はその内容の正確性・安全性等について保証するものではありません。
          </li>
          <li className={styles.listItem}>
            ユーザーが広告を通じて外部サイトを利用した場合、当該サイトにおける取引やトラブルについて、運営者は一切の責任を負いません。
          </li>
          <li className={styles.listItem}>
            広告の内容や表示方法は、運営者の判断により変更される場合があります。
          </li>
        </ol>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第9条（サービスの停止・変更）</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>システム保守</li>
          <li className={styles.listItem}>不可抗力（災害・障害等）</li>
          <li className={styles.listItem}>その他運営上必要な場合</li>
        </ul>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第10条（利用制限および登録抹消）</h2>
        <p className={styles.text}>
          運営者は、ユーザーが本規約に違反した場合、事前通知なくアカウント停止または削除を行うことができます。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第11条（免責事項）</h2>
        <ol className={styles.list}>
          <li className={styles.listItem}>
            本サービスの利用により生じた損害について、運営者は責任を負いません。
          </li>
          <li className={styles.listItem}>
            ユーザー間のトラブルについても同様とします。
          </li>
        </ol>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第12条（規約の変更）</h2>
        <p className={styles.text}>
          運営者は、必要に応じて本規約を変更することができるものとします。
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>第13条（準拠法・管轄）</h2>
        <p className={styles.text}>
          本規約は日本法を準拠法とし、本サービスに関する紛争は運営者所在地を管轄する裁判所を専属的合意管轄とします。
        </p>
      </section>

      <p className={styles.footer}>以上</p>
    </main>
  )
}