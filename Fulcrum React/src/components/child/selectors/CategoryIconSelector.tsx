import "../../../css/Budget.css";
import {
  HandHeart,
  Drop,
  PiggyBank,
  Martini,
  CarProfile,
  Money,
  Lightning,
  Gift,
  Heartbeat,
  HouseLine,
  FilmStrip,
  MusicNotes,
  PawPrint,
  GasPump,
  AirplaneTilt,
  TShirt,
  Wrench,
  Train,
  Orange,
  ShoppingCart,
  FireExtinguisher,
  BowlFood,
  Barbell,
  Pill,
  Users,
  Devices,
  Volleyball,
  Television,
  ForkKnife,
  WifiHigh,
  Coin,
  ChartLine,
  GraduationCap,
  HandSoap,
  Shovel,
  Broom,
  Couch,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils.ts";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BudgetCreationFormData, BudgetUpdatingFormData } from "@/utility/types.ts";

interface CategoryIconSelectorProps {
  formData?: BudgetCreationFormData | BudgetUpdatingFormData;
  setFormData: Dispatch<SetStateAction<BudgetCreationFormData>> | Dispatch<SetStateAction<BudgetUpdatingFormData>>;
  className: string;
}

/**
 * A visual selector for the user to choose an icon for a budget category.
 */
export default function CategoryIconSelector({ formData, setFormData, className }: CategoryIconSelectorProps) {
  const iconComponents = [
    HandHeart,
    Drop,
    PiggyBank,
    Martini,
    CarProfile,
    Money,
    Lightning,
    Gift,
    Heartbeat,
    HouseLine,
    FilmStrip,
    MusicNotes,
    PawPrint,
    GasPump,
    AirplaneTilt,
    TShirt,
    Wrench,
    Train,
    Orange,
    ShoppingCart,
    FireExtinguisher,
    BowlFood,
    Barbell,
    Pill,
    Users,
    Devices,
    Volleyball,
    Television,
    ForkKnife,
    WifiHigh,
    ChartLine,
    GraduationCap,
    HandSoap,
    Shovel,
    Broom,
    Couch,
  ];

  const DEFAULT_CATEGORY_ICON = Coin;

  const [isActive, setIsActive] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(formData ? formData.iconPath : DEFAULT_CATEGORY_ICON.displayName);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleIconSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedIcon(e.currentTarget.getAttribute("data-value")!);
    setFormData((prevFormData: any) => ({ ...prevFormData, iconPath: e.currentTarget.getAttribute("data-value")! }));
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!!selectorRef.current) {
        if (selectorRef.current.contains(e.target as Node)) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={selectorRef}
      className={cn(
        `grid grid-cols-6 place-items-center gap-2 outline outline-1 shadow outline-gray-200 p-2 rounded-lg ${isActive ? "outline-primary" : "outline-muted"}`,
        className,
      )}
    >
      {/*{categoryIconArray.map((iconFileName, key) => {*/}
      {/*  return (*/}
      {/*    <button data-value={iconFileName} className="category-icon-selectable" key={key}>*/}
      {/*      <img src={`/static/assets-v2/category-icons/${iconFileName}`} alt="Icon option" />*/}
      {/*    </button>*/}
      {/*  );*/}
      {/*})}*/}

      {iconComponents.map((IconComponent, index) => (
        <button
          data-value={IconComponent.displayName}
          key={index}
          onClick={handleIconSelection}
          className={`flex justify-center items-center size-10 p-1.5 text-primary transition-all duration-100 ease-out rounded-full outline-primary outline-2 ${selectedIcon === IconComponent.displayName && "outline"}`}
        >
          <IconComponent size={28} weight={"regular"} />
        </button>
      ))}
    </div>
  );
}
