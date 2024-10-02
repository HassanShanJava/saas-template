import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";

export default function SplineChart() {
  return (
    <Card className="h-full w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-bold text-black text-xl">Sales Overview</CardTitle>
        <CardDescription className="text-green-400 text-xl pt-0">
          (+5) more in 2021
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 py-0">
        <FilledtimeseriesChart className=" h-[50vh] max-h-[300px] p-0" />
      </CardContent>
    </Card>
  );
}

function FilledtimeseriesChart(props:any) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
              { x: "Jul", y: 189 },
              { x: "Aug", y: 245 },
              { x: "Sep", y: 189 },
              { x: "Oct", y: 370 },
              { x: "Nov", y: 470 },
              { x: "Dec", y: 289 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 130 },
              { x: "Feb", y: 248 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 378 },
              { x: "May", y: 496 },
              { x: "Jun", y: 204 },
              { x: "Jul", y: 243 },
              { x: "Aug", y: 453 },
              { x: "Sep", y: 153 },
              { x: "Oct", y: 370 },
              { x: "Nov", y: 504 },
              { x: "Dec", y: 354 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0, max: "auto" }}
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 16 }}
        axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
        pointSize={6}
        useMesh={true}
        curve="monotoneX"
        enableArea={true}
        enableGridX={false}
        gridYValues={6}
        defs={[
          {
            id: "gradientA",
            type: "linearGradient",
            colors: [
              { offset: 30, color: "rgba(208, 253, 62, 1)" },
              { offset: 100, color: "rgba(226, 248, 226, 0)" },
            ],
          },
          {
            id: "gradientB",
            type: "linearGradient",
            colors: [
              { offset: 30, color: "rgba(53, 9, 43, 1)" },
              { offset: 100, color: "rgba(53, 9, 43, 0)" },
            ],
          },
        ]}
        fill={[
          { match: { id: "Desktop" }, id: "gradientA" },
          { match: { id: "Mobile" }, id: "gradientB" },
        ]}
        colors={["#3ED13E", "#35092B5C"]}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              strokeDasharray: "3 3",
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}
