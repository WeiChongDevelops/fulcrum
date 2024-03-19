import {ChangeEvent, useState} from "react";
import QueryTypeSelector from "../../selectors/QueryTypeSelector.tsx";

export default function Contact() {

    const [formData, setFormData] = useState({
        queryType: "",
        subject: "",
        description: ""
    });

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

    return (
        <div className={"w-screen h-[calc(100vh-100px)] relative flex flex-row justify-around p-[8vw] -mb-[7.75rem] text-left text-black "}>
            <img src="/src/assets/homepage-assets/contact-background.png" className={"absolute top-0 left-0 -mt-28 -z-10 w-full h-[100vh]"} alt="Pricing background"/>
            <div className={"absolute w-[150vw] h-[8vw] top-[16vw] -left-40 rotate-[-20deg] bg-[#17423f] -z-10"}></div>

            <div className={"flex flex-col"}>
                <p className={"text-5xl font-bold mb-4"}>We're here to help.</p>
                <p className={"my-6 font-bold"}>Reach out to our team for assistance or inquiries via the contact form.</p>
            </div>
            <div className={"flex flex-col"}>
                <form className={"flex flex-col bg-[#282d33] p-10 rounded-md w-[30vw] bg-opacity-80"}>
                    <p className={"font-bold text-center text-3xl mt-3 mb-8 text-white"}>Contact Us</p>

                    <label htmlFor="queryType" className={"text-white"}>Query Type</label>
                    <QueryTypeSelector setFormData={setFormData}/>

                    <label htmlFor="subject" className={"mt-4 text-white"}>Subject</label>
                    <input type="text"
                           id={"subject"}
                           value={formData.subject}
                           placeholder={getActivePlaceholder(formData.queryType)}
                           onChange={handleInputChange}
                           className={"mt-2 py-1.5 px-3 placeholder:text-sm"}/>

                    <label htmlFor="description" className={"mt-4 text-white"}>Description</label>
                    <textarea
                           id={"description"}
                           value={formData.description}
                           placeholder={"Please include all information relevant to your issue."}
                           onChange={handleInputChange}
                           className={"mt-2 p-3 pb-12 placeholder:text-sm"}/>
                </form>
            </div>
        </div>
    );
}