
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
        <a href="#/home">Front Desk</a>
        <a href="#/books">Books</a>
        <a href="#/members">Members</a>
      </div>
      <div className="footer-col">
        <h4>System</h4>
        <a href="#/lending">Lending</a>
        <a href="#/welcome">About</a>
      </div>
      <div className="footer-bottom">© 2026 Stacks Library System. All rights reserved.</div>
    </footer>
  )
}