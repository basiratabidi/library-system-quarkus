package client;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleBooksResponse {
    public List<Item> items;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        public VolumeInfo volumeInfo;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumeInfo {
        public ImageLinks imageLinks;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageLinks {
        public String thumbnail;
    }
}