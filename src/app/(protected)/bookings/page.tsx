import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import data from "@/constants/data.json";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
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

import { DatePickerDemo } from "./DatePicker";
import { BookingForm } from "./form";

const bookings = [
  {
    id: 1,
    professorName: "John Doe",
    studentName: "Jane Smith",
    bookingDate: "2023-10-01",
    trainingDate: "2023-20-01",
    status: "Confirmed",
    approval: true,
  },
  {
    id: 2,
    professorName: "Alice Johnson",
    studentName: "Bob Brown",
    bookingDate: "2023-10-02",
    trainingDate: "2023-20-01",
    status: "Confirmed",
    approval: false,
  },
  {
    id: 3,
    professorName: "Charlie White",
    studentName: "Diana Green",
    bookingDate: "2023-10-03",
    trainingDate: "2023-20-01",
    status: "Cancelled",
    approval: false,
  },
  {
    id: 4,
    professorName: "Eve Black",
    studentName: "Frank Blue",
    bookingDate: "2023-10-04",
    trainingDate: "2023-20-01",
    status: "Confirmed",
    approval: true,
  },
  {
    id: 5,
    professorName: "Grace Yellow",
    studentName: "Hank Red",
    bookingDate: "2023-10-05",
    trainingDate: "2023-20-01",
    status: "Confirmed",
    approval: false,
  },
];
const Bookings = () => {
  return (
    <div className="mt-2">
      {/* <DataTable data={data} /> */}
      <div className="flex justify-between w-full px-2">
        <DatePickerDemo />
        <BookingForm />
        {/* <Button className="cursor-pointer">
          <PlusIcon /> Adicionar Nova Marcação
        </Button> */}
      </div>
      <Table className="mt-4">
        <TableCaption>A list of Bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome Professor</TableHead>
            <TableHead>Nome Aluno</TableHead>
            <TableHead>Data Marcação</TableHead>
            <TableHead>Data Treino</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.id}</TableCell>
              <TableCell>{booking.professorName}</TableCell>
              <TableCell>{booking.studentName}</TableCell>
              <TableCell>{booking.bookingDate}</TableCell>
              <TableCell>{booking.trainingDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    booking?.status === "Confirmed"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  <BadgeCheckIcon />
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  disabled={booking?.status === "Confirmed"}
                >
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  disabled={booking?.status === "Cancelled"}
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </Table>
    </div>
  );
};

export default Bookings;
