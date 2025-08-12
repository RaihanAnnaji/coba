"use client";
import { useState } from "react";

export default function DetailFilter({ onFilter, onExportExcel, onExportJson }) {
  const [tahunAwal, setTahunAwal] = useState("2021");
  const [tahunAkhir, setTahunAkhir] = useState("2025");

  return (
    <div className="flex items-center gap-4 flex-wrap mb-4">
      <div>
        <label className="block text-sm">Dari :</label>
        <input
          type="number"
          value={tahunAwal}
          onChange={(e) => setTahunAwal(e.target.value)}
          className="border p-2 rounded w-24"
        />
      </div>
      <div>
        <label className="block text-sm">Sampai :</label>
        <input
          type="number"
          value={tahunAkhir}
          onChange={(e) => setTahunAkhir(e.target.value)}
          className="border p-2 rounded w-24"
        />
      </div>
      <button
        onClick={() => onFilter(tahunAwal, tahunAkhir)}
        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 mt-5"
      >
        Filter
      </button>

      <div className="ml-auto flex gap-2 mt-5">
        <button
          onClick={onExportExcel}
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
        >
          Export Excel
        </button>
        <button
          onClick={onExportJson}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}
