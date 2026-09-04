sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "rak/zp02/service/ReferenceDataService",
    "rak/zp02/service/PermitService"
], function (Controller, JSONModel, MessageToast, MessageBox, ReferenceDataService, PermitService) {
    "use strict";

    var STEP_LABELS = [
        "Select Project",
        "Permit Information",
        "Fences & Buildings",
        "Business Partners",
        "Attachments",
        "Summary"
    ];

    function _emptyErrors() {
        return {
            etisalatNocState:  "None",
            etisalatNocMsg:    "",
            eweNocState:       "None",
            eweNocMsg:         "",
            civilDefenceState: "None",
            civilDefenceMsg:   "",
            grantTypeState:    "None",
            grantTypeMsg:      "",
            grantExpiryState:  "None",
            grantExpiryMsg:    ""
        };
    }

    function _emptyForm() {
        return {
            etisalatNocNo:     "",
            eweNocNo:          "",
            civilDefenceArea:  "",
            grantProgramIndex: 0,
            grantType:         "",
            grantExpiryDate:   ""
        };
    }

    return Controller.extend("rak.zp02.controller.step2.PermitInformation", {

        onInit: function () {
            var oViewModel = new JSONModel({
                activeStep:        2,
                stepLabels:        STEP_LABELS,
                project:           { ownerName: "", projectNumber: "", address: "", projectId: "", landSector: null },
                showEtisalatNoc:   true,
                showGrantFields:   false,
                civilDefenceAreas: [],
                grantTypes:        [],
                form:              _emptyForm(),
                errors:            _emptyErrors()
            });

            this.getView().setModel(oViewModel, "view");

            this.getOwnerComponent().getRouter()
                .getRoute("permit-information")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oAppState = this.getOwnerComponent().getModel("appState");
            var oProject  = oAppState ? oAppState.getProperty("/selectedProject") : null;

            // Guard: no project selected → redirect to Step 1
            if (!oProject) {
                this.getOwnerComponent().getRouter().navTo("project-selection");
                return;
            }

            this._loadContext(oProject);
            this._loadReferenceData();
        },

        _loadContext: function (oProject) {
            var oViewModel = this.getView().getModel("view");

            oViewModel.setProperty("/project", {
                ownerName:     oProject.ownerName     || "",
                projectNumber: oProject.projectNumber || "",
                address:       oProject.address       || "",
                projectId:     oProject.projectId     || "",
                landSector:    oProject.landSector != null ? oProject.landSector : null
            });

            // Sector 8 or 9 → Etisalat/Du NOC not mandatory — hide field
            var vSector = oProject.landSector;
            var bShow   = !(vSector === 8 || vSector === 9 || vSector === "8" || vSector === "9");
            oViewModel.setProperty("/showEtisalatNoc", bShow);

            // Reset form and errors on each entry
            oViewModel.setProperty("/form",          _emptyForm());
            oViewModel.setProperty("/showGrantFields", false);
            oViewModel.setProperty("/errors",         _emptyErrors());
        },

        _loadReferenceData: function () {
            var oViewModel = this.getView().getModel("view");
            Promise.all([
                ReferenceDataService.getCivilDefenceAreas(),
                ReferenceDataService.getGrantTypes()
            ]).then(function (results) {
                oViewModel.setProperty("/civilDefenceAreas", results[0]);
                oViewModel.setProperty("/grantTypes",        results[1]);
            }).catch(function (err) {
                MessageToast.show("Error loading reference data: " + err.message);
            });
        },

        /* ── Grant Program toggle ─────────────────────────────────── */

        onGrantProgramChange: function (oEvent) {
            var iIndex     = oEvent.getParameter("selectedIndex");
            var bGrant     = iIndex === 1;
            var oViewModel = this.getView().getModel("view");
            oViewModel.setProperty("/showGrantFields", bGrant);
            if (!bGrant) {
                oViewModel.setProperty("/form/grantType",       "");
                oViewModel.setProperty("/form/grantExpiryDate", "");
                oViewModel.setProperty("/errors/grantTypeState",   "None");
                oViewModel.setProperty("/errors/grantTypeMsg",     "");
                oViewModel.setProperty("/errors/grantExpiryState", "None");
                oViewModel.setProperty("/errors/grantExpiryMsg",   "");
            }
        },

        /* ── Live clear on field change ───────────────────────────── */

        onFieldChange: function () {
            this.getView().getModel("view").setProperty("/errors", _emptyErrors());
        },

        /* ── Validate ─────────────────────────────────────────────── */

        _validate: function () {
            var oViewModel = this.getView().getModel("view");
            var oForm      = oViewModel.getProperty("/form");
            var bGrant     = oViewModel.getProperty("/showGrantFields");
            var bShowEtis  = oViewModel.getProperty("/showEtisalatNoc");
            var oBundle    = this.getView().getModel("i18n").getResourceBundle();
            var oErrors    = _emptyErrors();
            var bValid     = true;

            // MSG-V01: Etisalat/Du NOC required (only for non-sector-8/9 land)
            if (bShowEtis && !(oForm.etisalatNocNo || "").trim()) {
                oErrors.etisalatNocState = "Error";
                oErrors.etisalatNocMsg   = oBundle.getText("msgV01EtisalatNocRequired");
                bValid = false;
            }

            // EWE NOC: required (MSG-V02), then format (MSG-V03)
            var sEwe = (oForm.eweNocNo || "").trim();
            if (!sEwe) {
                oErrors.eweNocState = "Error";
                oErrors.eweNocMsg   = oBundle.getText("msgV02Required");
                bValid = false;
            } else if (sEwe.length !== 14) {
                oErrors.eweNocState = "Error";
                oErrors.eweNocMsg   = oBundle.getText("msgV03EweNocFormat");
                bValid = false;
            }

            // Civil Defence Area required (MSG-V02)
            if (!(oForm.civilDefenceArea || "").trim()) {
                oErrors.civilDefenceState = "Error";
                oErrors.civilDefenceMsg   = oBundle.getText("msgV02Required");
                bValid = false;
            }

            // Grant program conditional validation
            if (bGrant) {
                // Grant Type required (MSG-V02)
                if (!(oForm.grantType || "").trim()) {
                    oErrors.grantTypeState = "Error";
                    oErrors.grantTypeMsg   = oBundle.getText("msgV02Required");
                    bValid = false;
                }

                // Program Expiry Date: required + must not be in the past (MSG-V05)
                var sExpiry = (oForm.grantExpiryDate || "").trim();
                if (!sExpiry) {
                    oErrors.grantExpiryState = "Error";
                    oErrors.grantExpiryMsg   = oBundle.getText("msgV02Required");
                    bValid = false;
                } else {
                    var dExpiry = new Date(sExpiry + "T00:00:00");
                    var dToday  = new Date();
                    dToday.setHours(0, 0, 0, 0);
                    if (isNaN(dExpiry.getTime()) || dExpiry < dToday) {
                        oErrors.grantExpiryState = "Error";
                        oErrors.grantExpiryMsg   = oBundle.getText("msgV05InvalidDate");
                        bValid = false;
                    }
                }
            }

            oViewModel.setProperty("/errors", oErrors);
            return bValid;
        },

        /* ── Save as Draft — MSG-C03 ──────────────────────────────── */

        onSaveAsDraft: function () {
            var oBundle    = this.getView().getModel("i18n").getResourceBundle();
            var oViewModel = this.getView().getModel("view");
            var oProject   = oViewModel.getProperty("/project");
            var oForm      = oViewModel.getProperty("/form");
            PermitService.saveDraft(Object.assign({ projectId: oProject.projectId }, oForm)).then(function () {
                MessageToast.show(oBundle.getText("msgC03SaveDraftSuccess"));
            });
        },

        /* ── Delete — MSG-C01 ─────────────────────────────────────── */

        onDelete: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageBox.confirm(oBundle.getText("msgC01DeleteConfirm"), {
                title:            oBundle.getText("msgC01DeleteConfirmTitle"),
                actions:          [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.CANCEL,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        MessageToast.show("Application deleted.");
                    }
                }
            });
        },

        /* ── Back: return to Step 1 ───────────────────────────────── */

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("project-selection");
        },

        /* ── Next: validate then navigate to Step 3 placeholder ───── */

        onNext: function () {
            if (!this._validate()) {
                return;
            }
            this.getOwnerComponent().getRouter().navTo("fences-buildings");
        }

    });
});
