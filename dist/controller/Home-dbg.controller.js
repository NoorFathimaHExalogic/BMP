sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("rak.zp02.controller.Home", {

        onInit: function () {
        },

        onNavigateToProjectSelection: function () {
            this.getOwnerComponent().getRouter().navTo("project-selection");
        }

    });
});
