// pages/api/indikator.js

export default async function handler(req, res) {
  const apiList = [
    "https://satudata.kulonprogokab.go.id/api/public/data-ku/elemen-detil/j2ng6ag1rx", // IPM
    "https://satudata.kulonprogokab.go.id/api/public/data-ku/elemen-detil/wOLMpQJnjr", // Kemiskinan
    "https://satudata.kulonprogokab.go.id/api/public/data-ku/elemen-detil/8J1xp3Q1Wr", // Pengangguran
  ];

  try {
    const hasil = [];

    for (const url of apiList) {
      const resp = await fetch(url);
      const json = await resp.json();

      let nama = json?.elemen?.label || "Tidak diketahui";
      let satuan = "";
      let dataObj = {};

      // Kalau ada banyak elemen di datas, cek apakah ada yang namanya "Pengangguran"
      const datas = json?.datas || {};
      const targetKey = Object.keys(datas).find(
        (k) => datas[k]?.metadata?.nama_elemen?.toLowerCase() === "pengangguran"
      );

      if (targetKey) {
        // Ambil khusus Pengangguran
        nama = datas[targetKey].metadata.nama_elemen;
        satuan = datas[targetKey].metadata.satuan;
        dataObj = datas[targetKey].data;
      } else {
        // Default: ambil elemen pertama
        const firstKey = Object.keys(datas)[0];
        if (firstKey) {
          nama = datas[firstKey].metadata.nama_elemen || nama;
          satuan = datas[firstKey].metadata.satuan || "";
          dataObj = datas[firstKey].data || {};
        }
      }

      // Ambil tahun yang punya value
      const tahunList = Object.keys(dataObj)
        .filter((t) => dataObj[t].value !== null)
        .sort((a, b) => b - a);

      if (tahunList.length >= 2) {
        const tBaru = tahunList[0];
        const tLama = tahunList[1];

        hasil.push({
          id: `${url}-${tBaru}`, // 🔹 Tambah ID unik
          nama,
          satuan,
          tahunA: tLama,
          persenA: dataObj[tLama].value,
          tahunB: tBaru,
          persenB: dataObj[tBaru].value,
        });
      }
    }

    res.status(200).json(hasil);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data indikator" });
  }
}
