interface OAuthLoginButtonProps {
  socialIconPath: string;
  backgroundColour: string;
  textColour: string;
  borderColour: string;
  buttonText: string;
  provider: string;
  openOAuthLogin: (provider: string) => void;
}

export default function OAuthLoginButton({
  socialIconPath,
  backgroundColour,
  textColour,
  borderColour,
  buttonText,
  provider,
  openOAuthLogin,
}: OAuthLoginButtonProps) {
  function handleOAuthLoginClick() {
    openOAuthLogin(provider);
  }

  return (
    <button
      type={"button"}
      onClick={handleOAuthLoginClick}
      className={"w-64 text-sm text-left rounded-3xl font-bold flex items-center px-[1.5em] py-[0.5em] gap-4"}
      style={{ backgroundColor: backgroundColour, border: `2px solid ${borderColour}`, color: textColour }}
    >
      <img src={socialIconPath} alt="Social icon" className={"w-[10%]"} />
      <p>{buttonText}</p>
    </button>
  );
}
