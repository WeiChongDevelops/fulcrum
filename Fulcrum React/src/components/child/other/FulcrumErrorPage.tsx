interface FulcrumErrorPage {
  errors: Error[];
}

export default function FulcrumErrorPage({ errors }: FulcrumErrorPage) {
  return (
    <div className={"flex flex-col justify-center items-center h-screen gap-14 text-black font-bold"}>
      <p>There's been an error. Please try again later or get in touch via the contact form.</p>
      {errors &&
        errors.map((error, key) => (
          <div key={key}>
            <p className={"text-red-500"}>{error.message}</p>
            <p className={"text-gray-500 text-xs max-w-[60vw]"}>{error.stack}</p>
          </div>
        ))}
      <img src="/src/assets/fulcrum-logos/fulcrum-icon.png" className={"w-10 h-10"} alt="Fulcrum icon" />
    </div>
  );
}
