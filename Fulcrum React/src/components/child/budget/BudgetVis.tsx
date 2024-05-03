import { PieArcSeries, PieArcLabel, PieChart } from "reaviz";
import { BudgetItemEntity, BudgetModalVisibility, SetModalVisibility } from "../../../utility/types.ts";
import { useEffect, useRef, useState } from "react";
import { addFormExitListeners, changeFormOrModalVisibility } from "../../../utility/util.ts";
import FulcrumButton from "../buttons/FulcrumButton.tsx";

interface DataVisProps {
  budgetArray: BudgetItemEntity[];
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;
}

export default function BudgetVis({ budgetArray, setBudgetModalVisibility }: DataVisProps) {
  function donutDataFromBudgetArray(budgetArray: BudgetItemEntity[]) {
    return budgetArray.map((budgetItem) => ({
      key: budgetItem.category.length < 12 ? budgetItem.category : budgetItem.category.substring(0, 9) + "...",
      data: budgetItem.amount,
    }));
  }

  const modalRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(850);

  useEffect(() => {
    function resizeChart() {
      const body = document.querySelector("body");
      console.log(body?.getBoundingClientRect().width! / 2);
      setChartWidth(body?.getBoundingClientRect().width! / 2);
    }
    window.addEventListener("resize", resizeChart);
    return () => window.removeEventListener("resize", resizeChart);
  }, []);

  const hideForm = () => {
    changeFormOrModalVisibility(setBudgetModalVisibility, "isDataVisVisible", false);
  };

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, modalRef);
    return () => {
      removeFormExitEventListeners();
    };
  }, []);

  return (
    <div
      className={
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 bg-[#17423f] font-bold text-white opacity-90 flex flex-col justify-start items-center"
      }
      ref={modalRef}
    >
      <FulcrumButton
        onClick={hideForm}
        displayText={"Close"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>
      <div>
        <PieChart
          width={chartWidth}
          height={chartWidth / 1.6}
          data={donutDataFromBudgetArray(budgetArray)}
          series={
            <PieArcSeries
              doughnut={true}
              colorScheme={"pastel2"}
              label={
                <PieArcLabel
                  fontSize={chartWidth > 545 ? 16 : chartWidth > 185 ? 11 : 6}
                  width={chartWidth / 4}
                  fontFill={"white"}
                />
              }
            />
          }
        />
      </div>
    </div>
  );
}
