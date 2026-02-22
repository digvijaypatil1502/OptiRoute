package com.optiroute.dto;

import java.io.Serializable;
import java.util.List;

public class RouteSuggestionResponse implements Serializable {
    private static final long serialVersionUID = 1L;
    private RouteOption bestRoute;
    private List<RouteOption> otherRoutes;

    // --- Constructors ---
    public RouteSuggestionResponse() {
    }

    public RouteSuggestionResponse(RouteOption bestRoute, List<RouteOption> otherRoutes) {
        this.bestRoute = bestRoute;
        this.otherRoutes = otherRoutes;
    }

    // --- Getters and Setters ---
    public RouteOption getBestRoute() {
        return bestRoute;
    }

    public void setBestRoute(RouteOption bestRoute) {
        this.bestRoute = bestRoute;
    }

    public List<RouteOption> getOtherRoutes() {
        return otherRoutes;
    }

    public void setOtherRoutes(List<RouteOption> otherRoutes) {
        this.otherRoutes = otherRoutes;
    }

    public static RouteSuggestionResponseBuilder builder() {
        return new RouteSuggestionResponseBuilder();
    }

    public static class RouteSuggestionResponseBuilder {
        private RouteOption bestRoute;
        private List<RouteOption> otherRoutes;

        public RouteSuggestionResponseBuilder bestRoute(RouteOption bestRoute) {
            this.bestRoute = bestRoute;
            return this;
        }

        public RouteSuggestionResponseBuilder otherRoutes(List<RouteOption> otherRoutes) {
            this.otherRoutes = otherRoutes;
            return this;
        }

        public RouteSuggestionResponse build() {
            return new RouteSuggestionResponse(bestRoute, otherRoutes);
        }
    }
}