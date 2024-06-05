import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SplineChart from "./component/spline-chart";
import BarChart from "./component/bar-chart";


const Dashboard = () => {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-6">
        <SplineChart />
        <BarChart/>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              View and manage your recent orders.
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
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              View and manage your top-selling products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>T-Shirt</TableCell>
                  <TableCell>1,234</TableCell>
                  <TableCell>$12,345.67</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Hoodie</TableCell>
                  <TableCell>789</TableCell>
                  <TableCell>$7,890.12</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jeans</TableCell>
                  <TableCell>456</TableCell>
                  <TableCell>$4,567.89</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            View and analyze your business performance.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;