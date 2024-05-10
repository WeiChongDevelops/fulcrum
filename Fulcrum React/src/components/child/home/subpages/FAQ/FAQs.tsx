import FAQItem from "./FAQItem.tsx";
import { faqData } from "../../../../../utility/util.ts";

export default function FAQs() {
  return (
    <div className={"prose mx-auto max-w-[80vw] my-16 relative"}>
      <img
        src="/public/static/assets/homepage-assets/homepage-highlight-5.png"
        className={"w-12 absolute top-8 -left-10 rotate-[125deg]"}
        alt=""
      />
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
      <p className={"font-medium mt-12"}>
        Still have questions? Contact our customer support team through the contact form on our website.
      </p>
    </div>
  );
}
