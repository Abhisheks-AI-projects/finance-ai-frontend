export default function DotsLoader({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-[3px] items-center align-middle ${className}`}>
      <span className="w-[5px] h-[5px] rounded-full bg-foreground/60 dot-1" />
      <span className="w-[5px] h-[5px] rounded-full bg-foreground/60 dot-2" />
      <span className="w-[5px] h-[5px] rounded-full bg-foreground/60 dot-3" />
    </span>
  );
}
