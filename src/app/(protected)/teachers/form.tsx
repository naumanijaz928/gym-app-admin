"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { DrawerDialog } from "@/components/ModalDrawer/ModalDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
type ProfessorFormProps = {
  professor?: Professor; // Pass this prop for edit, leave undefined for add
  onSuccess?: () => void; // Optional callback after successful submit
};
type Professor = {
  id?: number;
  professorName: string;
  city: string;
  email: string;
  status: "Active" | "Inactive";
  approval: boolean;
};
export function TeacherForm(props: ProfessorFormProps) {
  return (
    <DrawerDialog
      title="Adicionar Novo Professor"
      buttonText="Adicionar Novo Professor"
    >
      <ProfessorForm {...props} />
    </DrawerDialog>
  );
}

function ProfessorForm({
  professor,
  onSuccess,
  className,
}: ProfessorFormProps & { className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Professor>({
    defaultValues: professor || {
      professorName: "",
      city: "",
      email: "",
      status: "Active",
      approval: false,
    },
  });

  // Reset form when editing a different professor
  React.useEffect(() => {
    if (professor) {
      reset(professor);
    } else {
      reset({
        professorName: "",
        city: "",
        email: "",
        status: "Active",
        approval: false,
      });
    }
  }, [professor, reset]);

  async function onSubmit(data: Professor) {
    try {
      const res = await fetch(
        professor
          ? `/api/professors/${professor.id}` // Edit
          : "/api/professors", // Add
        {
          method: professor ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to save professor");
      onSuccess?.();
      // Optionally close dialog here if you control it from parent
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
        <Label htmlFor="professorName">Professor Name</Label>
        <Input
          id="professorName"
          {...register("professorName", { required: "Name is required" })}
          placeholder="John Doe"
        />
        {errors.professorName && (
          <span className="text-red-500 text-xs">
            {errors.professorName.message}
          </span>
        )}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          {...register("city", { required: "City is required" })}
          placeholder="New York"
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
          placeholder="john@email.com"
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? professor
            ? "Saving..."
            : "Adding..."
          : professor
            ? "Save changes"
            : "Add Professor"}
      </Button>
    </form>
  );
}
