// Looks up a book cover from the Google Books API by title + author.
// Google Books supports direct browser (CORS) requests, unlike Open Library's
// search.json, which silently blocks cross-origin fetches.
//
// Requests are rate-limited through a queue: firing 100 lookups at once (one
// per book card mounting simultaneously) triggers 429 Too Many Requests from
// Google's unauthenticated quota. Spacing requests out avoids that.

const cache = new Map();
const RATE_LIMIT_MS = 300; // gap between outgoing requests

let queueTail = Promise.resolve();

function enqueue(task) {
  const run = () => task();
  const result = queueTail.then(run, run); // run even if a prior task errored
  queueTail = result
    .catch(() => {})
    .then(() => new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS)));
  return result;
}

async function fetchWithRetry(url, attempt = 0) {
  const res = await fetch(url);
  if (res.status === 429 && attempt < 2) {
    await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    return fetchWithRetry(url, attempt + 1);
  }
  return res;
}

export function fetchCoverUrl(title, author) {
  const cacheKey = `${title}::${author}`;
  if (cache.has(cacheKey)) return Promise.resolve(cache.get(cacheKey));

  return enqueue(async () => {
    // re-check cache in case an earlier queued call already resolved this key
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    try {
      const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
      const res = await fetchWithRetry(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
      if (!res.ok) throw new Error('lookup failed');
      const data = await res.json();
      const item = data.items?.[0];

      let url = item?.volumeInfo?.imageLinks?.thumbnail || null;
      if (url) {
        url = url.replace('http://', 'https://');
      }
      cache.set(cacheKey, url);
      return url;
    } catch {
      cache.set(cacheKey, null);
      return null;
    }
  });
}