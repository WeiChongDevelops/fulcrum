import { PieChart, Pie, ResponsiveContainer, Sector, Cell } from "recharts";
import { useState } from "react";
import { BudgetItemEntity } from "@/utility/types.ts";

const renderActiveShape = (props: any) => {
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
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

interface BudgetPieChartProps {
  budgetArray: BudgetItemEntity[];
}

export default function BudgetPieChart({ budgetArray }: BudgetPieChartProps) {
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

  const budgetSizeSort = (budgetItemA: BudgetItemEntity, budgetItemB: BudgetItemEntity) => {
    return budgetItemA.amount > budgetItemB.amount ? -1 : 1;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={730} height={250}>
        {/*<Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="red" />*/}
        <Pie
          animationBegin={125}
          animationDuration={600}
          animationEasing={"ease-out"}
          onMouseEnter={handlePieEnter}
          data={budgetArray.sort(budgetSizeSort)}
          dataKey="amount"
          nameKey="category"
          // cx={100}
          // cy={100}
          innerRadius={"35%"}
          outerRadius={"55%"}
          paddingAngle={0}
          activeShape={renderActiveShape}
          activeIndex={activeIndex}
        >
          {budgetArray.map((_, index) => (
            <Cell key={index} fill={COLOURS[index % COLOURS.length]} />
          ))}
        </Pie>
        {/*<Legend*/}
        {/*  height={24}*/}
        {/*  iconType="circle"*/}
        {/*  layout="vertical"*/}
        {/*  verticalAlign="top"*/}
        {/*  iconSize={6}*/}
        {/*  // padding={5}*/}
        {/*  // formatter={renderColorfulLegendText}*/}
        {/*/>*/}
      </PieChart>
      {/*<BarChart*/}
      {/*  width={500}*/}
      {/*  height={300}*/}
      {/*  data={salesData}*/}
      {/*  margin={{*/}
      {/*    right: 30,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <CartesianGrid strokeDasharray="3 3" />*/}
      {/*  <XAxis dataKey="name" />*/}
      {/*  <YAxis />*/}
      {/*  /!*<Tooltip content={<CustomTooltip />} />*!/*/}
      {/*  <Legend />*/}
      {/*  <Bar dataKey="revenue" fill="#2563eb" />*/}
      {/*  <Bar dataKey="profit" fill="#8b5cf6" />*/}
      {/*</BarChart>*/}
    </ResponsiveContainer>
  );
}
