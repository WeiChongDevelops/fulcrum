import { PieChart, Pie, ResponsiveContainer, Sector, Cell } from "recharts";
import { useState } from "react";
import { BudgetItemEntity, GroupItemEntity } from "@/utility/types.ts";
import { formatDollarAmountStatic } from "@/utility/util.ts";

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

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className={"brightness-50"}>
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
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {displayValue}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
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
    "#022c22",
    "#064e3b",
    "#065f46",
    "#047857",
    "#059669",
    "#10b981",
    "#34d399",
    "#6ee7b7",
    "#a7f3d0",
    "#a7f3d0",
    "#6ee7b7",
    "#34d399",
    "#10b981",
    "#059669",
    "#047857",
    "#065f46",
    "#064e3b",
    "#022c22",
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
          paddingAngle={0}
          activeShape={renderActiveBudgetShape}
          activeIndex={activeIndex}
        >
          {sortedBudgetArray.map((_, index) => (
            <Cell key={index} fill={COLOURS[index % COLOURS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
