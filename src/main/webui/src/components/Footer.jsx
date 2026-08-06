import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-brand-name">§ Stacks</div>
        <p className="footer-tagline">
          Circulation, catalog, and membership — tracked plainly, kept in order.
        </p>
      </div>
      <div className="footer-col">
        <h4>Explore</h4>
        <Link to="/books">Catalog & Books</Link>
        <Link to="/collections">Special Collections</Link>
        <Link to="/archive">Archive Logs</Link>
      </div>
      <div className="footer-col">
        <h4>Information</h4>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact & Hours</Link>
        <Link to="/help">System Guide</Link>
      </div>
      <div className="footer-bottom">© 2026 Stacks Library System. All rights reserved.</div>
    </footer>
  );
}