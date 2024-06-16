import { PieChart, Pie, ResponsiveContainer, Sector, Cell } from "recharts";
import { useState } from "react";
import { UserPreferences } from "@/utility/types.ts";
import { formatDollarAmountStatic, useEmail } from "@/utility/util.ts";
import { useQueryClient } from "@tanstack/react-query";

interface GroupPieChartProps {
  sortedGroupDataArray: { group: string; amount: number; colour: string }[];
  currency: string;
}

export default function GroupPieChart({ sortedGroupDataArray, currency }: GroupPieChartProps) {
  const renderActiveBudgetShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    const displayValue = formatDollarAmountStatic(value, currency, true);

    const queryClient = useQueryClient();
    const userPreferences: UserPreferences = queryClient.getQueryData(["userPreferences", useEmail()])!;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className={"brightness-[30%] dark:brightness-100 saturate-[1000%] dark:saturate-[600%] font-medium"}
        >
          {payload.group.length < 12 ? payload.group : payload.group.substring(0, 9) + "..."}
        </text>
        <Sector
          className={"brightness-[83%] saturate-[600%]"}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          className={"brightness-[85%] saturate-[300%]"}
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          className={"brightness-[62%] saturate-[300%]"}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" className={"brightness-[85%] saturate-[300%]"} />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill={userPreferences.darkModeEnabled ? "white" : "#333"}
        >
          {displayValue}
        </text>
        <text
          className={"text-[0.8rem]"}
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill={userPreferences.darkModeEnabled ? "white" : "#545353"}
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={730} height={250}>
        <Pie
          animationBegin={200}
          animationDuration={1000}
          animationEasing={"ease-out"}
          onMouseEnter={handlePieEnter}
          data={sortedGroupDataArray}
          dataKey="amount"
          nameKey="group"
          innerRadius={"35%"}
          outerRadius={"55%"}
          paddingAngle={2}
          activeShape={renderActiveBudgetShape}
          activeIndex={activeIndex}
        >
          {sortedGroupDataArray.map((groupItem, index) => (
            <Cell key={index} fill={groupItem.colour} stroke={"none"} className={"brightness-[78%] saturate-[625%]"} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
