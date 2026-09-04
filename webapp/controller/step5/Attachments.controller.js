sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("rak.zp02.controller.step5.Attachments", {

        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("attachments")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oAppState = this.getOwnerComponent().getModel("appState");
            if (!oAppState || !oAppState.getProperty("/selectedProject")) {
                this.getOwnerComponent().getRouter().navTo("project-selection");
            }
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("business-partners");
        }

    });
});
