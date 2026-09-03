sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "rak/zp02/service/ProjectService"
], function (Controller, JSONModel, MessageToast, MessageBox, ProjectService) {
    "use strict";

    var PAGE_SIZE = 5;

    var STEP_LABELS = [
        "Select Project",
        "Permit Information",
        "Fences & Buildings",
        "Business Partners",
        "Attachments",
        "Summary"
    ];

    // ISO date → "Dec 10, 2023"
    function formatDate(sISO) {
        if (!sISO) { return ""; }
        var d = new Date(sISO + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    return Controller.extend("rak.zp02.controller.step1.ProjectSelection", {

        onInit: function () {
            var oViewModel = new JSONModel({
                selectedProjectId: null,
                activeStep: 1,
                stepLabels: STEP_LABELS,
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
                resultCount: 0,
                isDirty: false,
                filters: { role: "", status: "", date: "", search: "" },
                roleOptions: [],
                statusOptions: [],
                dateOptions: [
                    { key: "", text: "Creation Date" },
                    { key: "2024", text: "2024" },
                    { key: "2023", text: "2023" },
                    { key: "2022", text: "2022" }
                ],
                paginationPages: [],
                displayedProjects: [],
                allProjects: []
            });

            this.getView().setModel(oViewModel, "view");

            this.getOwnerComponent().getRouter()
                .getRoute("project-selection")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadData();
        },

        _loadData: function () {
            var oModel = this.getView().getModel("view");
            Promise.all([
                ProjectService.getProjects(),
                ProjectService.getFilterOptions()
            ]).then(function (results) {
                var aAll  = results[0];
                var oOpts = results[1];
                oModel.setProperty("/allProjects",  aAll);
                oModel.setProperty("/totalCount",   aAll.length);
                oModel.setProperty("/statusOptions", oOpts.statusOptions);
                oModel.setProperty("/roleOptions",   oOpts.roleOptions);
                this._applyFilters();
            }.bind(this)).catch(function (err) {
                MessageToast.show("Error loading projects: " + err.message);
            });
        },

        _applyFilters: function () {
            var oModel    = this.getView().getModel("view");
            var oFilters  = oModel.getProperty("/filters");
            var aAll      = oModel.getProperty("/allProjects");
            var aFiltered = ProjectService.filterProjects(aAll, oFilters);
            var iTotal    = aFiltered.length;
            var iPage     = oModel.getProperty("/currentPage");
            var iMaxPage  = Math.max(1, Math.ceil(iTotal / PAGE_SIZE));

            if (iPage > iMaxPage) {
                iPage = 1;
                oModel.setProperty("/currentPage", 1);
            }

            var aPage = ProjectService.paginatePage(aFiltered, iPage, PAGE_SIZE).map(function (p) {
                return Object.assign({}, p, { createdOnDisplay: formatDate(p.createdOn) });
            });

            oModel.setProperty("/resultCount",     iTotal);
            oModel.setProperty("/totalPages",      iMaxPage);
            oModel.setProperty("/displayedProjects", aPage);
            oModel.setProperty("/paginationPages", this._buildPaginationPages(iPage, iMaxPage));

            // Clear selection when page changes and selected project not on current page
            var sSelected = oModel.getProperty("/selectedProjectId");
            if (sSelected) {
                var bOnPage = aPage.some(function (p) { return p.projectId === sSelected; });
                if (!bOnPage) {
                    oModel.setProperty("/selectedProjectId", null);
                    this._clearCardSelection();
                }
            }
        },

        _buildPaginationPages: function (iPage, iMaxPage) {
            var aPages = [];
            for (var i = 1; i <= iMaxPage; i++) {
                aPages.push({ num: i, active: i === iPage });
            }
            return aPages;
        },

        /* ── Filter handlers ────────────────────────────────────────── */

        onFilterChange: function () {
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/filters/role",   this.byId("selRole")   ? this.byId("selRole").getSelectedKey()   : "");
            oModel.setProperty("/filters/status", this.byId("selStatus") ? this.byId("selStatus").getSelectedKey() : "");
            oModel.setProperty("/filters/date",   this.byId("selDate")   ? this.byId("selDate").getSelectedKey()   : "");
            oModel.setProperty("/currentPage", 1);
            this._applyFilters();
        },

        onSearch: function (oEvent) {
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/filters/search", oEvent.getParameter("query") || "");
            oModel.setProperty("/currentPage", 1);
            this._applyFilters();
        },

        onSearchLiveChange: function (oEvent) {
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/filters/search", oEvent.getParameter("newValue") || "");
            oModel.setProperty("/currentPage", 1);
            this._applyFilters();
        },

        /* ── Card press ─────────────────────────────────────────────── */

        onCardPress: function (oEvent) {
            var oSource  = oEvent.getSource();
            var oCtx     = oSource.getBindingContext("view");
            if (!oCtx) { return; }
            var oProject = oCtx.getObject();
            if (!oProject) { return; }

            // MSG-C09: Blocked parcel
            if (oProject.isBlocked) {
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                MessageBox.error(oBundle.getText("msgC09BlockedParcel"), {
                    title: oBundle.getText("msgC09BlockedParcelTitle")
                });
                return;
            }

            var oModel   = this.getView().getModel("view");
            var sCurrent = oModel.getProperty("/selectedProjectId");
            this._clearCardSelection();

            if (sCurrent === oProject.projectId) {
                oModel.setProperty("/selectedProjectId", null);
            } else {
                oModel.setProperty("/selectedProjectId", oProject.projectId);
                oSource.addStyleClass("rakCardSelected");
                oModel.setProperty("/isDirty", true);
            }
        },

        _clearCardSelection: function () {
            var oList = this.byId("projectList");
            if (oList) {
                oList.getItems().forEach(function (item) {
                    item.removeStyleClass("rakCardSelected");
                });
            }
        },

        /* ── Full Details ───────────────────────────────────────────── */

        onFullDetails: function (oEvent) {
            oEvent.stopPropagation && oEvent.stopPropagation();
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageBox.information(oBundle.getText("fullDetailsPlaceholder"), {
                title: oBundle.getText("fullDetailsTitle")
            });
        },

        /* ── Save as Draft — MSG-C03 ────────────────────────────────── */

        onSaveAsDraft: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageToast.show(oBundle.getText("msgC03SaveDraftSuccess"));
            this.getView().getModel("view").setProperty("/isDirty", false);
        },

        /* ── Delete — MSG-C01 ───────────────────────────────────────── */

        onDelete: function () {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            MessageBox.confirm(oBundle.getText("msgC01DeleteConfirm"), {
                title: oBundle.getText("msgC01DeleteConfirmTitle"),
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.CANCEL,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        MessageToast.show("Application deleted.");
                    }
                }
            });
        },

        /* ── Next ───────────────────────────────────────────────────── */

        onNext: function () {
            var sId = this.getView().getModel("view").getProperty("/selectedProjectId");
            if (!sId) {
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                MessageToast.show(oBundle.getText("step1SelectionRequired"));
                return;
            }
            this.getOwnerComponent().getRouter().navTo("permit-information");
        },

        /* ── Pagination handlers (no global references) ─────────────── */

        onPageFirst: function () {
            this._goToPage(1);
        },

        onPagePrev: function () {
            var iCurrent = this.getView().getModel("view").getProperty("/currentPage");
            if (iCurrent > 1) { this._goToPage(iCurrent - 1); }
        },

        onPageNext: function () {
            var oModel    = this.getView().getModel("view");
            var iCurrent  = oModel.getProperty("/currentPage");
            var iMaxPage  = oModel.getProperty("/totalPages");
            if (iCurrent < iMaxPage) { this._goToPage(iCurrent + 1); }
        },

        onPageLast: function () {
            this._goToPage(this.getView().getModel("view").getProperty("/totalPages"));
        },

        onPageNumPress: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("view");
            if (!oCtx) { return; }
            this._goToPage(oCtx.getProperty("num"));
        },

        _goToPage: function (iPage) {
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/currentPage", iPage);
            this._applyFilters();
        },

        /* ── Formatter ──────────────────────────────────────────────── */

        formatResultCount: function (iResult, iTotal) {
            if (iResult === undefined || iResult === null) { return ""; }
            return iResult + " of " + (iTotal || 0) + " Projects found";
        }

    });
});
