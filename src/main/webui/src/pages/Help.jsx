import { Link } from "react-router-dom";

export default function Help() {
  return (
    <div className="main-content">
      <div className="page-banner">
        <div className="breadcrumb">
          <Link to="/welcome">Home</Link> / System Guide
        </div>
        <h1 className="page-title">System Guide & Frequently Asked Questions</h1>
      </div>

      <div className="panel mb-8">
        <h3 className="form-heading">1. How do I request a physical item?</h3>
        <p className="subtitle" style={{ marginBottom: "1.5rem" }}>
          Log in to your account, browse the Catalog & Books section, and click on individual titles to check availability or reserve a volume at the front desk.
        </p>

        <h3 className="form-heading">2. What are loan durations?</h3>
        <p className="subtitle" style={{ marginBottom: "1.5rem" }}>
          Standard items may be checked out for 14 days. Special collection manuscripts must be reviewed strictly within the secure reading room.
        </p>

        <h3 className="form-heading">3. Account registration requirements</h3>
        <p className="subtitle">
          Membership requires institutional validation (student ID or faculty clearance) handled via the registration portal or front desk administration.
        </p>
      </div>
    </div>
  );
}