sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "rak/zp02/model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("rak.zp02.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            this.setModel(models.createDeviceModel(), "device");

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
