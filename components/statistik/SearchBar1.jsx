const SearchBar1 = ({ keyword, setKeyword, onSearch }) => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onSearch();
      }
    };
  
    return (
      <div className="flex items-center gap-2 bg-white rounded-full shadow-sm px-4 py-2 max-w-xl mx-auto">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cari apa aja disini"
          className="flex-1 outline-none text-sm"
        />
        <button
          onClick={onSearch}
          className="text-white bg-teal-500 px-4 py-1 rounded-full text-sm hover:bg-teal-600"
        >
          Cari
        </button>
      </div>
    );
  };
  
  export default SearchBar1;
  