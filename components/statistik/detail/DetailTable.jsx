export default function DetailTable({ data, tahunRange }) {
  const years = [];
  for (let y = tahunRange.start; y <= tahunRange.end; y++) {
    years.push(y);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Kode</th>
            <th className="border p-2">Grafik</th>
            <th className="border p-2">Nama Elemen</th>
            <th className="border p-2">Satuan</th>
            {years.map((y) => (
              <th key={y} className="border p-2">{y}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{row.kode || "-"}</td>
              <td className="border p-2">{row.grafik || "-"}</td>
              <td className="border p-2">{row.nama}</td>
              <td className="border p-2">{row.satuan}</td>
              {years.map((y) => {
                const cell = row.data[y] || {};
                return (
                  <td
                    key={y}
                    className={`border p-2 ${
                      cell.status === 1 ? "text-black" :
                      cell.status === 2 ? "text-yellow-500" :
                      cell.status === 3 ? "text-red-500" :
                      "text-gray-400"
                    }`}
                  >
                    {cell.value ?? "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Keterangan */}
      <div className="mt-4 text-sm">
        <p><span className="text-black font-bold">Hitam</span> : Data tetap</p>
        <p><span className="text-yellow-500 font-bold">Kuning</span> : Data sementara</p>
        <p><span className="text-red-500 font-bold">Merah</span> : Data sangat sementara</p>
        <p><span className="text-gray-400 font-bold">Abu-abu</span> : Data tidak relevan</p>
      </div>
    </div>
  );
}
