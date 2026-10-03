type FavoriteButtonProps = { active: boolean; label: string; onToggle: () => void }

export function FavoriteButton({ active, label, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Убрать ${label} из избранного` : `Добавить ${label} в избранное`}
      title={active ? 'Убрать из избранного' : 'В избранное'}
      className={`text-2xl leading-none transition hover:scale-110 ${active ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
    >
      {active ? '★' : '☆'}
    </button>
  )
}
