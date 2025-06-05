import { BadgeCheckIcon } from "lucide-react";

// import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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

import { TeacherForm } from "./form";
// import data from "@/constants/data.json";

const professors = [
  {
    id: 1,
    professorName: "John Doe",
    city: "New York",
    email: "john@email.com",
    status: "Active",
    approval: true,
  },
  {
    id: 2,
    professorName: "Alice Johnson",
    city: "Los Angeles",
    email: "alice@email.com",
    status: "Inactive",
    approval: false,
  },
  {
    id: 3,
    professorName: "Charlie White",
    city: "Chicago",
    email: "sample@email.com",
    status: "Active",
    approval: false,
  },
  {
    id: 4,
    professorName: "Eve Black",
    city: "Houston",
    email: "sample@email.com",
    status: "Active",
    approval: true,
  },
  {
    id: 5,
    professorName: "Frank Blue",
    city: "Phoenix",
    email: "sample@email.com",
    status: "Inactive",
    approval: false,
  },
  {
    id: 6,
    professorName: "Grace Green",
    city: "Philadelphia",
    email: "sample@email.com",
    status: "Active",
    approval: true,
  },
  {
    id: 7,
    professorName: "Hank Red",
    city: "San Antonio",
    email: "sample@email.com",
    status: "Active",
    approval: false,
  },
];
const Professors = () => {
  // const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      {/* <DataTable data={data} /> */}
      <div className="flex justify-between w-full px-2">
        <h2>Professors</h2>
        <TeacherForm />
      </div>
      <Table className="mt-4">
        <TableCaption>A list of Professors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome Professor</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Endereço Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aprovar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professors.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell className="font-medium">{professor.id}</TableCell>
              <TableCell>{professor.professorName}</TableCell>
              <TableCell>{professor.city}</TableCell>
              <TableCell>{professor.email}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    professor?.status === "Active" ? "secondary" : "destructive"
                  }
                >
                  <BadgeCheckIcon />
                  {professor.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  disabled={professor?.status === "Active"}
                >
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  disabled={professor?.status === "Inactive"}
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
      {/* <DrawerDialog openModal={{ open, setOpen }} /> */}
    </div>
  );
};

export default Professors;
