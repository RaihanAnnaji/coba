export default async function handler(req, res) {
  const uiPage = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;

  const search = req.query.search?.trim().toLowerCase() || "";
  const selectedOPD = req.query.opd ? req.query.opd.split(",") : [];
  const selectedUrusan = req.query.urusan ? req.query.urusan.split(",") : [];

  try {
    let allResults = [];

    // Ambil filter metadata dari page 1
    const firstResp = await fetch("https://satudata.kulonprogokab.go.id/api/public/data-ku?page=1");
    const firstJson = await firstResp.json();
    const opdMap = firstJson.pInstansi || {};
    const urusanMap = firstJson.pUrusan || {};
    const totalPages = firstJson?.datas?.last_page || 1;

    // 🔹 Data untuk Sekilas (total keseluruhan)
    const totalDataset = firstJson?.datas?.total || 0;
    const totalProdusen = Object.keys(opdMap).length;
    const totalTopik = Object.keys(urusanMap).length;

    // 🔹 Jika hanya filter OPD/Urusan tanpa search → panggil API langsung
    if (!search && (selectedOPD.length > 0 || selectedUrusan.length > 0)) {
      const queryParams = new URLSearchParams();
      queryParams.set("page", uiPage);
      if (selectedOPD.length > 0) queryParams.set("opd", selectedOPD.join(","));
      if (selectedUrusan.length > 0) queryParams.set("urusan", selectedUrusan.join(","));

      const apiUrl = `https://satudata.kulonprogokab.go.id/api/public/data-ku?${queryParams.toString()}`;
      const resp = await fetch(apiUrl);
      const json = await resp.json();

      const pageData = json?.datas?.data || [];
      const totalItems = json?.datas?.total || 0;

      return res.status(200).json({
        data: pageData.map(item => ({
          id: item.id,
          nama_elemen: item.nama_elemen,
          satuan: item.satuan,
          nama_instansi: item.nama_instansi,
          hash: item.id,
        })),
        total: totalItems,
        filters: {
          opd: Object.entries(opdMap).map(([value, label]) => ({
            value,
            label,
            count: json?.pInstansiCount?.[value] || 0 // kalau API punya count langsung
          })),
          urusan: Object.entries(urusanMap).map(([value, label]) => ({
            value,
            label,
            count: json?.pUrusanCount?.[value] || 0
          }))
        },
        sekilas: {
          totalDataset,
          totalProdusen,
          totalTopik
        }
      });
    }

    // 🔹 Jika ada search (dengan atau tanpa filter) → loop semua halaman & filter manual
    let currentPage = 1;
    while (currentPage <= totalPages) {
      const resp = await fetch(`https://satudata.kulonprogokab.go.id/api/public/data-ku?page=${currentPage}`);
      const json = await resp.json();
      const pageData = json?.datas?.data || [];
      allResults = allResults.concat(pageData);
      currentPage++;
    }

    // Filter search
    if (search) {
      allResults = allResults.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(search)
        )
      );
    }

    // 🔹 Hitung jumlah OPD & Urusan dari hasil search saja
    const opdCountMap = {};
    const urusanCountMap = {};
    allResults.forEach(item => {
      if (item.id2) {
        opdCountMap[item.id2] = (opdCountMap[item.id2] || 0) + 1;
      }
      if (item.id3) {
        urusanCountMap[item.id3] = (urusanCountMap[item.id3] || 0) + 1;
      }
    });

    // Filter OPD
    if (selectedOPD.length > 0) {
      allResults = allResults.filter(item =>
        selectedOPD.includes(String(item.id2))
      );
    }

    // Filter Urusan
    if (selectedUrusan.length > 0) {
      allResults = allResults.filter(item =>
        selectedUrusan.includes(String(item.id3))
      );
    }

    // Pagination manual
    const start = (uiPage - 1) * itemsPerPage;
    const paginated = allResults.slice(start, start + itemsPerPage);

    return res.status(200).json({
      data: paginated.map(item => ({
        id: item.id,
        nama_elemen: item.nama_elemen,
        satuan: item.satuan,
        nama_instansi: item.nama_instansi,
        hash: item.id,
      })),
      total: allResults.length,
      filters: {
        opd: Object.entries(opdMap).map(([value, label]) => ({
          value,
          label,
          count: opdCountMap[value] || 0
        })),
        urusan: Object.entries(urusanMap).map(([value, label]) => ({
          value,
          label,
          count: urusanCountMap[value] || 0
        }))
      },
      sekilas: {
        totalDataset,
        totalProdusen,
        totalTopik
      }
    });

  } catch (error) {
    console.error("Error proxy:", error);
    res.status(500).json({ error: "Gagal ambil data" });
  }
}
