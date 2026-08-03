export default function PageBanner({ crumb, title }) {
  return (
    <div className="page-banner">
      <p className="breadcrumb">
        <a href="#/home">Home</a> <span>›</span> {crumb}
      </p>
      <h1 className="page-title">{title}</h1>
    </div>
  )
}