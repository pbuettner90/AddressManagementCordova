sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("AddressManagement.Component", {

        metadata: {
            manifest: "json"
        },

        init:function ()
        {
            UIComponent.prototype.init.apply(this, arguments);

            var model = {
                address: {
                    firstName: "",
                    lastName: "",
                    plz: "",
                    street: "",
                    city: ""
                }
            };

            var oModel = new JSONModel(model);
            this.setModel(oModel);
        }
    });
});



