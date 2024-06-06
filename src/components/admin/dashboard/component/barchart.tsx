
import {
  BarChart,
  Bar,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
// Sample data array with metrics
const data = [
  { name: "Page A", uv: 4000},
  { name: "Page B", uv: 3000},
  { name: "Page C", uv: 2000 },
  { name: "Page D", uv: 2780 },
  { name: "Page E", uv: 1890 },
  { name: "Page F", uv: 2390 },
  { name: "Page G", uv: 3490 },
];

const CustomBar = (props:any) => {
  const { x, y, width, height, fill } = props;
  const radius = 10; // Adjust this value to change rounding

  return (
    <rect
      x={x}
      y={y - 5} // Adjust this value to control floating height
      width={width}
      height={height - 5} // Adjust this value to control floating height
      fill={fill}
      rx={radius}
      ry={radius}
    />
  );
};
// Custom Tooltip component
const CustomTooltip = ({ active, payload }:any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip " style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        <p className="intro">{`UV: ${payload[0].value}`}</p>
      
      </div>
    );
  }

  return null;
};

const SimpleBarChart = () => {
  return (
    <Card
      style={{ backgroundColor: "#200119", padding: "20px" }}
      className="h-full w-full max-w-2xl rounded-lg"
    >
      <CardHeader>
        <CardTitle className="text-white">Bar Chart</CardTitle>
        <CardDescription>
          A Bar chart with randomly generated data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          width={400}
          height={200}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip shared={false} trigger="hover" content={<CustomTooltip />} />
          <Bar dataKey="uv" fill="#ffffff" barSize={14} shape={<CustomBar />} />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default SimpleBarChart;
