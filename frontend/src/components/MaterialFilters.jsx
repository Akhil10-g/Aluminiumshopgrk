const filters = ['All', 'Aluminium', 'ACP', 'Glass', 'Partitions', 'Hardware']

function MaterialFilters({ activeFilter, onFilterChange, searchText, onSearchChange }) {
  return (
    <div className="catalog-toolbar">
      <div className="catalog-search-wrap">
        <input
          type="search"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search materials, systems, or finishes"
          aria-label="Search materials"
          className="catalog-search"
        />
      </div>

      <div className="catalog-filters" role="tablist" aria-label="Material categories">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
            aria-selected={activeFilter === filter}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MaterialFilters
