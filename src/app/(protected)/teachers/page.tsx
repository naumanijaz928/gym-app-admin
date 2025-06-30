"use client";
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableLoader } from "@/components/ui/TableLoader";
import { apiFetch } from "@/lib/api";
import { PaginatedResponse, Professor } from "@/types/api";

import { TeacherModal } from "./TeacherModal";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Professor[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; data: Professor | null }>(
    {
      open: false,
      data: null,
    }
  );
  const [loading, setLoading] = useState(true);

  async function fetchTeachers(page: number) {
    setLoading(true);
    try {
      const res: PaginatedResponse<Professor> = await apiFetch(
        `/user/users/?role=professor&page=${page}`
      );
      setTeachers(res.results);
      setCount(res.count);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const openAdd = () => setModal({ open: true, data: null });
  const openEdit = (teacher: Professor) =>
    setModal({ open: true, data: teacher });

  const totalPages = Math.ceil(count / 10); // assuming 10 per page

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Teachers</h2>
        <Button onClick={openAdd}>Add Teacher</Button>
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
              {teachers.map((teacher) => (
                <TableRow key={teacher.email}>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.full_name}</TableCell>
                  <TableCell>{teacher.role}</TableCell>
                  <TableCell>{teacher.bio || "-"}</TableCell>
                  <TableCell>{teacher.contact_number || "-"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(teacher)}
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
      <TeacherModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal({ open, data: open ? modal.data : null })
        }
        onSuccess={() => fetchTeachers(page)}
        initialData={modal.data}
      />
    </div>
  );
}
