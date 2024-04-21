import { handleUserOAuthLoginPrompt } from "../utility/api.ts";

interface OAuthLoginButtonProps {
  socialIconPath: string;
  backgroundColour: string;
  textColour: string;
  borderColour: string;
  buttonText: string;
  provider: string;
}

export default function OAuthLoginButton({
  socialIconPath,
  backgroundColour,
  textColour,
  borderColour,
  buttonText,
  provider,
}: OAuthLoginButtonProps) {
  return (
    <button
      type={"button"}
      onClick={() => handleUserOAuthLoginPrompt(provider)}
      className={"w-72 text-left rounded-3xl font-bold flex items-center px-[1.5em] py-[0.5em] gap-4"}
      style={{ backgroundColor: backgroundColour, border: `2px solid ${borderColour}`, color: textColour }}
    >
      <img src={socialIconPath} alt="Social icon" className={"w-[10%]"} />
      <p>{buttonText}</p>
    </button>
  );
}
