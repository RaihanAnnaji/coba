"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import DatasetCard from "../../components/statistik/DatasetCard";
import FilterSidebar from "../../components/statistik/FilterSidebar";
import Pagination from "../../components/statistik/Pagination";
import SearchBar1 from "../../components/statistik/SearchBar1";

const StatistikContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterRef = useRef(null);

  // Ambil nilai awal dari URL
  const initialKeyword = searchParams.get("search") || "";
  const initialOPD = searchParams.get("opd")?.split(",").filter(v => v) || [];
  const initialUrusan = searchParams.get("urusan")?.split(",").filter(v => v) || [];

  const itemsPerPage = 10;
  const blockSize = 4;

  const [datasets, setDatasets] = useState([]);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(1);

  const [opdSelected, setOpdSelected] = useState(initialOPD);
  const [urusanSelected, setUrusanSelected] = useState(initialUrusan);
  const [opdList, setOpdList] = useState([]);
  const [urusanList, setUrusanList] = useState([]);

  const fetchDatasets = async (page, search, opd, urusan) => {
    setLoading(true);
    try {
      const query = {
        page,
        search,
        opd: opd.filter(v => v && v.trim() !== "").join(","),
        urusan: urusan.filter(v => v && v.trim() !== "").join(","),
      };

      Object.keys(query).forEach(key => {
        if (!query[key]) delete query[key];
      });

      const params = new URLSearchParams(query).toString();

      const res = await fetch(`/api/proxy-statistik?${params}`);
      const json = await res.json();

      const actualTotal =
        json.total && json.total >= 0 ? json.total : (json.data?.length || 0);

      setDatasets(json.data || []);
      setTotalItems(actualTotal);
      setTotalPages(Math.ceil(actualTotal / itemsPerPage));
      setOpdList(json.filters?.opd || []);
      setUrusanList(json.filters?.urusan || []);

      console.log("Total dari API:", json.total, "Total aktual:", actualTotal);
    } catch (error) {
      console.error("Gagal memuat dataset:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = {
      page: currentPage,
      search: keyword.trim(),
      opd: opdSelected.filter(v => v && v.trim() !== "").join(","),
      urusan: urusanSelected.filter(v => v && v.trim() !== "").join(","),
    };

    Object.keys(query).forEach(key => {
      if (!query[key]) delete query[key];
    });

    const paramsString = new URLSearchParams(query).toString();
    router.replace(`/statistik${paramsString ? `?${paramsString}` : ""}`);

    fetchDatasets(currentPage, keyword, opdSelected, urusanSelected);
  }, [currentPage, keyword, opdSelected, urusanSelected, router]);

  useEffect(() => {
    if ((initialOPD.length > 0 || initialUrusan.length > 0) && filterRef.current) {
      setTimeout(() => {
        filterRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [initialOPD.length, initialUrusan.length]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page < pageBlockStart || page >= pageBlockStart + blockSize) {
      setPageBlockStart(Math.floor((page - 1) / blockSize) * blockSize + 1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setPageBlockStart(1);
  };

  // Helper untuk reset page saat filter berubah
  const updateFilter = (setter, val) => {
    setter(val);
    setCurrentPage(1);
    setPageBlockStart(1);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-8 md:px-20">
        <div className="mb-3 text-sm text-gray-600">
          <Link href="/" className="text-teal-700 hover:underline">Beranda</Link>
          <span className="ml-1 font-medium">&gt; Dataset</span>
        </div>

        <div className="mb-4">
          <SearchBar1 keyword={keyword} setKeyword={setKeyword} onSearch={handleSearch} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div ref={filterRef}>
            <FilterSidebar
              opdList={opdList}
              urusanList={urusanList}
              opdSelected={opdSelected}
              setOpdSelected={(val) => updateFilter(setOpdSelected, val)}
              urusanSelected={urusanSelected}
              setUrusanSelected={(val) => updateFilter(setUrusanSelected, val)}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-semibold">
                {loading
                  ? "Memuat dataset..."
                  : `Total ${totalItems} Dataset`}
              </h1>
            </div>

            {loading ? (
              <p className="text-gray-600">Sedang memuat data...</p>
            ) : datasets.length > 0 ? (
              datasets.map((dataset) => (
                <Link key={dataset.id} href={`/statistik/${dataset.hash}`} className="block">
                  <DatasetCard dataset={dataset} />
                </Link>
              ))
            ) : (
              <p className="text-gray-600">Tidak ada hasil yang ditemukan.</p>
            )}

            <div className="pb-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageBlockStart={pageBlockStart}
                blockSize={blockSize}
                onNextBlock={() => setPageBlockStart(pageBlockStart + blockSize)}
                onPrevBlock={() => setPageBlockStart(pageBlockStart - blockSize)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistikContent;
