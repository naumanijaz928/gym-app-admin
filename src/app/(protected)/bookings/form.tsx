"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { DrawerDialog } from "@/components/ModalDrawer/ModalDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Booking = {
  id?: number;
  professorName: string;
  students: string[]; // Now an array
  bookingDate: string;
  slot?: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  approval: boolean;
};

type BookingFormProps = {
  booking?: Booking;
  onSuccess?: () => void;
};

export function BookingForm(props: BookingFormProps) {
  return (
    <DrawerDialog
      title={props.booking ? "Edit Booking" : "Adicionar Nova Marcação"}
      buttonText={props.booking ? "Edit Booking" : "Adicionar Nova Marcação"}
    >
      <BookingInnerForm {...props} />
    </DrawerDialog>
  );
}

function BookingInnerForm({
  booking,
  onSuccess,
  className,
}: BookingFormProps & { className?: string }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Booking>({
    defaultValues: booking || {
      professorName: "",
      students: [],
      bookingDate: "",
      slot: "",
      status: "Confirmed",
      approval: false,
    },
  });

  const professorName = watch("professorName");
  const bookingDate = watch("bookingDate");
  const [slots, setSlots] = React.useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);

  // Students state
  const [studentsList, setStudentsList] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [loadingStudents, setLoadingStudents] = React.useState(false);

  React.useEffect(() => {
    if (booking) {
      reset(booking);
    } else {
      reset({
        professorName: "",
        students: [],
        bookingDate: "",
        slot: "",
        status: "Confirmed",
        approval: false,
      });
    }
  }, [booking, reset]);

  // Fetch available slots when bookingDate changes
  React.useEffect(() => {
    if (!bookingDate) {
      setSlots([]);
      setValue("slot", "");
      return;
    }
    setLoadingSlots(true);
    fetch(`/api/bookings/slots?date=${bookingDate}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(
          data.slots && data.slots.length > 0
            ? data.slots
            : [
                "09:00 - 10:00",
                "10:00 - 11:00",
                "11:00 - 12:00",
                "14:00 - 15:00",
                "15:00 - 16:00",
              ]
        );
        setValue("slot", "");
      })
      .catch(() => {
        setSlots([
          "09:00 - 10:00",
          "10:00 - 11:00",
          "11:00 - 12:00",
          "14:00 - 15:00",
          "15:00 - 16:00",
        ]);
      })
      .finally(() => setLoadingSlots(false));
  }, [bookingDate, setValue]);

  // Fetch students when professor changes
  React.useEffect(() => {
    if (!professorName) {
      setStudentsList([]);
      setValue("students", []);
      return;
    }
    setLoadingStudents(true);
    fetch(`/api/students?professor=${encodeURIComponent(professorName)}`)
      .then((res) => res.json())
      .then((data) => {
        setStudentsList(data.students || []);
      })
      .catch(() => setStudentsList([]))
      .finally(() => setLoadingStudents(false));
  }, [professorName, setValue]);

  async function onSubmit(data: Booking) {
    try {
      const res = await fetch(
        booking
          ? `/api/bookings/${booking.id}` // Edit
          : "/api/bookings", // Add
        {
          method: booking ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to save booking");
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
        <Label htmlFor="professorName">Professor Name</Label>
        <Input
          id="professorName"
          {...register("professorName", { required: "Professor is required" })}
          placeholder="John Doe"
        />
        {errors.professorName && (
          <span className="text-red-500 text-xs">
            {errors.professorName.message}
          </span>
        )}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="students">Students</Label>
        {loadingStudents ? (
          <span>Loading students...</span>
        ) : (
          <select
            id="students"
            multiple
            className="border rounded px-2 py-1 min-h-[40px]"
            {...register("students", {
              required: "Please select at least one student",
            })}
            size={Math.min(5, studentsList.length)}
          >
            {studentsList.map((student) => (
              <option key={student.id} value={student.name}>
                {student.name}
              </option>
            ))}
          </select>
        )}
        {errors.students && (
          <span className="text-red-500 text-xs">
            {errors.students.message}
          </span>
        )}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="bookingDate">Booking Date</Label>
        <Input
          id="bookingDate"
          type="date"
          {...register("bookingDate", { required: "Booking date is required" })}
        />
        {errors.bookingDate && (
          <span className="text-red-500 text-xs">
            {errors.bookingDate.message}
          </span>
        )}
      </div>
      {bookingDate && (
        <div className="grid gap-3">
          <Label htmlFor="slot">Available Slots</Label>
          {loadingSlots ? (
            <span>Loading slots...</span>
          ) : slots.length > 0 ? (
            <select
              id="slot"
              className="border rounded px-2 py-1"
              {...register("slot", { required: "Please select a slot" })}
              defaultValue=""
            >
              <option value="" disabled>
                Select a slot
              </option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-muted-foreground">
              No slots available for this date.
            </span>
          )}
          {errors.slot && (
            <span className="text-red-500 text-xs">{errors.slot.message}</span>
          )}
        </div>
      )}
      <div className="grid gap-3">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="border rounded px-2 py-1"
          {...register("status", { required: true })}
        >
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input id="approval" type="checkbox" {...register("approval")} />
        <Label htmlFor="approval">Approved</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? booking
            ? "Saving..."
            : "Adding..."
          : booking
            ? "Save changes"
            : "Add Booking"}
      </Button>
    </form>
  );
}
