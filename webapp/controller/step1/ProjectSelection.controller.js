sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("rak.zp02.controller.step1.ProjectSelection", {

        onInit: function () {
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("home");
        }

    });
});
