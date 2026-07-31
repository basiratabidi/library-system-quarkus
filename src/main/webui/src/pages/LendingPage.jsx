import { useState, useEffect } from 'react';
import { api } from '../api';

export default function LendingPage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookId, setBookId] = useState('');
  const [memberId, setMemberId] = useState('');

  const loadAll = () => {
    api('/books').then(setBooks).catch(console.error);
    api('/members').then(setMembers).catch(console.error);
  };
  useEffect(() => { loadAll(); }, []);

  const openModal = () => { setBookId(''); setMemberId(''); setModalOpen(true); };

  const lend = async (e) => {
    e.preventDefault();
    if (!bookId || !memberId) return;
    try {
      await api(`/lendings/${bookId}/${memberId}`, { method: 'POST' });
      setModalOpen(false);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const onLoan = books.filter(b => !b.isAvailable);

  return (
    <div>
      <div className="toolbar">
        <h2>Lending</h2>
        <button className="primary" onClick={openModal}>+ Lend a book</button>
      </div>

      {onLoan.length === 0 ? (
        <div className="empty">No books currently on loan.</div>
      ) : (
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Status</th></tr></thead>
          <tbody>
            {onLoan.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td><span className="badge no">On loan</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="overlay">
          <div className="modal">
            <h3>Lend a book</h3>
            <form onSubmit={lend}>
              <div className="field">
                <label>Book</label>
                <select value={bookId} onChange={e => setBookId(e.target.value)}>
                  <option value="">Select book</option>
                  {books.filter(b => b.isAvailable).map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Member</label>
                <select value={memberId} onChange={e => setMemberId(e.target.value)}>
                  <option value="">Select member</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary">Lend it</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}