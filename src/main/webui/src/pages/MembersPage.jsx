import { useState, useEffect } from 'react'
import { membersApi } from '../api'
import PageBanner from '../components/PageBanner'

import {
  BrassRule, ConfirmDeleteButton, Field, Panel, SearchField,
  SectionHeading, SkeletonRows, StampBadge, StateNotice, FeedbackBanner, useFeedback,
} from '../components/ui'
import { Reveal } from '../components/ui'

export default function MembersPage() {
  const [members, setMembers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { feedback, notify, clear } = useFeedback()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [removingId, setRemovingId] = useState(null)
  const [query, setQuery] = useState('')

  const load = () => {
    setLoading(true)
    membersApi.getAll().then((data) => { setMembers(data); setError(null) }).catch(setError).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required.'
    if (!email.trim()) errs.email = 'Email is required.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSubmitting(true)
    try {
      await membersApi.create({ name: name.trim(), email: email.trim(), phoneNumber: phone.trim() })
      setName(''); setEmail(''); setPhone('')
      load()
      notify('success', `${name.trim()} was registered as a member.`)
    } catch (err) { notify('error', err.message || 'Could not register the member.') }
    finally { setSubmitting(false) }
  }

  async function handleRemove(member) {
    setRemovingId(member.id)
    try {
      await membersApi.remove(member.id)
      load()
      notify('success', `${member.name} was removed from the roll.`)
    } catch (err) { notify('error', err.message || 'Could not remove the member.') }
    finally { setRemovingId(null) }
  }

  const filtered = (members ?? []).filter((m) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
  })

  return (
    <div>
     <PageBanner crumb="Members" title="The Membership" />
      <Panel className="mb-8">
        <h3 className="form-heading">+ Register a New Member</h3>
        <form onSubmit={handleAdd} className="member-form">
          <Field label="Name" htmlFor="m-name" error={errors.name}>
            <input id="m-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
          </Field>
          <Field label="Email" htmlFor="m-email" error={errors.email}>
            <input id="m-email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@example.com" />
          </Field>
          <Field label="Phone" htmlFor="m-phone">
            <input id="m-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 010 0000" />
          </Field>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Registering…' : 'Register Member'}</button>
        </form>
      </Panel>

      {feedback ? <FeedbackBanner feedback={feedback} onClose={clear} /> : null}

      {error ? (
        <StateNotice variant="error" title="Could not load the roll." detail={error.message} />
      ) : !loading && (!members || members.length === 0) ? (
        <StateNotice title="No members registered yet." />
      ) : (
        <>
          {!loading && members?.length > 0 ? (
            <div className="toolbar-row">
              <SearchField value={query} onChange={setQuery} placeholder="Search by name or email…" />
              {query ? <span className="count-tag">{filtered.length} of {members.length}</span> : null}
            </div>
          ) : null}
          <Reveal>
            <Panel className="table-panel">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {loading ? <SkeletonRows columns={5} /> : filtered.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.phoneNumber}</td>
                      <td>{m.isActive ? <StampBadge tone="green">Active</StampBadge> : <StampBadge tone="muted">Inactive</StampBadge>}</td>
                      <td><ConfirmDeleteButton label={`Remove ${m.name}`} pending={removingId === m.id} onConfirm={() => handleRemove(m)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </Reveal>
        </>
      )}
    </div>
  )
}