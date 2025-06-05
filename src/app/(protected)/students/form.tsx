"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { DrawerDialog } from "@/components/ModalDrawer/ModalDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Student = {
  id?: number;
  studentName: string;
  city: string;
  email: string;
  status: "Active" | "Inactive";
  approval: boolean;
  alreadyVisit: boolean;
};

type StudentFormProps = {
  student?: Student; // Pass this prop for edit, leave undefined for add
  onSuccess?: () => void; // Optional callback after successful submit
};

export function StudentForm(props: StudentFormProps) {
  return (
    <DrawerDialog
      title={props.student ? "Edit Aluno" : "Adicionar Novo Aluno"}
      buttonText={props.student ? "Edit Student" : "Adicionar Novo Aluno"}
    >
      <StudentInnerForm {...props} />
    </DrawerDialog>
  );
}

function StudentInnerForm({
  student,
  onSuccess,
  className,
}: StudentFormProps & { className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Student>({
    defaultValues: student || {
      studentName: "",
      city: "",
      email: "",
      status: "Active",
      approval: false,
      alreadyVisit: false,
    },
  });

  React.useEffect(() => {
    if (student) {
      reset(student);
    } else {
      reset({
        studentName: "",
        city: "",
        email: "",
        status: "Active",
        approval: false,
        alreadyVisit: false,
      });
    }
  }, [student, reset]);

  async function onSubmit(data: Student) {
    try {
      const res = await fetch(
        student
          ? `/api/students/${student.id}` // Edit
          : "/api/students", // Add
        {
          method: student ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to save student");
      onSuccess?.();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  return (
    <form
      className={cn("grid items-start gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-3">
        <Label htmlFor="studentName">Student Name</Label>
        <Input
          id="studentName"
          {...register("studentName", { required: "Name is required" })}
          placeholder="Grace Green"
        />
        {errors.studentName && (
          <span className="text-red-500 text-xs">
            {errors.studentName.message}
          </span>
        )}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          {...register("city", { required: "City is required" })}
          placeholder="Philadelphia"
        />
        {errors.city && (
          <span className="text-red-500 text-xs">{errors.city.message}</span>
        )}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="sample@email.com"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="border rounded px-2 py-1"
          {...register("status", { required: true })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input id="approval" type="checkbox" {...register("approval")} />
        <Label htmlFor="approval">Approved</Label>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="alreadyVisit"
          type="checkbox"
          {...register("alreadyVisit")}
        />
        <Label htmlFor="alreadyVisit">Already Visited</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? student
            ? "Saving..."
            : "Adding..."
          : student
            ? "Save changes"
            : "Add Aluno"}
      </Button>
    </form>
  );
}
