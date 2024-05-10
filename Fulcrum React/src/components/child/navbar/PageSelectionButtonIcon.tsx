interface PageSelectionButtonIconProps {
  fulcrumPage: string;
  isCurrentWindowLocation: boolean;
  isHoveredWindowLocation: boolean;
}

export default function PageSelectionButtonIcon({
  fulcrumPage,
  isCurrentWindowLocation,
  isHoveredWindowLocation,
}: PageSelectionButtonIconProps) {
  return (
    <img
      src={`/static/assets-v2/navbar-icons/${fulcrumPage}-icon-${isCurrentWindowLocation ? "white" : "black"}.svg`}
      className={`w-6 transition-opacity duration-300 ${isCurrentWindowLocation && isHoveredWindowLocation && "opacity-0"}`}
      alt="Navigation icon"
    />
  );
}
