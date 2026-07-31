import { useState, useEffect } from 'react';
import { api } from '../api';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const load = () => api('/members').then(setMembers).catch(console.error);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setName(''); setEmail(''); setPhone(''); setModalOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    await api('/members', { method: 'POST', body: JSON.stringify({ name, email, phoneNumber: phone }) });
    setModalOpen(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Remove this member?')) return;
    await api(`/members/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="toolbar">
        <h2>Members <span className="count">{members.length} total</span></h2>
        <button className="primary" onClick={openAdd}>+ Add member</button>
      </div>

      {members.length === 0 ? (
        <div className="empty">No members yet. Register the first one.</div>
      ) : (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr></thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phoneNumber}</td>
                <td><div className="row-actions"><button className="ghost danger" onClick={() => remove(m.id)}>Remove</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="overlay">
          <div className="modal">
            <h3>Add member</h3>
            <form onSubmit={save}>
              <div className="field"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} /></div>
              <div className="field"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="field"><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
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