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

    return Controller.extend("rak.zp02.controller.step2.PermitInformation", {

        onInit: function () {
            var oViewModel = new JSONModel({
                activeStep:        2,
                stepLabels:        STEP_LABELS,
                project:           { ownerName: "", projectNumber: "", address: "" },
                showEtisalatNoc:   true,
                showGrantFields:   false,
                civilDefenceAreas: [],
                grantTypes:        [],
                form: {
                    etisalatNocNo:    "",
                    eweNocNo:         "",
                    civilDefenceArea: "",
                    grantProgramIndex: 0,
                    grantType:        "",
                    grantExpiryDate:  ""
                },
                errors: _emptyErrors()
            });

            this.getView().setModel(oViewModel, "view");

            this.getOwnerComponent().getRouter()
                .getRoute("permit-information")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadContext();
            this._loadReferenceData();
        },

        _loadContext: function () {
            var oAppState  = this.getOwnerComponent().getModel("appState");
            var oProject   = oAppState ? oAppState.getProperty("/selectedProject") : null;
            var oViewModel = this.getView().getModel("view");

            if (oProject) {
                oViewModel.setProperty("/project", {
                    ownerName:     oProject.ownerName    || "",
                    projectNumber: oProject.projectNumber || "",
                    address:       oProject.address       || "",
                    projectId:     oProject.projectId     || "",
                    landSector:    oProject.landSector    || null
                });
                // Sector 8 or 9 → Etisalat/Du NOC is not mandatory (hide field)
                var iSector = oProject.landSector;
                var bShow   = !(iSector === 8 || iSector === 9);
                oViewModel.setProperty("/showEtisalatNoc", bShow);

                // Reset form on each entry
                oViewModel.setProperty("/form", {
                    etisalatNocNo:     "",
                    eweNocNo:          "",
                    civilDefenceArea:  "",
                    grantProgramIndex: 0,
                    grantType:         "",
                    grantExpiryDate:   ""
                });
                oViewModel.setProperty("/showGrantFields", false);
                oViewModel.setProperty("/errors", _emptyErrors());
            }
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
            // Clear all error states on any field interaction (re-validate on Next)
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

            // MSG-V01: Etisalat/Du NOC required (only if field is shown)
            if (bShowEtis && !(oForm.etisalatNocNo || "").trim()) {
                oErrors.etisalatNocState = "Error";
                oErrors.etisalatNocMsg   = oBundle.getText("msgV01EtisalatNocRequired");
                bValid = false;
            }

            // MSG-V02: EWE NOC required
            if (!(oForm.eweNocNo || "").trim()) {
                oErrors.eweNocState = "Error";
                oErrors.eweNocMsg   = oBundle.getText("msgV02EweNocRequired");
                bValid = false;
            } else if ((oForm.eweNocNo || "").trim().length !== 14) {
                // MSG-V03: EWE NOC must be exactly 14 characters
                oErrors.eweNocState = "Error";
                oErrors.eweNocMsg   = oBundle.getText("msgV03EweNocFormat");
                bValid = false;
            }

            // MSG-V05: Civil Defence Area required
            if (!(oForm.civilDefenceArea || "").trim()) {
                oErrors.civilDefenceState = "Error";
                oErrors.civilDefenceMsg   = oBundle.getText("msgV05CivilDefenceRequired");
                bValid = false;
            }

            // Grant program conditional validation
            if (bGrant) {
                if (!(oForm.grantType || "").trim()) {
                    oErrors.grantTypeState = "Error";
                    oErrors.grantTypeMsg   = oBundle.getText("msgV06GrantTypeRequired");
                    bValid = false;
                }
                if (!(oForm.grantExpiryDate || "").trim()) {
                    oErrors.grantExpiryState = "Error";
                    oErrors.grantExpiryMsg   = oBundle.getText("msgV07GrantExpiryRequired");
                    bValid = false;
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
