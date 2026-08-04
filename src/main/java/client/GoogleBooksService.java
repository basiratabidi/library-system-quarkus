package client;

import io.quarkus.cache.CacheResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
public class GoogleBooksService {

    @Inject
    @RestClient
    GoogleBooksClient googleBooksClient;

    @CacheResult(cacheName = "book-covers-cache")
    public String fetchCoverUrl(String title) {
        if (title == null || title.isBlank()) {
            return "/images/default-cover.png";
        }

        try {
            GoogleBooksResponse response = googleBooksClient.searchByIsbn("intitle:" + title);
            if (response != null && response.items != null && !response.items.isEmpty()) {
                GoogleBooksResponse.VolumeInfo volumeInfo = response.items.get(0).volumeInfo;
                if (volumeInfo != null && volumeInfo.imageLinks != null) {
                    String url = volumeInfo.imageLinks.thumbnail;
                    return url != null ? url.replace("http://", "https://") : "/images/default-cover.png";
                }
            }
        } catch (Exception e) {
            System.err.println("Google Books API error for title '" + title + "': " + e.getMessage());
        }

        return "/images/default-cover.png";
    }
}