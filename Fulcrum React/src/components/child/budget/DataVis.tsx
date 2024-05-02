import { PieArcSeries, PieArcLabel, PieChart, PieArc, ChartTooltip, TooltipTemplate, formatValue } from "reaviz";
import { BudgetItemEntity } from "../../../utility/types.ts";
import FulcrumButton from "../buttons/FulcrumButton.tsx";
interface DataVisProps {
  budgetArray: BudgetItemEntity[];
}

export default function DataVis({ budgetArray }: DataVisProps) {
  function donutDataFromBudgetArray(budgetArray: BudgetItemEntity[]) {
    return budgetArray.map((budgetItem) => ({ key: budgetItem.category, data: budgetItem.amount }));
  }

  return (
    <div className={"relative w-screen h-screen"}>
      <div
        className={
          "bg-[#2e2c36] rounded-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-12 min-w-[85vw] min-h-[60vh]"
        }
      >
        <div className={"flex flex-row justify-around items-center font-bold gap-16"}>
          <div>
            <PieChart
              width={500}
              height={500}
              data={donutDataFromBudgetArray(budgetArray)}
              series={
                <PieArcSeries doughnut={true} colorScheme={"pastel2"} label={<PieArcLabel fontSize={10} width={70} />} />
              }
            />
          </div>
          <div className={"w-2/3 flex flex-col justify-center items-center"}>
            <p>Evaluation</p>
            <p>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor incidunt, inventore laboriosam maiores
                nesciunt perspiciatis porro quas suscipit voluptate voluptates! Culpa cupiditate illo labore provident quae
                quibusdam similique suscipit tempora!
              </span>
            </p>
            <p className={"mt-6"}>Feedback</p>
            <ul>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia praesentium quis quos voluptas?</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia praesentium quis quos voluptas?</li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia praesentium quis quos voluptas?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
