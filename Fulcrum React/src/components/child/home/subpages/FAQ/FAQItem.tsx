import { useRef, useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [toggleOpen, setToggleOpen] = useState(false);
  const [height, setHeight] = useState("0px");

  const answerRef = useRef<HTMLDivElement>(null);

  function handleToggle() {
    setToggleOpen(!toggleOpen);
    setHeight(toggleOpen ? "0px" : `${answerRef.current!.scrollHeight + 20}px`);
  }

  return (
    <div className={`relative flex flex-col items-center ${!toggleOpen && "border-b-2 border-gray-700"}`}>
      <div
        className={
          "z-40 font-bold outline-2 bg-white w-full flex flex-row justify-between items-center px-8 hover:cursor-pointer hover:bg-gray-100"
        }
        onClick={handleToggle}
      >
        <p>{question}</p>
        <img
          src="/static/assets/homepage-assets/scroll-arrow.svg"
          className={`w-6 h-6 select-none transition-transform 150ms ease-out ${toggleOpen && "rotate-180"}`}
          alt="Toggle arrow"
        />
      </div>
      <div
        ref={answerRef}
        style={{ height: toggleOpen ? `${height}` : "0px", overflow: "hidden" }}
        className="z-0 text-sm font-medium w-full bg-[#bce3c8] text-black flex flex-row justify-center items-center transition-all ease-out duration-150"
      >
        <p className={"select-none"}>{answer}</p>
      </div>
    </div>
  );
}
