import { useState, useEffect } from 'react';
import { api } from '../api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding, object = editing
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const load = () => api('/books').then(setBooks).catch(console.error);
  useEffect(() => { load(); }, []); // wrapped in plain function - fixes the async-in-useEffect crash

  const openAdd = () => { setEditing(null); setTitle(''); setAuthor(''); setModalOpen(true); };
  const openEdit = (b) => { setEditing(b); setTitle(b.title); setAuthor(b.author); setModalOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!title || !author) return;
    if (editing) {
      await api(`/books/${editing.id}`, { method: 'PUT', body: JSON.stringify({ title, author }) });
    } else {
      await api('/books', { method: 'POST', body: JSON.stringify({ title, author }) });
    }
    setModalOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this book?')) return;
    await api(`/books/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h2>Books <span className="count">{books.length} total</span></h2>
        <button className="primary" onClick={openAdd}>+ Add book</button>
      </div>

      {books.length === 0 ? (
        <div className="empty">No books yet. Add the first one.</div>
      ) : (
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Available</th><th></th></tr></thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td><span className={`badge ${b.isAvailable ? 'yes' : 'no'}`}>{b.isAvailable ? 'Available' : 'On loan'}</span></td>
                <td>
                  <div className="row-actions">
                    <button className="ghost" onClick={() => openEdit(b)}>Edit</button>
                    <button className="ghost danger" onClick={() => remove(b.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="overlay">
          <div className="modal">
            <h3>{editing ? 'Edit book' : 'Add book'}</h3>
            <form onSubmit={save}>
              <div className="field"><label>Title</label><input value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div className="field"><label>Author</label><input value={author} onChange={e => setAuthor(e.target.value)} /></div>
              <div className="modal-actions">
                <button type="button" className="ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}