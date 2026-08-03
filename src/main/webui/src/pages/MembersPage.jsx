import { useState, useEffect } from 'react'
import { membersApi } from '../api'
import PageBanner from '../components/PageBanner'
import {
  Panel, Field, SearchField, StampBadge, StateNotice, 
  ConfirmDeleteButton, FeedbackBanner, useFeedback, Reveal 
} from '../components/ui'

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [query, setQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { feedback, notify, clear } = useFeedback()

  const loadMembers = () => {
    setLoading(true)
    membersApi.getAll()
      .then(setMembers)
      .catch((err) => notify('error', err.message || 'Failed to fetch members'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadMembers() }, [])

  async function handleAddMember(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      notify('error', 'Name and Email are required.')
      return
    }
    setSubmitting(true)
    try {
      await membersApi.create({ name: name.trim(), email: email.trim() })
      setName('')
      setEmail('')
      loadMembers()
      notify('success', `Member "${name}" registered successfully.`)
    } catch (err) {
      notify('error', err.message || 'Could not register member.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteMember(id, memberName) {
    try {
      await membersApi.remove(id)
      loadMembers()
      notify('success', `Member "${memberName}" removed.`)
    } catch (err) {
      notify('error', err.message || 'Could not remove member.')
    }
  }

  const filteredMembers = members.filter(
    (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page-container">
      <PageBanner crumb="Members" title="Membership Roll" />

      <Panel className="mb-8">
        <h3 className="form-heading">+ Register New Member</h3>
        <form onSubmit={handleAddMember} className="book-form">
          <Field label="Full Name" htmlFor="member-name">
            <input
              id="member-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
            />
          </Field>
          <Field label="Email Address" htmlFor="member-email">
            <input
              id="member-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ada@example.com"
            />
          </Field>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register Member'}
          </button>
        </form>
      </Panel>

      {feedback && <FeedbackBanner feedback={feedback} onClose={clear} />}

      <div className="toolbar-row mb-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search members by name or email…" />
      </div>

      {loading ? (
        <StateNotice title="Loading membership roll..." />
      ) : filteredMembers.length === 0 ? (
        <StateNotice title="No members found." detail="Try adjusting your search query or add a new member above." />
      ) : (
        <Reveal>
          <Panel className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m.id}>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.email}</td>
                    <td><StampBadge tone="green">Active</StampBadge></td>
                    <td style={{ textAlign: 'right' }}>
                      <ConfirmDeleteButton
                        label={`Delete ${m.name}`}
                        onConfirm={() => handleDeleteMember(m.id, m.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </Reveal>
      )}
    </div>
  )
}