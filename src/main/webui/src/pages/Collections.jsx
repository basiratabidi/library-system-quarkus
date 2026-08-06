import { Link } from "react-router-dom";

export default function Collections() {
  return (
    <div className="main-content">
      <div className="page-banner">
        <div className="breadcrumb">
          <Link to="/welcome">Home</Link> / Special Collections
        </div>
        <h1 className="page-title">Curated & Rare Collections</h1>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">📜</div>
          <h3 className="feature-title">Manuscripts & Codices</h3>
          <p className="feature-desc">Preserved historical texts, handwritten journals, and early print editions from regional archives.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏛️</div>
          <h3 className="feature-title">Architectural Blueprints</h3>
          <p className="feature-desc">Mid-century urban development plans, sketches, and cartographic surveys of the metropolitan area.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✒️</div>
          <h3 className="feature-title">Periodical Archives</h3>
          <p className="feature-desc">Bound volumes of literary magazines, gazettes, and scholarly journals dating back over a century.</p>
        </div>
      </div>
    </div>
  );
}