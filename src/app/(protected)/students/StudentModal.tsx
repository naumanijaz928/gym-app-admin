"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { ControlledDrawerDialog } from "@/components/ModalDrawer/ModalDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { PaginatedResponse, Professor, Student } from "@/types/api";

interface StudentModalProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Student | null;
}

const studentSchema = z.object({
  professor: z
    .number({ required_error: "Professor is required" })
    .refine((val) => val !== 0, { message: "Professor is required" }),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email({ message: "Invalid email address" }),
  contact_number: z.string().min(1, "Contact number is required"),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export function StudentModal({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: StudentModalProps) {
  const isEdit = !!initialData;
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: isEdit
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          professor: (initialData as any)?.professor || 0,
          full_name: initialData?.full_name || "",
          email: initialData?.email || "",
          contact_number: initialData?.contact_number || "",
        }
      : {
          professor: 0,
          full_name: "",
          email: "",
          contact_number: "",
        },
  });

  useEffect(() => {
    setLoadingProfessors(true);
    apiFetch<PaginatedResponse<Professor>>("/user/users/?role=professor")
      .then((res) => setProfessors(res.results || []))
      .catch(() => setProfessors([]))
      .finally(() => setLoadingProfessors(false));
  }, []);

  useEffect(() => {
    reset(
      isEdit
        ? {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            professor: (initialData as any)?.professor || 0,
            full_name: initialData?.full_name || "",
            email: initialData?.email || "",
            contact_number: initialData?.contact_number || "",
          }
        : {
            professor: 0,
            full_name: "",
            email: "",
            contact_number: "",
          }
    );
    setError(null);
  }, [initialData, open, reset, isEdit]);

  async function onSubmit(data: StudentFormValues) {
    setError(null);
    try {
      const payload = {
        professor: data.professor,
        full_name: data.full_name,
        email: data.email,
        contact_number: data.contact_number,
      };
      if (isEdit) {
        await apiFetch(`/user/students/${initialData?.id}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/user/students/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  return (
    <ControlledDrawerDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Student" : "Add Student"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Professor</Label>
          <Controller
            control={control}
            name="professor"
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
                className="w-full border rounded px-3 py-2"
                disabled={loadingProfessors || isSubmitting}
              >
                <option value={0}>Select Professor</option>
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.full_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.professor && (
            <span className="text-red-500 text-xs">
              {errors.professor.message as string}
            </span>
          )}
        </div>
        <div>
          <Label>Full Name</Label>
          <Input {...register("full_name")} />
          {errors.full_name && (
            <span className="text-red-500 text-xs">
              {errors.full_name.message}
            </span>
          )}
        </div>
        <div>
          <Label>Email</Label>
          <Input {...register("email")} disabled={isEdit} />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>
        <div>
          <Label>Contact Number</Label>
          <Input {...register("contact_number")} />
          {errors.contact_number && (
            <span className="text-red-500 text-xs">
              {errors.contact_number.message}
            </span>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? "Edit Student" : "Add Student"}
        </Button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </ControlledDrawerDialog>
  );
}
