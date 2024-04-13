interface FulcrumAnimationProps {
  lineAngle: number;
  isDarkMode: boolean;
  activeTriangleFulcrum: string;
  bowlShadowDimensions: {
    right: {
      width: string;
      height: string;
      transform: string;
    };
    left: {
      width: string;
      height: string;
      transform: string;
    };
  };
}

/**
 * A budget-responsive visual representation of a scale, used to visualise the balance between budget and income.
 */
export default function FulcrumAnimation({
  lineAngle,
  isDarkMode,
  activeTriangleFulcrum,
  bowlShadowDimensions,
}: FulcrumAnimationProps) {
  return (
    <div className="fulcrum-animation-container">
      <div className="fulcrum-triangle-container">
        <img src={activeTriangleFulcrum} alt="Triangle fulcrum" />
        <div className="contact-shadow"></div>
        <div className="bowl-shadow-right" style={bowlShadowDimensions.right}></div>
        <div className="bowl-shadow-left" style={bowlShadowDimensions.left}></div>
      </div>
      <div
        className="rotating-container -translate-x-1/2"
        style={{ transform: `rotate(${-lineAngle}deg) translateX(-50%)` }}
      >
        <div className="rotating-text-label-container">
          <b className={`${isDarkMode ? "text-white" : "text-black"}`}>BUDGET</b>
          <b className={`${isDarkMode ? "text-white" : "text-black"}`}>INCOME</b>
        </div>
        <img
          src={`/src/assets/fulcrum-animation/fulcrum-rectangle-${isDarkMode ? "grey" : "black"}.png`}
          className="fulcrum-rectangle"
          alt="Fulcrum lever"
        />
        <img
          src={`/src/assets/fulcrum-animation/fulcrum-basket-${isDarkMode ? "grey" : "black"}.webp`}
          alt="Fulcrum bowl"
          className="fulcrum-bowl-left"
          style={{
            transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg)`,
          }}
        />
        <img
          src={`/src/assets/fulcrum-animation/fulcrum-basket-${isDarkMode ? "grey" : "black"}.webp`}
          alt="Fulcrum bowl"
          className="fulcrum-bowl-right"
          style={{
            transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg) `,
          }}
        />
      </div>
    </div>
  );
}
