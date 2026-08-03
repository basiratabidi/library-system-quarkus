import { useState, useEffect } from 'react'
import { booksApi, membersApi, lendingApi } from '../api'
import { BrassRule, Field, Panel, SectionHeading, StampBadge, StateNotice, FeedbackBanner, useFeedback } from '../components/ui'
import { Reveal } from '../components/ui'
import PageBanner from '../components/PageBanner'


export default function LendingPage() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [bookId, setBookId] = useState('')
  const [memberId, setMemberId] = useState('')
  const { feedback, notify, clear } = useFeedback()

  const loadAll = () => {
    booksApi.getAll().then(setBooks).catch(console.error)
    membersApi.getAll().then(setMembers).catch(console.error)
  }
  useEffect(() => { loadAll() }, [])

  async function handleLend(e) {
    e.preventDefault()
    if (!bookId || !memberId) { notify('error', 'Select both a book and a member.'); return }
    try {
      await lendingApi.lend(bookId, memberId)
      setBookId(''); setMemberId('')
      loadAll()
      notify('success', 'Book was lent out.')
    } catch (err) { notify('error', err.message || 'Could not lend the book.') }
  }

  const onLoan = books.filter((b) => !b.isAvailable)

  return (
    <div>
      <PageBanner crumb="Lending" title="Lending Desk" />
      <Panel className="mb-8">
        <h3 className="form-heading">Lend a Book</h3>
        <form onSubmit={handleLend} className="lending-form">
          <Field label="Book" htmlFor="l-book">
            <select id="l-book" className="input" value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">Select book</option>
              {books.filter((b) => b.isAvailable).map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </Field>
          <Field label="Member" htmlFor="l-member">
            <select id="l-member" className="input" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              <option value="">Select member</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
          <button type="submit" className="btn btn-primary">Lend It</button>
        </form>
      </Panel>

      {feedback ? <FeedbackBanner feedback={feedback} onClose={clear} /> : null}

      {onLoan.length === 0 ? (
        <StateNotice title="No books currently on loan." />
      ) : (
        <Reveal>
        <Panel className="table-panel">
          <table>
            <thead><tr><th>Title</th><th>Author</th><th>Status</th></tr></thead>
            <tbody>
              {onLoan.map((b) => (
                <tr key={b.id}><td>{b.title}</td><td>{b.author}</td><td><StampBadge tone="red">On Loan</StampBadge></td></tr>
              ))}
            </tbody>
          </table>
        </Panel>
        </Reveal>
      )}
    </div>
  )
}