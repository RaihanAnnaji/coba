const DatasetCard = ({ dataset }) => (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer">
      <h2 className="font-semibold text-base text-gray-800">
        {dataset.nama_elemen}
      </h2>
      <p className="text-sm text-gray-600">
        Instansi: {dataset.nama_instansi}{" "}
        {dataset.satuan ? `| Satuan: ${dataset.satuan}` : ""}
      </p>
    </div>
  );
  
  export default DatasetCard;
  