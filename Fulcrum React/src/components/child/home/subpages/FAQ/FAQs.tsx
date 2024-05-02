import FAQItem from "./FAQItem.tsx";
import { faqData } from "../../../../../utility/util.ts";

export default function FAQs() {
  return (
    <div className={"prose mx-auto max-w-[80vw] my-16"}>
      <h1>FAQs</h1>
      <div className={"border-2 rounded-md border-gray-700 settings-box-shadow"}>
        <div>
          {faqData.map((faq, key) => (
            <div key={key}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
