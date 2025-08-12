"use client";
import { useState } from "react";

const SortDropdown = () => {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("A-Z");

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md shadow-sm hover:bg-gray-100"
      >
        Urutan {sortBy}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
          {["A-Z", "Z-A"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setSortBy(opt);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
