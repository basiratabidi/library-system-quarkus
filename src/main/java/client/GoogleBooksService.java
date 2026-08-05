package client;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class GoogleBooksService {

    @Inject
    @RestClient
    GoogleBooksClient googleBooksClient;

    private static final Object RATE_LOCK = new Object();
    private static volatile long lastCallAtMillis = 0;
    private static final long MIN_GAP_MILLIS = 200;

    private void throttle() {
        synchronized (RATE_LOCK) {
            long wait = MIN_GAP_MILLIS - (System.currentTimeMillis() - lastCallAtMillis);
            if (wait > 0) {
                try {
                    Thread.sleep(wait);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
            lastCallAtMillis = System.currentTimeMillis();
        }
    }

    public String fetchCoverUrl(String title, String author) {
        if (title == null || title.isBlank()) {
            return null;
        }

        try {
            String url = search(title, author);
            if (url == null && author != null && !author.isBlank()) {
                // author string may not match Open Library's exact spelling
                // for this book (translated works, "Saavedra" vs not, etc.)
                // — retry title-only, which is far more forgiving.
                url = search(title, null);
            }
            return url;
        } catch (Exception e) {
            System.err.println("Open Library API error for title '" + title + "': " + e.getMessage());
            return null;
        }
    }

    private String search(String title, String author) {
        throttle();
        GoogleBooksResponse response = googleBooksClient.search(title, author, 1);
        if (response != null && response.docs != null && !response.docs.isEmpty()) {
            Long coverId = response.docs.get(0).cover_i;
            if (coverId != null) {
                return "https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg";
            }
        }
        return null;
    }
}