import React from "react";

import { DataTable } from "@/components/data-table";
import data from "@/constants/data.json";
const Bookings = () => {
  return (
    <div className="mt-2">
      <DataTable data={data} />
    </div>
  );
};

export default Bookings;
