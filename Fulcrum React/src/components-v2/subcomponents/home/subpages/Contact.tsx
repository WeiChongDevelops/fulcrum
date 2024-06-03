import { ChangeEvent, FormEvent, useRef, useState } from "react";
import QueryTypeSelector from "../../selectors/QueryTypeSelector.tsx";
import emailjs from "@emailjs/browser";
import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";
import Loader from "../../other/Loader.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import { Textarea } from "@/components-v2/ui/textarea.tsx";
/**
 * The Contact section of the Fulcrum homepage.
 */
export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    queryType: "",
    firstName: "",
    email: "",
    subject: "",
    description: "",
  });
  const [formStatus, setFormStatus] = useState("");
  const [statusAnimationKey, setStatusAnimationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  }

  function getActivePlaceholder(queryType: string) {
    let placeholder = "";
    switch (queryType) {
      case "reportIssue":
        placeholder = "I'm reporting an issue about...";
        break;
      case "accountInquiry":
        placeholder = "I have an account issue regarding...";
        break;
      case "generalInquiry":
        placeholder = "I need help with...";
        break;
      default:
        placeholder = "I need help with...";
        break;
    }
    return placeholder;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setFormData({
      queryType: "",
      firstName: "",
      email: "",
      subject: "",
      description: "",
    });

    if (formRef.current) {
      emailjs
        .sendForm("service_vwm1kus", "template_6dptn0u", formRef.current, {
          publicKey: "BoMlc12_BvoHx0reJ",
        })
        .then(
          () => {
            console.log("SUCCESS!");
            setIsLoading(false);
            setStatusAnimationKey((prevKey) => prevKey + 1);
            setFormStatus("Message sent! We'll get back to you as soon we can.");
          },
          (error: any) => {
            console.log("FAILED...", error.text);
            setIsLoading(false);
            setStatusAnimationKey((prevKey) => prevKey + 1);
            setFormStatus("Message failed. Please try again later.");
          },
        );
    }
  };

  return (
    <div
      className={
        "contact-container w-screen h-[calc(100vh-100px)] bg-sky-200/20 relative flex flex-row justify-around py-[6.5vw] -mb-[2.5rem] xl:-mb-[7.5rem] text-left text-black "
      }
    >
      <img
        src="/static/assets-v2/homepage-assets/contact-background.png"
        className={"absolute top-0 left-0 -mt-28 -z-10 w-full h-[100vh]"}
        alt="Pricing background"
      />
      <div
        className={"pricing-stripe absolute w-[150vw] h-[8vw] top-[38vh] -left-40 rotate-[-20deg] bg-[#17423f] -z-10"}
      ></div>

      <div className={"contact-copy"}>
        <p className={"text-5xl font-bold mb-4"}>We're here to help.</p>
        <p className={"mt-2 font-bold"}>Reach out to our team for assistance.</p>
        {formStatus && (
          <p className={"my-6 font-bold text-green-500 contact-status w-40%"} key={statusAnimationKey}>
            {formStatus}
          </p>
        )}
        <Loader isLoading={isLoading} isDarkMode={false} positioning={"flex justify-center items-center mt-12"} />
      </div>
      <div className={"contact-form-container"}>
        <form
          className={"flex flex-col bg-[#282d33] px-10 py-10 rounded-md w-full bg-opacity-80 text-sm"}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <Label htmlFor="queryType" className={"text-white text-sm font-bold"}>
            Query Type
          </Label>
          <QueryTypeSelector formData={formData} setFormData={setFormData} className={"mt-2"} />

          <div className={"flex flex-row justify-between"}>
            <div className={"flex flex-col w-[38%]"}>
              <Label htmlFor="firstName" className={"mt-4 text-white font-bold"}>
                First Name
              </Label>
              <Input
                id={"firstName"}
                value={formData.firstName}
                placeholder={"Name"}
                name={"firstName"}
                onChange={handleInputChange}
                className={"mt-2 py-1.5 px-3 bg-white"}
                autoComplete={"off"}
                required
              />
            </div>

            <div className={"flex flex-col w-[56%]"}>
              <Label htmlFor="email" className={"mt-4 text-white font-bold"}>
                Email
              </Label>
              <Input
                type={"email"}
                id={"email"}
                value={formData.email}
                placeholder={"email@example.com"}
                name={"email"}
                onChange={handleInputChange}
                className={"mt-2 py-1.5 px-3 bg-white"}
                autoComplete={"email"}
                required
              />
            </div>
          </div>

          <Label htmlFor="subject" className={"mt-4 text-white font-bold"}>
            Subject
          </Label>
          <Input
            type="text"
            id={"subject"}
            value={formData.subject}
            name={"subject"}
            placeholder={getActivePlaceholder(formData.queryType)}
            onChange={handleInputChange}
            className={"mt-2 py-1.5 px-3 bg-white"}
            autoComplete={"off"}
            required
          />

          <Label htmlFor="description" className={"mt-4 text-white font-bold"}>
            Description
          </Label>
          <Textarea
            id={"description"}
            value={formData.description}
            name={"description"}
            placeholder={"Please include all information relevant to your issue."}
            onChange={handleInputChange}
            className={"mt-2 py-1.5 px-3 mb-6 bg-white"}
            autoComplete={"off"}
            required
          />
          <FulcrumButton displayText={"Send"} backgroundColour={"white"} hoverShadow={true} />
        </form>
      </div>
    </div>
  );
}
