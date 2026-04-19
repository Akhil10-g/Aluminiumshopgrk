function MaterialCard({ material, onViewDetails }) {
  return (
    <article className="catalog-card">
      <div className="catalog-image-wrap">
        <img src={material.image} alt={material.title} loading="lazy" />
      </div>

      <div className="catalog-content">
        <span className="catalog-tag">{material.filterCategory}</span>
        <h3>{material.title}</h3>
        <p>{material.description}</p>

        <div className="catalog-actions">
          <button type="button" className="catalog-btn outline" onClick={() => onViewDetails(material)}>
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}

export default MaterialCard
