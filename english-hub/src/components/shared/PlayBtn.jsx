export default function PlayBtn({ audio, small }) {
  if (!audio) return null
  const sz = small ? 'px-2 py-0.5 text-xs gap-1' : 'px-3 py-1 text-xs gap-1.5'
  return (
    <a href={audio} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center bg-emerald-800 hover:bg-emerald-700 text-white rounded-full transition-colors flex-shrink-0 ${sz}`}>
      <svg width={small?9:11} height={small?9:11} viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
      Play
    </a>
  )
}
