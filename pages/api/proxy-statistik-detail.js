export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Parameter 'id' diperlukan" });
  }

  try {
    const resp = await fetch(
      `https://satudata.kulonprogokab.go.id/api/public/data-ku/elemen-detil/${id}`
    );
    const json = await resp.json();

    // Ambil data utama elemen
    const elemenUtama = {
      id: json?.elemen?.id,
      label: json?.elemen?.label,
      satuan: json?.elemen?.satuan,
      instansi: json?.elemen?.instansi?.name || null,
      urusan1: json?.element1?.label || null,
      urusan2: json?.element2?.label || null,
    };

    // Ambil data sub-elemen (status dipastikan number)
    const subElemen = Object.values(json?.datas || {}).map((item) => ({
      nama: item.metadata?.nama_elemen,
      satuan: item.metadata?.satuan,
      data: Object.fromEntries(
        Object.entries(item.data || {}).map(([tahun, val]) => [
          tahun,
          {
            value: val.value,
            status: Number(val.status), // pastikan status number
          },
        ])
      ),
    }));

    res.status(200).json({
      elemen: elemenUtama,
      subElemen,
    });
  } catch (error) {
    console.error("Error ambil detail:", error);
    res.status(500).json({ error: "Gagal mengambil detail dataset" });
  }
}
