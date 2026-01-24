// src/app/profile/page.tsx
import SafeNote from '@/components/SafeNote'

export default function ProfilePage() {
  return (
    <main className="container">
      <h2>プロフィール</h2>

      <SafeNote text="体調が悪いときは、途中でやめて大丈夫です" />

      <input placeholder="ニックネーム" />

      <select>
        <option>年代を選択</option>
        <option>20代</option>
        <option>30代</option>
        <option>40代</option>
      </select>

      <select>
        <option>IBSタイプ</option>
        <option>下痢型</option>
        <option>便秘型</option>
        <option>混合型</option>
        <option>わからない</option>
      </select>

      <textarea
        placeholder="相手に理解してほしいこと（例：外出は短時間が助かります）"
        rows={4}
      />

      <button className="button">保存する</button>
    </main>
  )
}
