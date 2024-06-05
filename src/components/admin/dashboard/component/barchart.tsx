// import { ResponsiveBar } from "@nivo/bar";

// const data = [
//   { month: "January", value: 200 },
//   { month: "February", value: 350 },
//   { month: "March", value: 150 },
//   { month: "April", value: 450 },
//   { month: "May", value: 300 },
//   { month: "June", value: 400 },
//   { month: "July", value: 250 },
//   { month: "August", value: 100 },
//   { month: "September", value: 50 },
//   { month: "October", value: 350 },
//   { month: "November", value: 250 },
//   { month: "December", value: 200 },
// ];

// const MyBarChart = () => (
//   <ResponsiveBar
//     data={data}
//     keys={["value"]}
//     indexBy="month"
//     margin={{ top: 50, right: 30, bottom: 50, left: 130 }}
//     padding={0.3}
//     layout="vertical"
//     borderRadius={4}
//     axisRight={null}
//     axisBottom={{
//       tickSize: 5,
//       tickPadding: 5,
//       tickRotation: -45,
//     }}
//     axisLeft={{
//       tickSize: 5,
//       tickPadding: 5,
//       tickRotation: 0,
//       legendPosition: "middle",
//       legendOffset: -90,
//     }}
//     enableGridX={false}
//     enableGridY={false}
//     theme={{
//       background: "#200119", // Set background color
//       axis: {
//         domain: {
//           line: {
//             stroke: "#ffffff", // Set axis line color
//             strokeWidth: 1, // Optional: Set axis line width
//           },
//         },
//         ticks: {
//           line: {
//             stroke: "#ffffff", // Set tick line color
//             strokeWidth: 1, // Optional: Set tick line width
//           },
//           text: {
//             fill: "#ffffff", // Set tick text color
//           },
//         },
//       },
//       grid: {
//         line: {
//           stroke: "#dddddd", // Set grid line color
//           strokeWidth: 1, // Optional: Set grid line width
//         },
//       },
//       legends: {
//         text: {
//           fill: "#333333", // Set legend text color
//         },
//       },
//     }}
//   />
// );

// export default MyBarChart;
import { ResponsiveBar } from "@nivo/bar";

const  MyBarChart = () => (
  <ResponsiveBar
    data={[
      {
        month: "Jan",
        a: 310,
        b: 210,
        c: 100,
        d: 280,
        e: 500,
        f: 400,
        g: 480,
        h: 280,
        i: 140,
      },
    ]}
    keys={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
    indexBy="month"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.3}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band" }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor="black"
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    role="application"
    ariaLabel="Nivo bar chart demo"
    barAriaLabel={(e) => `${e.id}: ${e.formattedValue} (${e.indexValue})`}
  />
);

export default MyBarChart;



export const MyResponsiveBar = ({ data }:any) => (
  <ResponsiveBar
    data={data}
    keys={["value"]}
    indexBy={"key"}
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.1}
    colors={{ scheme: "nivo" }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#38bcb2",
        size: 4,
        padding: 1,
        stagger: true,
      },
    ]}
    fill={[
      {
        match: {
          id: "value",
        },
        id: "dots",
      },
    ]}
    borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendOffset: 36,
      
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendOffset: 40,
      
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    animate={true}
  />
);


