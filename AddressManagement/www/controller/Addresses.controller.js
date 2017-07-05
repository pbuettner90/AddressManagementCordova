sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], function(Controller, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("AddressManagement.controller.Addresses", {

        onBeforeRendering: function()
        {
            //WebService URL extern: http://addressodata20170508023216.azurewebsites.net/odata/
            //WebService URL intern: http://10.50.11.132:8082/odata

            sap.ui.core.BusyIndicator.show(10);
            var url = localStorage.getItem("url");
            console.log(url);

            var oModel = new sap.ui.model.odata.v4.ODataModel({
                groupId: "$direct",
                synchronizationMode: "None",
                serviceUrl: url
            });

            this.getView().setModel(oModel, "webservice");
            sap.ui.getCore().setModel(oModel, "webservice");

            this.getView().byId("addressList").getBinding("items").attachDataReceived(function()
            {
                sap.ui.core.BusyIndicator.hide();
            });
        },

        sortAddresses: function()
        {
            var model = this.getView().getModel();
            var firstName = model.getProperty("/address/firstName");
            var lastName = model.getProperty("/address/lastName");

            var oFilterFirstName = new Filter("FirstName", FilterOperator.EQ, firstName);
            var oFilterLastName = new Filter("LastName", FilterOperator.EQ, lastName);

            var allFilter = new sap.ui.model.Filter([oFilterFirstName, oFilterLastName], false);

            var oElement = this.getView().byId("addressList");
            var oBinding = oElement.getBinding("items");
            oBinding.filter([allFilter]);

            var table = this.getView().byId("addressList");
            //table.getBinding("items").sort([new sap.ui.model.Sorter("City", null, null), new sap.ui.model.Sorter("Street", null, null)]);
            table.getBinding("items").sort(new sap.ui.model.Sorter("City", null, null));
        },

        createAddress: function()
        {
            var oView = this.getView();
            var oDialog = oView.byId("newAddressDialog");

            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(oView.getId(), "AddressManagement.view.AddNewAddress");
                oView.addDependent(oDialog);
            }

            oDialog.open();

            var btnSave = this.getView().byId("btnSave");
            btnSave.attachPress(function()
            {
                var oContext = oView.byId("addressList").getBinding("items").create({
                    "FirstName": oView.getModel().getProperty("/address/firstName"),
                    "LastName": oView.getModel().getProperty("/address/lastName"),
                    "Street": oView.getModel().getProperty("/address/street"),
                    "City": oView.getModel().getProperty("/address/city"),
                    "Plz": oView.getModel().getProperty("/address/plz")
                });

                oDialog.close();
            });

            var btnClose = this.getView().byId("btnClose");
            btnClose.attachPress(function()
            {
                oDialog.close();
            });
        },

        rowSelectionChanged: function(oEvent)
        {
            var context = oEvent.getParameter("listItem").getBindingContext("webservice");
            this.getRouter().getTargets().display("editAddress");
            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.publish("AddressChannel", "onNavigateEvent", context);
        },

        OnSearch: function(oEvent)
        {
            var data = oEvent.getSource().getValue();

            var oFilterFirstName = new Filter("FirstName", FilterOperator.Contains, data);
            var oFilterLastName = new Filter("LastName", FilterOperator.Contains, data);
            var oFilterStreet = new Filter("Street", FilterOperator.Contains, data);
            var oFilterCity = new Filter("City", FilterOperator.Contains, data);
            var oFilterPlz = new Filter("Plz", FilterOperator.Contains, data);

            var allFilter = new sap.ui.model.Filter([
                oFilterFirstName,
                oFilterLastName,
                oFilterStreet,
                oFilterCity,
                oFilterPlz
            ], false);

            var oElement = this.getView().byId("addressList");
            var oBinding = oElement.getBinding("items");
            oBinding.filter([allFilter]);
        },

        onMatchAddress: function(e)
        {
            var context = e.getSource().getBindingContext("webservice");
            var id = context.getProperty("Id");
            alert(id);
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