"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { PaginatedResponse, Student } from "@/types/api";
import { StudentModal } from "./StudentModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TableLoader } from "@/components/ui/TableLoader";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; data: Student | null }>({
    open: false,
    data: null,
  });
  const [loading, setLoading] = useState(true);

  async function fetchStudents(page: number) {
    setLoading(true);
    try {
      const res: PaginatedResponse<Student> = await apiFetch(
        `/user/users/?role=student&page=${page}`
      );
      setStudents(res.results);
      setCount(res.count);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const openAdd = () => setModal({ open: true, data: null });
  const openEdit = (student: Student) =>
    setModal({ open: true, data: student });

  const totalPages = Math.ceil(count / 10); // assuming 10 per page

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Students</h2>
        <Button onClick={openAdd}>Add Student</Button>
      </div>
      {loading ? (
        <TableLoader />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.email}>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.full_name}</TableCell>
                  <TableCell>{student.role}</TableCell>
                  <TableCell>{student.bio || "-"}</TableCell>
                  <TableCell>{student.contact_number || "-"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(student)}
                    >
                      <PencilIcon className="w-4 h-4" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
      <StudentModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal({ open, data: open ? modal.data : null })
        }
        onSuccess={() => fetchStudents(page)}
        initialData={modal.data}
      />
    </div>
  );
}
