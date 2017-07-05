sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "AddressManagement/model/models"
], function(Controller, models) {
    "use strict";

    return Controller.extend("AddressManagement.controller.EditAddress",
        {
            onInit: function()
            {
                var eventBus = sap.ui.getCore().getEventBus();
                eventBus.subscribe("AddressChannel", "onNavigateEvent", this.onDataReceived, this);
            },

            onDataReceived: function(channel, event, data)
            {
                //this.oView = data;

                var id = data.getProperty("Id");
                var firstName = data.getProperty("FirstName");
                var lastName = data.getProperty("LastName");
                var street = data.getProperty("Street");
                var city = data.getProperty("City");
                var plz = data.getProperty("Plz");

                var oModel = new sap.ui.model.json.JSONModel(models);
                models.id = id;
                models.firstName = firstName;
                models.lastName = lastName;
                models.street = street;
                models.city = city;
                models.plz = plz;

                this.getView().setModel(oModel);
            },

            onUpdateAddress: function()
            {
                var oUpdateAddress =
                    {
                        "FirstName": this.getView().byId("firstName").getValue(),
                        "LastName": this.getView().byId("lastName").getValue(),
                        "Street": this.getView().byId("street").getValue(),
                        "City": this.getView().byId("city").getValue(),
                        "Plz": this.getView().byId("plz").getValue()
                    };

                $.ajax({
                    type: "PATCH",
                    url: 'http://addressodata20170508023216.azurewebsites.net/odata/Addresses(' + models.id + ')',
                    dataType: "json",
                    data: JSON.stringify(oUpdateAddress),
                    contentType: "application/json; charset=utf-8" ,

                    success: function()
                    {
                        sap.ui.getCore().getModel("webservice").refresh("$direct");
                    },

                    error: function()
                    {
                        alert("Fehler beim Aktualisieren des aktuellen Datensatzes");
                    }
                });

                this.getRouter().getTargets().display("addresses");
            },

            NavPress: function()
            {
                this.getRouter().getTargets().display("addresses");
            },

            getRouter: function()
            {
                return sap.ui.core.UIComponent.getRouterFor(this);
            }
        });
});