"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { ControlledDrawerDialog } from "@/components/ModalDrawer/ModalDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableLoader } from "@/components/ui/TableLoader";
import { apiFetch } from "@/lib/api";
import {
  Booking,
  PaginatedResponse,
  Professor,
  Slot,
  Student,
} from "@/types/api";

const bookingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  professor: z.number({ required_error: "Professor is required" }),
  students: z.array(z.number()).min(1, "Select at least one student"),
  booking_date: z.string().min(1, "Booking date is required"),
  time_slot: z.string().min(1, "Time slot is required"),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  // approve: z.boolean().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  open: boolean;
  // eslint-disable-next-line
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Booking | null;
}

export function BookingModal({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: BookingModalProps) {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingProfessors, setLoadingProfessors] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultValues: BookingFormValues = initialData
    ? {
        title: initialData.title || "",
        professor: initialData.professor_details?.id || 0,
        students: Array.isArray(initialData.students)
          ? typeof initialData.students[0] === "object"
            ? (initialData.students as Student[]).map((s) => s.id)
            : (initialData.students as number[])
          : [],
        booking_date: initialData.booking_date || "",
        time_slot: initialData.time_slot || "",
        notes: initialData.notes || "",
        status: initialData.status || "pending",
        // approve: initialData.approve ?? false,
      }
    : {
        title: "",
        professor: 0,
        students: [],
        booking_date: "",
        time_slot: "",
        notes: "",
        status: "pending",
        // approve: false,
      };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  // Watch booking_date for slot fetching
  const bookingDate = watch("booking_date");

  // Fetch professors
  useEffect(() => {
    setLoadingProfessors(true);
    apiFetch<PaginatedResponse<Professor>>("/user/users/?role=professor")
      .then((res) => setProfessors(res.results || []))
      .catch(() => setProfessors([]))
      .finally(() => setLoadingProfessors(false));
  }, []);

  // Fetch students
  useEffect(() => {
    setLoadingStudents(true);
    apiFetch<PaginatedResponse<Student>>("/user/users/?role=student")
      .then((res) => setStudents(res.results || []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }, []);

  // Fetch slots when booking_date changes
  useEffect(() => {
    if (!bookingDate) return setSlots([]);
    setLoadingSlots(true);
    apiFetch<Slot[]>(`/booking/bookings/available_slots/?date=${bookingDate}`)
      .then((res) => setSlots(res))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [bookingDate]);

  // Reset form when opening for add/edit
  useEffect(() => {
    reset(defaultValues);
    setError(null);
    setSuccess(false);
  }, [initialData, open]);

  // Handle multi-select change
  // eslint-disable-next-line
  const handleStudentsChange = (selectedOptions: HTMLSelectElement) => {
    const selectedValues = Array.from(selectedOptions.selectedOptions).map(
      (option) => parseInt(option.value)
    );
    setValue("students", selectedValues);
  };

  async function onSubmit(data: BookingFormValues) {
    setError(null);
    setFormLoading(true);
    try {
      const payload = {
        ...data,
        professor: data.professor,
        students: data.students,
      };
      if (initialData) {
        await apiFetch(`/booking/bookings/${initialData.id}/`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/booking/bookings/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setSuccess(true);
      onSuccess();
      onOpenChange(false);
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.message || "Failed to save booking");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <ControlledDrawerDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Booking" : "Add Booking"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input {...register("title")} disabled={formLoading} />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>
        <div>
          <Label>Professor</Label>
          {loadingProfessors ? (
            <TableLoader />
          ) : (
            <Controller
              control={control}
              name="professor"
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                  disabled={formLoading}
                >
                  <option value="">Select Professor</option>
                  {professors.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.full_name}
                    </option>
                  ))}
                </select>
              )}
            />
          )}
          {errors.professor && (
            <span className="text-red-500 text-xs">
              {errors.professor.message as string}
            </span>
          )}
        </div>
        <div>
          <Label>Students</Label>
          {loadingStudents ? (
            <TableLoader />
          ) : (
            <Controller
              control={control}
              name="students"
              render={({ field }) => (
                <select
                  multiple
                  value={field.value.map(String)}
                  onChange={(e) => {
                    const selectedValues = Array.from(
                      e.target.selectedOptions
                    ).map((option) => parseInt(option.value));
                    field.onChange(selectedValues);
                  }}
                  className="w-full border rounded px-3 py-2 min-h-[100px]"
                  disabled={formLoading}
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name}
                    </option>
                  ))}
                </select>
              )}
            />
          )}
          {errors.students && (
            <span className="text-red-500 text-xs">
              {errors.students.message as string}
            </span>
          )}
        </div>
        <div>
          <Label>Booking Date</Label>
          <Input
            type="date"
            {...register("booking_date")}
            disabled={formLoading}
          />
          {errors.booking_date && (
            <span className="text-red-500 text-xs">
              {errors.booking_date.message}
            </span>
          )}
        </div>
        <div>
          <Label>Time Slot</Label>
          {loadingSlots ? (
            <TableLoader />
          ) : (
            <Controller
              control={control}
              name="time_slot"
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border rounded px-3 py-2"
                  disabled={formLoading || !bookingDate}
                >
                  <option value="">Select Time Slot</option>
                  {slots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.display}
                    </option>
                  ))}
                </select>
              )}
            />
          )}
          {errors.time_slot && (
            <span className="text-red-500 text-xs">
              {errors.time_slot.message}
            </span>
          )}
        </div>
        <div>
          <Label>Notes</Label>
          <textarea
            {...register("notes")}
            className="w-full border rounded px-3 py-2"
            disabled={formLoading}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <select
                {...field}
                className="w-full border rounded px-3 py-2"
                disabled={formLoading}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                {/* <option value="cancelled">Cancelled</option> */}
              </select>
            )}
          />
          {errors.status && (
            <span className="text-red-500 text-xs">
              {errors.status.message}
            </span>
          )}
        </div>
        {/* <div className="flex items-center gap-2">
          <input type="checkbox" {...register("approve")} disabled={formLoading} id="approve" />
          <Label htmlFor="approve">Approved</Label>
        </div> */}
        <Button
          type="submit"
          disabled={isSubmitting || formLoading}
          className="w-full"
        >
          {formLoading ? "Saving..." : initialData ? "Save" : "Add"}
        </Button>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && (
          <div className="text-green-600 text-center">
            Booking saved successfully!
          </div>
        )}
      </form>
    </ControlledDrawerDialog>
  );
}
