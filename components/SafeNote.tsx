// src/components/SafeNote.tsx
export default function SafeNote({ text }: { text?: string }) {
  return (
    <div className="safenote">
      {text || 'このサービスでは体調を最優先にしてください'}
    </div>
  )
}
