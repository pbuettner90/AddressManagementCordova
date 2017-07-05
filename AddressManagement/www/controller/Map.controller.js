sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("AddressManagement.controller.Map", {

        onInit: function()
        {
            this.getView().byId("map_canvas").addStyleClass("myMap");

            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.subscribe("MapChannel", "onNavigateEvent", this.onDataReceived, this);
        },

        onDataReceived: function(channel, event, data)
        {
            var coordinates = {lat: data[0], lng: data[1]};

            var mapOptions =
                {
                    center: coordinates,
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

            var map = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(), mapOptions);


            var marker = new google.maps.Marker(
                {
                    position: coordinates,
                    map: map
                });
        },

        NavPress: function()
        {
            this.getRouter().getTargets().display("newAddress");
        },

        getRouter: function()
        {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    });
});