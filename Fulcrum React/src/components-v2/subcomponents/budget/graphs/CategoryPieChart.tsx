import { PieChart, Pie, ResponsiveContainer, Sector, Cell } from "recharts";
import { useState } from "react";
import { BudgetItemEntity, GroupItemEntity, UserPreferences } from "@/utility/types.ts";
import { formatDollarAmountStatic, useEmail } from "@/utility/util.ts";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryPieChartProps {
  sortedBudgetArray: BudgetItemEntity[];
  currency: string;
}

export default function CategoryPieChart({ sortedBudgetArray, currency }: CategoryPieChartProps) {
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
          className={"brightness-50 dark:brightness-[500%] dark:saturate-[50%]"}
        >
          {payload.category.length < 12 ? payload.category : payload.category.substring(0, 9) + "..."}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill={userPreferences.darkModeEnabled ? "white" : "#545353"}
        >
          {displayValue}
        </text>
        <text
          className={"text-[0.8rem]"}
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
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

  const COLOURS = [
    "#022c39",
    "#064e4c",
    "#065f53",
    "#047864",
    "#059676",
    "#10b98e",
    "#34d3ac",
    "#6ee7c4",
    "#a7f3dd",
    "#a7f3dd",
    "#6ee7c4",
    "#34d3ac",
    "#10b98e",
    "#059676",
    "#047864",
    "#065f53",
    "#064e4c",
    "#022c39",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={730} height={250}>
        <Pie
          animationBegin={200}
          animationDuration={1000}
          animationEasing={"ease-out"}
          onMouseEnter={handlePieEnter}
          data={sortedBudgetArray}
          dataKey="amount"
          nameKey="category"
          innerRadius={"35%"}
          outerRadius={"55%"}
          paddingAngle={1}
          activeShape={renderActiveBudgetShape}
          activeIndex={activeIndex}
        >
          {sortedBudgetArray.map((_, index) => (
            <Cell key={index} stroke={"none"} fill={COLOURS[index % COLOURS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
