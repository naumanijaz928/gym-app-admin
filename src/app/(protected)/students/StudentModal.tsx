"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ControlledDrawerDialog } from "@/components/ModalDrawer/ModalDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { Student } from "@/types/api";

interface StudentModalProps {
  open: boolean;
  // eslint-disable-next-line
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Student | null;
}

export function StudentModal({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: StudentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Student>({
    defaultValues: initialData || {
      email: "",
      full_name: "",
      role: "student",
      bio: "",
      contact_number: "",
      photo: null,
    },
  });
  const [error, setError] = useState<string | null>(null);

  // Reset form when opening for add/edit
  useEffect(() => {
    reset(
      initialData || {
        email: "",
        full_name: "",
        role: "student",
        bio: "",
        contact_number: "",
        photo: null,
      }
    );
    setError(null);
  }, [initialData, open, reset]);

  async function onSubmit(data: Student) {
    setError(null);
    try {
      if (initialData) {
        await apiFetch(`/user/users/${initialData.email}/`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        await apiFetch("/user/users/", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      onSuccess();
      onOpenChange(false);
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <ControlledDrawerDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Student" : "Add Student"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            {...register("email", { required: true })}
            disabled={!!initialData}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">Email is required</span>
          )}
        </div>
        <div>
          <Label>Full Name</Label>
          <Input {...register("full_name", { required: true })} />
          {errors.full_name && (
            <span className="text-red-500 text-xs">Full name is required</span>
          )}
        </div>
        <div>
          <Label>Bio</Label>
          <Input {...register("bio")} />
        </div>
        <div>
          <Label>Contact Number</Label>
          <Input {...register("contact_number")} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {initialData ? "Save" : "Add"}
        </Button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </ControlledDrawerDialog>
  );
}
