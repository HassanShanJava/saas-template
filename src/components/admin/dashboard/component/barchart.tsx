import { BarChart, Bar, YAxis, Tooltip, XAxis } from "recharts";
import { Progress } from "@/components/ui/progress";
import walletimg from "@/assets/wallet.svg";
import Rocketimg from "@/assets/rocket.svg";
import Starimg from "@/assets/star.svg";
import { Card, CardContent } from "@/components/ui/card";
// Sample data array with metrics
const data = [
  { name: "Page A", uv: 400 },
  { name: "Page B", uv: 300 },
  { name: "Page C", uv: 200 },
  { name: "Page D", uv: 278 },
  { name: "Page E", uv: 189 },
  { name: "Page F", uv: 239 },
  { name: "Page G", uv: 349 },
];

const CustomBar = (props: any) => {
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
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip "
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <p className="intro">{`UV: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const SimpleBarChart = () => {
  return (
    <Card className="p-2">
      <Card
        style={{ backgroundColor: "#200119", padding: "10px" }}
        className="h-[20vh] max-w-xl max-h-[200px] slg:h-[40vh] slg:max-h-[300px] w-full slg:max-w-2xl rounded-xl"
      >
        <CardContent className="p-0 justify-center flex items-center h-fit ">
          <BarChart
            width={460}
            height={200}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <YAxis
              className="font-bold"
              axisLine={false}
              min={0}
              tickLine={false}
              domain={[0, (dataMax: any) => dataMax + 50]}
              ticks={[0, 100, 200, 300, 400, 500]}
              tick={{ fill: "#FFFFFF" }}
            />
            {/* <XAxis axisLine={false} tickLine={false}/> */}
            <XAxis axisLine={false} tickLine={false} tick={false} />

            <Tooltip
              shared={false}
              trigger="hover"
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="uv"
              fill="#ffffff"
              barSize={10}
              shape={<CustomBar />}
            />
          </BarChart>
        </CardContent>
      </Card>
      <h2 className="pt-2 font-semibold text-base"> Active Users</h2>
      <p className="text-sm text-gray-400 ">
        <span className="text-green-400 text-sm font-semibold m-2">(+25)</span>
        more than last week
      </p>
      <div className="flex flex-col slg:flex-row justify-between slg:items-center w-full">
        <div className="w-24 p-2">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-center items-center w-8 h-8 rounded-lg bg-primary">
              <img src={walletimg} className={`w-4 h-4 items-center `}></img>
            </div>
            <h2 className="font-bold text-sm text-gray-400"> Users</h2>
          </div>
          <div>
            <p className="text-[#2D3748] text-xl font-bold">32,000</p>
          </div>
          <div className="pt-4">
            <Progress
              className="h-1 w-full"
              value={67}
              color={"#3ED13E"}
              max={100}
            />
          </div>
        </div>
        <div className="w-24 p-2">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-center items-center w-8 h-8 rounded-lg bg-primary">
              <img src={Rocketimg} className={`w-4 h-4 items-center `}></img>
            </div>
            <h2 className="font-bold text-sm text-gray-400"> Leads</h2>
          </div>
          <div>
            <p className="text-[#2D3748] text-xl font-bold">2,42k</p>
          </div>
          <div className="pt-4">
            <Progress
              className="h-1 w-full"
              value={67}
              color={"#3ED13E"}
              max={100}
            />
          </div>
        </div>
        <div className="w-24 p-2">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-center items-center w-8 h-8 rounded-lg bg-primary">
              {/* <img src="/wallet.svg" className={`w-4 h-4 items-center `}></img> */}
              <i className="fa-solid fa-cart-shopping w-4 h-4 flex justify-center items-center"></i>
            </div>
            <h2 className="font-bold text-sm text-gray-400"> Sales</h2>
          </div>
          <div>
            <p className="text-[#2D3748] text-xl font-bold">$25,000</p>
          </div>
          <div className="pt-4">
            <Progress
              className="h-1 w-full"
              value={67}
              color={"#3ED13E"}
              max={100}
            />
          </div>
        </div>
        <div className="w-24 p-2">
          <div className=" flex justify-between items-center">
            <div className=" flex justify-center items-center w-7 h-7 rounded-lg bg-primary">
              <img src={Starimg} className={`w-4 h-4 items-center `}></img>
            </div>
            <h2 className="font-bold text-sm text-gray-400"> Sales</h2>
          </div>
          <div>
            <p className="text-[#2D3748] text-xl font-bold">320</p>
          </div>
          <div className="pt-4">
            <Progress
              className="h-1 w-full"
              value={67}
              color={"#3ED13E"}
              max={100}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SimpleBarChart;
