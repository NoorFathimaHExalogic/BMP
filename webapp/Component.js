sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "rak/zp02/model/models"
], function (UIComponent, Device, JSONModel, models) {
    "use strict";

    return UIComponent.extend("rak.zp02.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            this.setModel(models.createDeviceModel(), "device");

            // Shared application state across steps
            this.setModel(new JSONModel({
                selectedProject: null,
                step4: {
                    engineers:         [],
                    contractor:        null,
                    eweConsultant:     null,
                    eweSameAsApplicant: false
                }
            }), "appState");

            this.getRouter().initialize();
        },

        destroy: function () {
            UIComponent.prototype.destroy.apply(this, arguments);
        },

        getContentDensityClass: function () {
            if (!this._sContentDensityClass) {
                if (Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCozy";
                } else {
                    this._sContentDensityClass = "sapUiSizeCompact";
                }
            }
            return this._sContentDensityClass;
        }

    });
});
