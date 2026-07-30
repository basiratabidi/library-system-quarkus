package org.library.exception;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {
    @Override
    public Response toResponse(Throwable exception) {
        if (exception instanceof BookNotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(exception.getMessage())
                    .build();
        }
        if (exception instanceof MemberNotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(exception.getMessage())
                    .build();
        }

        if (exception instanceof AlreadyLentExpection) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(exception.getMessage())
                    .build();
        }
        if (exception instanceof LendingNotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(exception.getMessage())
                    .build();
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("An unexpected error occurred: " + exception.getMessage())
                .build();
    }
}