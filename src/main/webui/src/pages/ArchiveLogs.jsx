import { Link } from "react-router-dom";

export default function ArchiveLogs() {
  return (
    <div className="main-content">
      <div className="page-banner">
        <div className="breadcrumb">
          <Link to="/welcome">Home</Link> / Archive Logs
        </div>
        <h1 className="page-title">System & Preservation Logs</h1>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Record ID</th>
              <th>Category</th>
              <th>Action Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-08-05 14:22</td>
              <td>#ARC-9021</td>
              <td><span className="activity-type-tag accession">Accession</span></td>
              <td>Acquired 19th-century translation ledger</td>
            </tr>
            <tr>
              <td>2026-08-04 09:15</td>
              <td>#ARC-9020</td>
              <td><span className="activity-type-tag loan">Restoration</span></td>
              <td>Transferred folio batch to climate vault</td>
            </tr>
            <tr>
              <td>2026-08-02 16:40</td>
              <td>#ARC-9019</td>
              <td><span className="activity-type-tag return">Cataloging</span></td>
              <td>Indexed digital microfilms for public terminal</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}