/** Rozbija tekst po kropkach i renderuje każde zdanie w osobnym wersie, z zachowaniem kropek. */
export function splitSentences(text: string): string[] {
  return text.split(/(?<=\.)\s+/).filter(Boolean)
}

export function Sentences({ text }: { text: string }) {
  return (
    <>
      {splitSentences(text).map((sentence) => (
        <span key={sentence} className="block">
          {sentence}
        </span>
      ))}
    </>
  )
}
