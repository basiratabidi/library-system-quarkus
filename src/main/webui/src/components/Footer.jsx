import { Link } from "react-router";

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
        <h4>Menu</h4>
        <Link to="/home">Front Desk</Link  >
        <Link to="/books">Books</Link>
        <Link to="/members">Members</Link>
      </div>
      <div className="footer-col">
        <h4>System</h4>
        <Link to="/lending">Lending</Link>
        <Link to="/welcome">About</Link>
      </div>
      <div className="footer-bottom">© 2026 Stacks Library System. All rights reserved.</div>
    </footer>
  )
}