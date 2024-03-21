import {ChangeEvent, FormEvent, useRef, useState} from "react";
import QueryTypeSelector from "../../selectors/QueryTypeSelector.tsx";
import emailjs from '@emailjs/browser';
import FulcrumButton from "../../other/FulcrumButton.tsx";
import Loader from "../../other/Loader.tsx";

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
        setFormData( curr => ({...curr, [e.target.id]: e.target.value}));
    }

    function getActivePlaceholder(queryType: string) {
        let placeholder = "";
        switch (queryType) {
            case ("reportIssue"):
                placeholder = "I'm reporting an issue about...";
                break;
            case ("accountInquiry"):
                placeholder = "I have an account issue regarding..."
                break;
            case ("generalInquiry"):
                placeholder = "I need help with..."
                break;
            default:
                placeholder = "I need help with..."
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
                        console.log('SUCCESS!');
                        setIsLoading(false);
                        setStatusAnimationKey(curr => curr + 1);
                        setFormStatus("Message sent! We'll get back to you as soon we can.");
                    },
                    (error: any) => {
                        console.log('FAILED...', error.text);
                        setIsLoading(false);
                        setStatusAnimationKey(curr => curr + 1);
                        setFormStatus("Message failed. Please try again later.");
                    },
                );
        }
    };

    return (
        <div className={"contact-container w-screen h-[calc(100vh-100px)] relative flex flex-row justify-around py-[6.5vw] -mb-[2.5rem] xl:-mb-[7.5rem] text-left text-black "}>
            <img src="/src/assets/homepage-assets/contact-background.png" className={"absolute top-0 left-0 -mt-28 -z-10 w-full h-[100vh]"} alt="Pricing background"/>
            <div className={"pricing-stripe absolute w-[150vw] h-[8vw] top-[38vh] -left-40 rotate-[-20deg] bg-[#17423f] -z-10"}></div>

            <div className={"contact-copy"}>
                <p className={"text-5xl font-bold mb-4"}>We're here to help.</p>
                <p className={"mt-2 font-bold"}>Reach out to our team for assistance or inquiries via the contact form.</p>
                {formStatus && <p className={"my-6 font-bold text-gray-600 contact-status w-40%"} key={statusAnimationKey}>{formStatus}</p>}
                <Loader isLoading={isLoading} isDarkMode={false} flexPosition={true}/>
            </div>
            <div className={"contact-form-container"}>
                <form className={"flex flex-col bg-[#282d33] px-10 py-5 rounded-md w-full bg-opacity-80 text-sm"}
                      ref={formRef}
                      onSubmit={handleSubmit}>

                    <p className={"font-bold text-white text-center text-xl"}>Contact Us</p>

                    <label htmlFor="queryType" className={"text-white text-sm"}>Query Type</label>
                    <QueryTypeSelector setFormData={setFormData}/>

                    <div className={"flex flex-row justify-between"}>
                        <div className={"flex flex-col w-[38%]"}>
                            <label htmlFor="firstName" className={"mt-4 text-white"}>First Name</label>
                            <input
                                id={"firstName"}
                                value={formData.firstName}
                                placeholder={"Your first name"}
                                name={"firstName"}
                                onChange={handleInputChange}
                                className={"mt-2 py-1.5 px-3"}
                                required/>
                        </div>

                        <div className={"flex flex-col w-[56%]"}>
                            <label htmlFor="email" className={"mt-4 text-white"}>Email</label>
                            <input
                                type={"email"}
                                id={"email"}
                                value={formData.email}
                                placeholder={"email@example.com"}
                                name={"email"}
                                onChange={handleInputChange}
                                className={"mt-2 py-1.5 px-3"}
                                required/>
                        </div>
                    </div>

                    <label htmlFor="subject" className={"mt-4 text-white"}>Subject</label>
                    <input type="text"
                           id={"subject"}
                           value={formData.subject}
                           name={"subject"}
                           placeholder={getActivePlaceholder(formData.queryType)}
                           onChange={handleInputChange}
                           className={"mt-2 py-1.5 px-3"}
                           required/>

                    <label htmlFor="description" className={"mt-4 text-white"}>Description</label>
                    <textarea
                           id={"description"}
                           value={formData.description}
                           name={"description"}
                           placeholder={"Please include all information relevant to your issue."}
                           onChange={handleInputChange}
                           className={"mt-2 py-1.5 px-3 mb-3.5"}
                           required/>
                    <FulcrumButton displayText={"Send"} backgroundColour={"grey"} hoverShadow={true} />
                </form>
            </div>
        </div>
    );
}