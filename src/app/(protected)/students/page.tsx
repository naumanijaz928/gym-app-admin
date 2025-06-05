import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

import { StudentForm } from "./form";
// import data from "@/constants/data.json";

const students = [
  {
    id: 1,
    studentName: "John Doe",
    city: "New York",
    email: "john@email.com",
    status: "Active",
    approval: true,
    alreadyVisit: true,
  },
  {
    id: 2,
    studentName: "Alice Johnson",
    city: "Los Angeles",
    email: "alice@email.com",
    status: "Inactive",
    approval: false,
    alreadyVisit: false,
  },
  {
    id: 3,
    studentName: "Charlie White",
    city: "Chicago",
    email: "sample@email.com",
    status: "Active",
    approval: false,
    alreadyVisit: true,
  },
  {
    id: 4,
    studentName: "Eve Black",
    city: "Houston",
    email: "sample@email.com",
    status: "Active",
    approval: true,
    alreadyVisit: false,
  },
  {
    id: 5,
    studentName: "Frank Blue",
    city: "Phoenix",
    email: "sample@email.com",
    status: "Inactive",
    approval: false,
    alreadyVisit: false,
  },
  {
    id: 6,
    studentName: "Grace Green",
    city: "Philadelphia",
    email: "sample@email.com",
    status: "Active",
    approval: true,
    alreadyVisit: false,
  },
  {
    id: 7,
    studentName: "Hank Red",
    city: "San Antonio",
    email: "sample@email.com",
    status: "Active",
    approval: false,
    alreadyVisit: false,
  },
];
const Students = () => {
  return (
    <div className="mt-2">
      {/* <DataTable data={data} /> */}
      <div className="flex justify-between w-full px-2">
        <h2>Professors</h2>
        <StudentForm />
      </div>
      <Table className="mt-4">
        <TableCaption>A list of Aluno</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome Aluno</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Endereço Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Already Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell>{student.studentName}</TableCell>
              <TableCell>{student.city}</TableCell>
              <TableCell>{student.email}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    student?.status === "Active" ? "secondary" : "destructive"
                  }
                >
                  <BadgeCheckIcon />
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {student.alreadyVisit ? "Yes" : "No"}
                </Badge>
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

export default Students;
