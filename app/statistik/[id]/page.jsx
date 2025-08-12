"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import DetailFilter from "../../../components/statistik/detail/DetailFilter";
import DetailTable from "../../../components/statistik/detail/DetailTable";

export default function DetailStatistikPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [tahunRange, setTahunRange] = useState({ start: 2021, end: 2025 });
  const [datasetInfo, setDatasetInfo] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/proxy-statistik-detail?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        // Simpan informasi dataset dari elemen utama
        setDatasetInfo(json.elemen);

        // Format ulang data sub-elemen untuk tabel
        const formatted = json.subElemen.map((el, idx) => ({
          kode: idx + 1,
          grafik: null,
          nama: el.nama,
          satuan: el.satuan,
          data: Object.fromEntries(
            Object.entries(el.data).map(([tahun, val]) => [
              parseInt(tahun),
              { value: val.value, status: val.status } // AMBIL status asli dari API
            ])
          )
        }));
        setData(formatted);
      });
  }, [id]);

  const handleFilter = (start, end) => {
    setTahunRange({ start: parseInt(start), end: parseInt(end) });
  };

  const handleExportExcel = () => {
    const years = [];
    for (let y = tahunRange.start; y <= tahunRange.end; y++) {
      years.push(y);
    }

    const wsData = [
      ["Kode", "Grafik", "Nama Elemen", "Satuan", ...years],
      ...data.map(row => [
        row.kode, row.grafik, row.nama, row.satuan,
        ...years.map(y => row.data[y]?.value ?? "")
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `detail_${id}.xlsx`);
  };

  const handleExportJson = () => {
    router.push(`/api/proxy-statistik-detail?id=${id}`);
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-20 bg-gray-50 flex justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-7xl">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:underline mb-4 flex items-center"
        >
          ← Kembali
        </button>

        {/* Informasi Dataset */}
        {datasetInfo && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{datasetInfo.label}</h1>
            <p className="text-sm text-gray-600">
              Satuan: {datasetInfo.satuan || "-"} | Instansi: {datasetInfo.instansi || "-"}
            </p>
            {(datasetInfo.urusan1 || datasetInfo.urusan2) && (
              <p className="text-sm text-gray-600">
                Urusan: {[datasetInfo.urusan1, datasetInfo.urusan2].filter(Boolean).join(" → ")}
              </p>
            )}
          </div>
        )}

        {/* Filter */}
        <DetailFilter
          onFilter={handleFilter}
          onExportExcel={handleExportExcel}
          onExportJson={handleExportJson}
        />

        {/* Tabel */}
        <DetailTable data={data} tahunRange={tahunRange} />
      </div>
    </div>
  );
}
