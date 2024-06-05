import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";

export default function BarChart() {
  return (
    <Card className="h-full w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Simple Bar Chart</CardTitle>
        <CardDescription>
          A simple bar chart with custom styling.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SimpleBarChart className="aspect-[9/4]" />
      </CardContent>
    </Card>
  );
}

function SimpleBarChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { id: "A", value: 100 },
          { id: "B", value: 200 },
          { id: "C", value: 300 },
          { id: "D", value: 400 },
          { id: "E", value: 500 },
        ]}
        // keys={["value"]}
        indexBy="id"
        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        borderColor="#FFFFFF"
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: -40,
          tickValues: [0, 100, 200, 300, 400, 500],
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#FFFFFF"
        legends={[]}
        theme={{
          background: "#200119",
          axis: {
            domain: {
              line: {
                stroke: "#FFFFFF",
                strokeWidth: 5,
              },
            },
            ticks: {
              line: {
                stroke: "#FFFFFF",
                strokeWidth: 1,
              },
              text: {
                fill: "#FFFFFF",
              },
            },
            legend: {
              text: {
                fill: "#FFFFFF",
              },
            },
          },
          // grid: {
          //   line: {
          //     stroke: "#444444",
          //     strokeWidth: 1,
          //   },
          // },
        }}
        role="application"
        ariaLabel="Simple bar chart"
        barAriaLabel={(e) => e.id + ": " + e.formattedValue}
      />
    </div>
  );
}
