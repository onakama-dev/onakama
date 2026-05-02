"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  // ⭐ 追加：規約同意
  const [agreed, setAgreed] = useState(false);

  // ⭐ 新規登録時は同意も必須
  const isValid =
    email.length > 0 &&
    password.length >= 6 &&
    (isLoginMode || agreed);

  const signUp = async () => {
    if (!agreed) {
      setMessage("利用規約に同意してください。");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("確認メールを送信しました。メールをご確認ください。");
    }

    setLoading(false);
  };

  const login = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("メールアドレスまたはパスワードが正しくありません。");
    } else {
      router.replace("/home");
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    if (isLoginMode) {
      await login();
    } else {
      await signUp();
    }
  };

  return (
    <main className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>
          {isLoginMode ? "ログイン" : "新規登録"}
        </h1>

        <div className={styles.authToggle}>
          <button
            className={isLoginMode ? styles.active : ""}
            onClick={() => setIsLoginMode(true)}
          >
            ログイン
          </button>
          <button
            className={!isLoginMode ? styles.active : ""}
            onClick={() => setIsLoginMode(false)}
          >
            新規登録
          </button>
        </div>

        <div className={styles.formGroup}>
          <label>メールアドレス</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>パスワード</label>
          <input
            type="password"
            placeholder="6文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ⭐ 新規登録時のみ表示 */}
        {!isLoginMode && (
          <>
            <p className={styles.submitGuide}>
              メールアドレスとパスワードを入力後、
              「登録してはじめる」を押すとアカウントが作成されます。
            </p>

            {/* ⭐ 利用規約同意 */}
            <div className={styles.termsBox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  <Link href="/terms" target="_blank" className={styles.link}>
                    利用規約
                  </Link>
                  に同意する
                </span>
              </label>
            </div>
          </>
        )}

        {message && <p className={styles.authMessage}>{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={styles.primaryButton}
        >
          {loading
            ? "処理中..."
            : isLoginMode
            ? "ログインする"
            : "登録してはじめる"}
        </button>

        {!isLoginMode && (
          <p className={styles.authNote}>
            ※ 顔写真や本名の登録は不要です。<br />
            ニックネームでご利用いただけます。
          </p>
        )}
      </div>
    </main>
  );
}