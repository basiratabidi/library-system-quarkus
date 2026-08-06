import { useState, useEffect } from 'react'
import { booksApi, getBookRating, getAuth, lendingApi } from '../api'
import { Reveal } from '../components/ui'
import PageBanner from '../components/PageBanner'
import { useSearchParams } from 'react-router-dom'
import {
  ConfirmDeleteButton, Field, Panel, SearchField,
  SortSelect, StampBadge, StarRating, StateNotice, FeedbackBanner, useFeedback,
} from '../components/ui'

function BookCard({ book, canManage, isEditing, editTitle, editAuthor, setEditTitle, setEditAuthor, onStartEdit, onSaveEdit, onCancelEdit, onDelete, deleting }) {
  const { averageRating, reviewCount } = getBookRating(book.id)

  return (
    <div className="book-card">
      <div className="book-cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={`Cover of ${book.title}`} className="book-cover-img" loading="lazy" />
        ) : (
          <span className="book-cover-fallback">📖</span>
        )}
        {canManage && !isEditing ? (
          <div className="book-cover-actions">
            <button className="btn btn-icon" onClick={() => onStartEdit(book)} aria-label={`Edit ${book.title}`}>✎</button>
            <ConfirmDeleteButton label={`Delete ${book.title}`} pending={deleting} onConfirm={onDelete} />
          </div>
        ) : null}
      </div>
      <div className="book-card-body">
        {isEditing ? (
          <div className="edit-form">
            <input className="input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
            <input className="input" value={editAuthor} onChange={(e) => setEditAuthor(e.target.value)} placeholder="Author" />
            <div className="edit-actions">
              <button className="btn btn-primary btn-sm" onClick={onSaveEdit}>Save</button>
              <button className="btn btn-ghost btn-sm" onClick={onCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
            <StarRating value={averageRating} count={reviewCount} />
            <div className="book-card-footer">
              {book.isAvailable ? <StampBadge tone="green">Available</StampBadge> : <StampBadge tone="red">On Loan</StampBadge>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function BooksPage() {
  const auth = getAuth()
  const isAdmin = auth?.role === 'ADMIN'

  const [books, setBooks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { feedback, notify, clear } = useFeedback()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState({})

  const [lendBookId, setLendBookId] = useState('')
  const [lending, setLending] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAuthor, setEditAuthor] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [searchParams] = useSearchParams()
const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [sort, setSort] = useState('title')

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12
  useEffect(() => { setPage(1) }, [query, sort])

  const load = () => {
    setLoading(true)
    booksApi.getAll().then((data) => { setBooks(data); setError(null) }).catch(setError).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e) {
    e.preventDefault()
    const errs = {}
    if (!title.trim()) errs.title = 'Title is required.'
    if (!author.trim()) errs.author = 'Author is required.'
    setFormError(errs)
    if (Object.keys(errs).length) return
    setSubmitting(true)
    try {
      await booksApi.create({ title: title.trim(), author: author.trim() })
      setTitle(''); setAuthor('')
      load()
      notify('success', `"${title.trim()}" was added to the catalog.`)
    } catch (err) {
      notify('error', err.message || 'Could not add the book.')
    } finally { setSubmitting(false) }
  }

  async function handleLendSelf(e) {
    e.preventDefault()
    if (!lendBookId) { notify('error', 'Select a book to lend.'); return }
    setLending(true)
    try {
      await lendingApi.lendSelf(lendBookId)
      setLendBookId('')
      load()
      notify('success', 'Book lended to your account.')
    } catch (err) {
      notify('error', err.message || 'Could not lend that book.')
    } finally { setLending(false) }
  }

  function startEdit(book) {
    setEditingId(book.id); setEditTitle(book.title); setEditAuthor(book.author); clear()
  }

  async function saveEdit(id) {
    if (!editTitle.trim() || !editAuthor.trim()) { notify('error', 'Title and author cannot be empty.'); return }
    try {
      await booksApi.update(id, { title: editTitle.trim(), author: editAuthor.trim() })
      setEditingId(null)
      load()
      notify('success', 'Book record updated.')
    } catch (err) { notify('error', err.message || 'Could not update the book.') }
  }

  async function handleDelete(book) {
    setDeletingId(book.id)
    try {
      await booksApi.remove(book.id)
      load()
      notify('success', `"${book.title}" was removed from the catalog.`)
    } catch (err) { notify('error', err.message || 'Could not delete the book.') }
    finally { setDeletingId(null) }
  }

  const filtered = (books ?? []).filter((b) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  })
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title)
    if (sort === 'available') return Number(b.isAvailable) - Number(a.isAvailable)
    return 0
  })

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalVolumes = books?.length ?? 0
  const onLoanCount = books?.filter((b) => !b.isAvailable).length ?? 0
  const availableCount = totalVolumes - onLoanCount
  const availableBooks = books?.filter((b) => b.isAvailable) ?? []

  return (
    <div>
      <PageBanner crumb="Books" title="The Catalog" />

      {feedback ? <FeedbackBanner feedback={feedback} onClose={clear} /> : null}

      {error ? (
        <StateNotice variant="error" title="Could not load the catalog." detail={error.message} />
      ) : (
        <div className="books-layout">
          <div>
            {isAdmin ? (
              <Panel className="mb-4">
                <h3 className="form-heading">+ Accession a New Book</h3>
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Field label="Title" htmlFor="book-title" error={formError.title}>
                    <input id="book-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The Name of the Wind" />
                  </Field>
                  <Field label="Author" htmlFor="book-author" error={formError.author}>
                    <input id="book-author" className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Patrick Rothfuss" />
                  </Field>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding…' : 'Add Book'}</button>
                </form>
              </Panel>
            ) : (
              <Panel className="mb-4">
                <h3 className="form-heading">Lend a Book</h3>
                <form onSubmit={handleLendSelf} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Field label="Book" htmlFor="lend-book">
                    <select id="lend-book" className="input" value={lendBookId} onChange={(e) => setLendBookId(e.target.value)}>
                      <option value="">Select a book</option>
                      {availableBooks.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                    </select>
                  </Field>
                  <button type="submit" className="btn btn-primary" disabled={lending}>{lending ? 'Lending…' : 'Lend It'}</button>
                </form>
              </Panel>
            )}

            <div className="catalog-summary">
              <span className="catalog-summary-label">Catalog Summary</span>
              <div className="catalog-summary-row"><span>Total Volumes</span><strong>{totalVolumes}</strong></div>
              <div className="catalog-summary-row"><span>On Loan</span><strong>{onLoanCount}</strong></div>
              <div className="catalog-summary-row"><span>Available</span><strong>{availableCount}</strong></div>
            </div>
          </div>

          <div>
            {!loading && books && books.length > 0 ? (
              <div className="toolbar-row">
                <SearchField value={query} onChange={setQuery} placeholder="Search by title or author…" />
                <SortSelect
                  value={sort}
                  onChange={setSort}
                  options={[
                    { value: 'title', label: 'Sort: Title A-Z' },
                    { value: 'available', label: 'Sort: Available First' },
                    { value: 'rating', label: 'Sort: Top Rated' },
                  ]}
                />
                {query ? <span className="count-tag">{filtered.length} of {books.length}</span> : null}
              </div>
            ) : null}

            {loading ? (
              <div className="book-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="book-card">
                    <div className="book-cover skeleton-bar" style={{ height: '100%' }} />
                  </div>
                ))}
              </div>
            ) : !books || books.length === 0 ? (
              <StateNotice title="No books on record yet." detail="Accession your first title using the form above." />
            ) : sorted.length === 0 ? (
              <StateNotice title={`No books match "${query}".`} />
            ) : (
              <Reveal>
                <div className="book-grid">
                  {paged.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      canManage={isAdmin}
                      isEditing={editingId === book.id}
                      editTitle={editTitle}
                      editAuthor={editAuthor}
                      setEditTitle={setEditTitle}
                      setEditAuthor={setEditAuthor}
                      onStartEdit={startEdit}
                      onSaveEdit={() => saveEdit(book.id)}
                      onCancelEdit={() => setEditingId(null)}
                      onDelete={() => handleDelete(book)}
                      deleting={deletingId === book.id}
                    />
                  ))}
                </div>

                {pageCount > 1 ? (
                  <div className="pagination">
                    <button className="page-num" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        className={`page-num ${page === i + 1 ? 'active' : ''}`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button className="page-num" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>›</button>
                  </div>
                ) : null}
              </Reveal>
            )}
          </div>
        </div>
      )}
    </div>
  )
}