import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/data-table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import data from "@/constants/data.json";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "John Doe",
    totalAmount: "Yes",
    paymentMethod: "American School",
  },
  {
    invoice: "INV002",
    paymentStatus: "Jane Fhen",
    totalAmount: "No",
    paymentMethod: "Oxford University",
  },
  {
    invoice: "INV003",
    paymentStatus: "Kake pen",
    totalAmount: "Yes",
    paymentMethod: "Cambridge University",
  },
  {
    invoice: "INV004",
    paymentStatus: "Rob dave",
    totalAmount: "Yes",
    paymentMethod: "Harvard University",
  },
  {
    invoice: "INV005",
    paymentStatus: "Fraklin",
    totalAmount: "No",
    paymentMethod: "Stanford University",
  },
  {
    invoice: "INV006",
    paymentStatus: "John Smith",
    totalAmount: "Yes",
    paymentMethod: "MIT",
  },
  {
    invoice: "INV007",
    paymentStatus: "Geeky",
    totalAmount: "No",
    paymentMethod: "California Institute of Technology",
  },
];
const Teachers = () => {
  return (
    <div className="mt-2">
      {/* <DataTable data={data} /> */}
      <div className="flex justify-between w-full px-2">
        <h1 className="text-2xl">Teachers</h1>
        <Button className="cursor-pointer">
          <PlusIcon /> Add new Teacher
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Institute</TableHead>
            <TableHead className="text-right">Already Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
};

export default Teachers;
