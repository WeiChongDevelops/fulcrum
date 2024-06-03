import NumberInstructionPair from "@/components-v2/subcomponents/NumberInstructionPair.tsx";

/**
 * Lower-page component displaying extended use steps infographic.
 */
export default function LowerCopy() {
  return (
    <div className={"relative w-screen z-10 -mb-[14vw]"}>
      <NumberInstructionPair
        number={1}
        instruction={"Sign up for a free account."}
        absolutePosition={"bottom-[45.2%] left-[3%] w-[38%]"}
      />
      <NumberInstructionPair
        number={2}
        instruction={"Create your budget, giving every dollar a job."}
        absolutePosition={"bottom-[33.8%] right-[0.5%] w-[44.5%]"}
      />
      <NumberInstructionPair
        number={3}
        instruction={"Log your expenses over time, checking in with your budget to stay on track."}
        absolutePosition={"bottom-[23%] left-[3%] w-[49%]"}
      />
      <NumberInstructionPair
        number={4}
        instruction={"Watch as your savings grow and your financial stress fades away!"}
        absolutePosition={"bottom-[12%] right-[11%] w-[41.5%]"}
      />
      <img src="/assets-v2/homepage-assets/mid-lower-copy-background-2.png" alt="App instructions" className={"w-full"} />
    </div>
  );
}
