interface NumberInstructionPairProps {
  number: number;
  instruction: string;
  absolutePosition: string;
}

export default function NumberInstructionPair({ number, instruction, absolutePosition }: NumberInstructionPairProps) {
  return (
    <div
      className={`absolute flex flex-row justify-start items-start gap-3 font-bold text-black text-sm sm:text-sm md:text-base ${absolutePosition}`}
    >
      <div className={"bg-white size-8 px-[2.5%] py-[1%] rounded-full flex justify-center items-center"}>
        <p>{number}</p>
      </div>
      <div className={"bg-white rounded-2xl w-[85%] text-left px-[3%] py-[1%]"}>
        <p>{instruction}</p>
      </div>
    </div>
  );
}
