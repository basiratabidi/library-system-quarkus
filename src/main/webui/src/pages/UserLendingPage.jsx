import { useEffect, useState } from 'react'
import { booksApi, lendingApi } from '../api'
import { Panel, StampBadge, StateNotice, Reveal } from '../components/ui'
import PageBanner from '../components/PageBanner'

export default function UserLendingPage() {
  const [rows, setRows] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([lendingApi.mine(), booksApi.getAll()])
      .then(([lendings, books]) => {
        const byId = Object.fromEntries(books.map((b) => [b.id, b]))
        setRows(lendings.map((l) => ({ ...l, book: byId[l.bookId] })))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const active = (rows ?? []).filter((r) => !r.isReturned)

  return (
    <div>
      <PageBanner crumb="My Lending" title="My Lended Books" />
      {loading ? (
        <StateNotice title="Loading your lending record..." />
      ) : active.length === 0 ? (
        <StateNotice title="You have no books on loan." />
      ) : (
        <Reveal>
          <Panel className="table-panel">
            <table>
              <thead>
                <tr><th>Title</th><th>Author</th><th>Lent On</th><th>Status</th></tr>
              </thead>
              <tbody>
                {active.map((r) => (
                  <tr key={r.id}>
                    <td>{r.book?.title ?? r.bookId}</td>
                    <td>{r.book?.author ?? '—'}</td>
                    <td>{r.lendingDate}</td>
                    <td><StampBadge tone="red">On Loan</StampBadge></td>
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