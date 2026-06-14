export default function EmptySlot() {
  return (
    <div className="rounded-[var(--radius-md)] border-[1.5px] border-dashed border-neutral-300 bg-neutral-100 flex flex-col items-center justify-center gap-1.5 text-center p-3">
      <span className="text-lg opacity-40">✦</span>
      <span className="text-[10px] text-neutral-400 leading-[1.4]">
        광고 또는<br />이벤트 영역
      </span>
    </div>
  )
}
