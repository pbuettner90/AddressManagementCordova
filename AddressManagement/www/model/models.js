sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function(JSONModel) {
    "use strict";

    return {

        createAddressModel : function()
        {

            var model = {
                address: {
                    id : 0,
                    firstName: "",
                    lastName: "",
                    plz: "",
                    street: "",
                    city: ""
                }
            };

            var oModel = new JSONModel(model);
            return oModel;
        }
    };
});