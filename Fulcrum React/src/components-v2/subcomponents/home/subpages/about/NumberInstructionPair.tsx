import { cn } from "@/utility/util.ts";

interface NumberInstructionPairProps {
  number: number;
  instruction: string;
  className?: string;
}

export default function NumberInstructionPair({ number, instruction, className }: NumberInstructionPairProps) {
  return (
    <div
      className={cn(
        "absolute flex flex-row justify-start items-start gap-3 font-bold text-black text-sm sm:text-sm md:text-base",
        className,
      )}
    >
      <div className={"bg-white size-8 rounded-full flex justify-center items-center"}>
        <p>{number}</p>
      </div>
      <div className={"bg-white rounded-2xl w-[85%] text-left px-5 py-[1%]"}>
        <p>{instruction}</p>
      </div>
    </div>
  );
}
