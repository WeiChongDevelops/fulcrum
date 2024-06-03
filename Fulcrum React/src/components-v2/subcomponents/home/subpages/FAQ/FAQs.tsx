import FAQItem from "./FAQItem.tsx";
import { faqData } from "../../../../../utility/util.ts";

export default function FAQs() {
  return (
    <div className={"w-screen h-screen py-16 bg-gradient-to-b from-emerald-100 saturate-[80%] to-white"}>
      <div className={"prose mx-auto max-w-[80vw] relative"}>
        <img
          src="/static/assets-v2/homepage-assets/homepage-highlight-5.png"
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
        <div className={"flex flex-row justify-center items-center mt-8 gap-4"}>
          <img src="/static/assets-v2/homepage-assets/homepage-highlight-3.png" className={"w-4"} alt="" />
          <p className={"font-medium"}>
            Still have questions? Contact our customer support team through the contact form on our website.
          </p>
        </div>
      </div>
    </div>
  );
}
