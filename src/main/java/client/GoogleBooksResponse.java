package client;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleBooksResponse {
    public List<Doc> docs;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Doc {
        public Long cover_i;
    }
}