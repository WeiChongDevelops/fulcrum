interface FulcrumErrorPage {
  errors: Error[];
}

export default function FulcrumErrorPage({ errors }: FulcrumErrorPage) {
  return (
    <div className={"flex flex-col justify-center items-center h-screen gap-14 text-black font-bold"}>
      <p>There's been an error. Please try again later or reach through the contact form.</p>
      {errors && errors.map((error) => <p className={"text-red-500"}>{error.toString()}</p>)}
      <img src="/src/assets/fulcrum-logos/fulcrum-icon.png" className={"w-10 h-10"} alt="Fulcrum icon" />
    </div>
  );
}
