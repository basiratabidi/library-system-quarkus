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
    @Path("/v1/volumes")
    @Produces(MediaType.APPLICATION_JSON)
    GoogleBooksResponse searchByIsbn(@QueryParam("q") String query);
}