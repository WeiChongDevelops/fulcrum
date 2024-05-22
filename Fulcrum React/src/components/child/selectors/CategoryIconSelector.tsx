import { categoryIconArray } from "../../../utility/util.ts";
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
  Asterisk,
  BowlFood,
  Barbell,
  Pill,
  Users,
  Devices,
  Volleyball,
  Television,
  ForkKnife,
  WifiHigh,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils.ts";

/**
 * A visual selector for the user to choose an icon for a budget category.
 */
export default function CategoryIconSelector({ className }: { className: string }) {
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
    Asterisk,
    BowlFood,
    Barbell,
    Pill,
    Users,
    Devices,
    Volleyball,
    Television,
    ForkKnife,
    WifiHigh,
  ];
  return (
    <div
      className={cn(
        `grid grid-cols-6 place-items-center gap-4 outline outline-1 shadow outline-gray-200 p-4 rounded-lg`,
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
        <IconComponent key={index} size={32} weight={"regular"} data-value={IconComponent} />
      ))}
    </div>
  );
}
