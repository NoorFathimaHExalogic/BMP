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
                applicant: {
                    name: "Ahmad Al-Rashidi"
                },
                step2: null,
                step3: {
                    buildings: [],
                    fences: []
                },
                step4: {
                    engineers:         [],
                    contractor:        null,
                    eweConsultant:     null,
                    eweSameAsApplicant: false
                },
                step5: null,
                step6: null,
                step7: {
                    selectedPaymentMethod: null,
                    paymentStatus: "IDLE"
                },
                step8: {
                    requestId:   null,
                    buildingIds: [],
                    fenceIds:    [],
                    generatedAt: null
                },
                step9: {
                    groups: {
                        drawings:   { comment: "", files: [], status: "DRAFT" },
                        barjeel:    { comment: "", files: [], status: "DRAFT" },
                        structural: { comment: "", files: [], status: "DRAFT" }
                    }
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
