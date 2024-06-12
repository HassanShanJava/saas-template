import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import SplineChart from "./component/spline-chart";
import DashboardHeader from "./component/dashboard-header";
import SplineChart from "./component/spline-chart";
import SimpleBarChart from "./component/barchart";
import CardComponent from "./component/card-component";


const Dashboard = () => {
  return (
    <div className="grid gap-6  p-3">
      {/* <DashboardHeader /> */}
      <CardComponent />
      <div className="grid grid-cols-2 gap-6 p-4">
        <SimpleBarChart />
        <SplineChart />
      </div>
      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Clients</CardTitle>
            <CardDescription className="pt-1 text-gray-400 ">
                <i className="fa-solid text-green-400 fa-circle-check"></i>
              <span className="ml-2 text-gray-400 font-bold text-base">
                Active Client
              </span>{" "}
              This month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>#3210</TableCell>
                  <TableCell>Olivia Martin</TableCell>
                  <TableCell>February 20, 2022</TableCell>
                  <TableCell>$42.25</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#3209</TableCell>
                  <TableCell>Ava Johnson</TableCell>
                  <TableCell>January 5, 2022</TableCell>
                  <TableCell>$74.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#3204</TableCell>
                  <TableCell>Michael Johnson</TableCell>
                  <TableCell>August 3, 2021</TableCell>
                  <TableCell>$64.75</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;