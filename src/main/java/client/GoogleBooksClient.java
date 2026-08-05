package client;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@RegisterRestClient(configKey = "google-books-api")
public interface GoogleBooksClient {

    @GET
    @Path("/search.json")
    @Produces(MediaType.APPLICATION_JSON)
    GoogleBooksResponse search(@QueryParam("title") String title, @QueryParam("author") String author, @QueryParam("limit") int limit);
}