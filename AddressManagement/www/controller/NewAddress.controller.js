sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "AddressManagement/model/models"

], function (Controller, models) {
	"use strict";

	return Controller.extend("AddressManagement.controller.NewAddress", {

	    onInit: function ()
        {
            function getPosition(position)
            {
                             
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                nativegeocoder.reverseGeocode(success, failure, latitude, longitude);
            }

            function positionError(error)
            {
                alert("Position Error");
            }

            function success(result)
            {
                models.plz = result.postalCode;
                models.street = result.street + " " + result.houseNumber;
                models.city = result.city;
            }
                             
            function failure(err)
            {
                alert("Reverse Geocoding Error");

            }

            var options = {enableHighAccuracy: true, maximumAge: 3600000};
            navigator.geolocation.getCurrentPosition(getPosition, positionError, options);

        },

        onGetPosition : function()
        {
                             
            this.getView().byId("street").setValue(models.street);
            this.getView().byId("plz").setValue(models.plz);
            this.getView().byId("city").setValue(models.city);
        },

        onAddressCheck : function ()
        {
            this.getRouter().getTargets().display("addresses");
        },

        onShowMap : function()
        {
            var geocoder = new google.maps.Geocoder();

            var city = this.getView().byId("city").getValue();
            var street = this.getView().byId("street").getValue();
            var loc = [];

            geocoder.geocode( { 'address': street + " " + city}, function(results, status)
            {
                if (status == google.maps.GeocoderStatus.OK)
                {
                    loc[0] = results[0].geometry.location.lat();
                    loc[1] = results[0].geometry.location.lng();

                    var eventBus = sap.ui.getCore().getEventBus();
                    eventBus.publish("MapChannel", "onNavigateEvent", loc);
                }

                else
                {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });

            this.getRouter().getTargets().display("showMap");

        },

        onSettingsDialog : function()
        {
            console.log(models.street);
            var oView = this.getView();
            var oDialog = oView.byId("settingsDialog");

            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(oView.getId(), "AddressManagement.view.Settings");
                oView.addDependent(oDialog);
            }

            oDialog.open();
            oView.byId("inpUrl").setValue(localStorage.getItem("url"));


            var swWebservice = this.getView().byId("swWebservice");
            var swState = JSON.parse(localStorage.getItem("swState"));
            swWebservice.setState(swState);

            swWebservice.attachChange(function(oEvent)
            {
                var state = oEvent.getParameter("state");

                if (state == true)
                {
                    localStorage.setItem("url", "http://addressodata20170508023216.azurewebsites.net/odata/");
                    localStorage.setItem("swState", "true");


                }

                else
                {
                    localStorage.setItem("url", "http://10.50.11.132:8082/odata/");
                    localStorage.setItem("swState", "false");


                }

                oView.byId("inpUrl").setValue(localStorage.getItem("url"));
            });

            var btnSave = this.getView().byId("btnSave");
            btnSave.attachPress(function()
            {
                oDialog.close();
            });
        },

        getRouter:function()
        {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
	});
});
