"use client"

import { useState } from "react";

export default function FilterSidebar({
  opdList = [],
  urusanList = [],
  opdSelected,
  setOpdSelected,
  urusanSelected,
  setUrusanSelected,
}) {
  const [opdSearch, setOpdSearch] = useState("");
  const [urusanSearch, setUrusanSearch] = useState("");

  const toggleFilter = (value, selected, setSelected) => {
    if (!value || value.trim() === "") return; // cegah nilai kosong
    if (selected.includes(value)) {
      setSelected([]); // uncheck kalau klik lagi
    } else {
      setSelected([value]); // hanya simpan satu pilihan
    }
  };

  return (
    <aside className="w-full md:w-72 bg-white p-4 rounded-xl shadow-md h-[720px] flex flex-col">
      {/* Filter OPD */}
      <div className="mb-4 flex-1 min-h-0">
        <h2 className="font-bold mb-2 text-sm">Filter OPD</h2>
        <input
          type="text"
          placeholder="Cari OPD..."
          value={opdSearch}
          onChange={(e) => setOpdSearch(e.target.value)}
          className="w-full mb-2 p-1 text-xs border border-gray-300 rounded"
        />
        <div className="overflow-y-auto h-64 pr-1">
          {opdList.length > 0 ? (
            opdList
              .filter((opd) => opd.value)
              .filter((opd) =>
                opd.label.toLowerCase().includes(opdSearch.toLowerCase())
              )
              .map((opd) => (
                <label key={opd.value} className="flex items-center mb-1 text-xs">
                  <input
                    type="checkbox"
                    checked={opdSelected.includes(opd.value)}
                    onChange={() =>
                      toggleFilter(opd.value, opdSelected, setOpdSelected)
                    }
                    className="mr-2"
                  />
                  {opd.label}
                </label>
              ))
          ) : (
            <p className="text-gray-500 text-xs">Memuat OPD...</p>
          )}
        </div>
      </div>

      <hr className="my-2" />

      {/* Filter Urusan */}
      <div className="flex-1 min-h-0">
        <h2 className="font-bold mb-2 text-sm">Filter Kategori Urusan</h2>
        <input
          type="text"
          placeholder="Cari Urusan..."
          value={urusanSearch}
          onChange={(e) => setUrusanSearch(e.target.value)}
          className="w-full mb-2 p-1 text-xs border border-gray-300 rounded"
        />
        <div className="overflow-y-auto h-64 pr-1">
          {urusanList.length > 0 ? (
            urusanList
              .filter((urusan) => urusan.value)
              .filter((urusan) =>
                urusan.label.toLowerCase().includes(urusanSearch.toLowerCase())
              )
              .map((urusan) => (
                <label key={urusan.value} className="flex items-center mb-1 text-xs">
                  <input
                    type="checkbox"
                    checked={urusanSelected.includes(urusan.value)}
                    onChange={() =>
                      toggleFilter(urusan.value, urusanSelected, setUrusanSelected)
                    }
                    className="mr-2"
                  />
                  {urusan.label}
                </label>
              ))
          ) : (
            <p className="text-gray-500 text-xs">Memuat urusan...</p>
          )}
        </div>
      </div>
    </aside>
  );
}
