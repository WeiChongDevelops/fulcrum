import FulcrumButton from "../../../other/FulcrumButton.tsx";

export default function UpperCopy() {
    return (
        <div className={"flex flex-col justify-start items-center w-screen px-20 pt-40 pb-6 text-black min-h-screen relative"}>
            <div className={"flex flex-row justify-center items-start"}>
                <div className={"upper-copy-first-row flex flex-col justify-start items-start pt-6 w-[40vw] relative mr-8 sm:mr-32"}>
                    <img src="/src/assets/homepage-assets/homepage-highlight-1.png" className={"w-8 absolute left-[100%] top-0"} alt=""/>
                    <p className={"text-5xl text-left font-bold"}>It's time to start paying yourself first.</p>
                    <p className={"my-6 font-bold"}>180,000 others have found their balance.</p>
                    <div className={"flex flex-row justify-start items-center mb-8"}>
                        <img src="/src/assets/homepage-assets/testimonials.svg" alt="" className={"w-32"}/>
                        <div className={"flex flex-row justify-start items-center rounded-full bg-[#F7FFFAFF] py-2 pl-2.5 pr-6 ml-2"}>
                            <img src="/src/assets/homepage-assets/kylie.png" className={"rounded-full border-4 border-white w-20"} alt=""/>
                            <div className={"flex flex-col justify-center items-start ml-4 w-80"}>
                                <p className={"text-sm font-medium text-left"}>"This relief from financial stress has been an absolute game changer for my family and I."</p>
                                <p className={"font-bold text-xs ml-0.5 mt-1"}>Kylie Capelli</p>
                            </div>
                        </div>
                    </div>
                    <p className={"font-medium"}>Integrated Budgeting and Expense Tracking</p>
                </div>
                <div className={"flex flex-col justify-start items-start pt-12 text-md font-medium w-[30vw] text-left relative"}>
                    <div className={"flex flex-row justify-start items-start"}>
                        <div className={"homepage-number-circle mr-4 mt-1"}>1</div>
                        <p>Sign up for a free account.</p>
                    </div>
                    <div className={"flex flex-row justify-start items-start mt-4"}>
                        <div className={"homepage-number-circle mr-4 mt-1"}>2</div>
                        <p>Estimate your income and create your budget, giving every dollar a job.</p>
                    </div>
                    <div className={"flex flex-row justify-start items-start mt-4"}>
                        <div className={"homepage-number-circle mr-4 mt-1"}>3</div>
                        <p>Log your expenses over time, checking in with your budget to stay on track.</p>
                    </div>
                    <div className={"flex flex-row justify-start items-start mt-4"}>
                        <div className={"homepage-number-circle mr-4 mt-1"}>4</div>
                        <p>Watch as your savings grow and your financial stress fade away.</p>
                    </div>
                    <div>
                        <FulcrumButton displayText={"Start Saving"}
                                       backgroundColour={"green"}
                                       onClick={() => window.location.href = "http://localhost:5173/register"}
                                       hoverShadow={true}
                                       optionalTailwind={"shadow-[0.4rem_0.4rem_0px_black] mt-8 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[0.75rem_0.75rem_0px_black]"}/>
                        <img src="/src/assets/homepage-assets/homepage-highlight-2.png" className={"w-8 absolute left-[90%] bottom-0"} alt=""/>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col justify-center items-center rounded-lg w-[90vw] h-60 bg-[#282d33] text-white text-xl shadow-[1.5rem_1.5rem_0_black] select-none mt-40"}>
                <img src="/src/assets/homepage-assets/complicated.png" className={"w-[30rem] sm:w-[42rem] mb-3"} alt=""/>
                <p className={"font-extrabold text-md mt-8 text-[#44b775]"}>Find <span className={"underline underline-offset-2"}>your</span> balance.</p>
            </div>
            <div className={"flex flex-row justify-start items-center relative mt-20 font-bold text-lg sm:text-[1.7rem]"}>
                <img src="/src/assets/homepage-assets/homepage-highlight-3.png" className={"w-2 sm:w-5 mr-6 mb-3"} alt=""/>
                <div className={"flex flex-row justify-center"}>
                    <p>All the features you need, for free,</p>
                    <div className={"flex flex-col items-center sm:ml-1"}>
                        <p>forever.</p>
                        <img src="/src/assets/homepage-assets/homepage-highlight-4.png" className={"w-20 sm:w-[6.5rem] -bottom-[1rem]"} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    );
}