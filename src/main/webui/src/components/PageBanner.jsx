import { Link } from "react-router";

export default function PageBanner({ crumb, title }) {
  return (
    <div className="page-banner">
      <p className="breadcrumb">
        <Link to="/home">Home</Link> <span>›</span> {crumb}
      </p>
      <h1 className="page-title">{title}</h1>
    </div>
  )
}