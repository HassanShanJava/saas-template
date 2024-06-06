import { Card ,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
import SimpleBarChart from "./barchart";
import { TableCell, TableRow ,Table,TableHead,TableBody,TableHeader} from "@/components/ui/table";

const  BarchartCard = () => {
  return (
    <>
      <SimpleBarChart />
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>View and manage your recent orders.</CardDescription>
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
    </>
  );
}
export default BarchartCard;