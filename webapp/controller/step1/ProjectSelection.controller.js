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

    return Controller.extend("rak.zp02.controller.step1.ProjectSelection", {

        onInit: function () {
            window._rakStep1Ctrl = this;
            var oViewModel = new JSONModel({
                selectedProjectId: null,
                currentPage: 1,
                resultCount: 0,
                filters: { role: "", status: "", date: "", search: "" },
                roleOptions: [],
                statusOptions: [],
                dateOptions: [
                    { key: "", text: "All Dates" },
                    { key: "2024", text: "2024" },
                    { key: "2023", text: "2023" },
                    { key: "2022", text: "2022" }
                ],
                displayedProjects: [],
                allProjects: [],
                permitHeadingHtml: this._buildPermitHeadingHtml(),
                stepperHtml: this._buildStepperHtml(1),
                sectionHeaderHtml: this._buildSectionHeaderHtml(),
                paginationHtml: ""
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
                var aAll = results[0];
                var oOpts = results[1];
                oModel.setProperty("/allProjects", aAll);
                oModel.setProperty("/statusOptions", oOpts.statusOptions);
                oModel.setProperty("/roleOptions", oOpts.roleOptions);
                this._applyFilters();
            }.bind(this)).catch(function (err) {
                MessageToast.show("Error loading projects: " + err.message);
            });
        },

        _applyFilters: function () {
            var oModel = this.getView().getModel("view");
            var oFilters = oModel.getProperty("/filters");
            var aAll = oModel.getProperty("/allProjects");
            var aFiltered = ProjectService.filterProjects(aAll, oFilters);
            var iTotal = aFiltered.length;
            var iPage = oModel.getProperty("/currentPage");
            var iMaxPage = Math.max(1, Math.ceil(iTotal / PAGE_SIZE));
            if (iPage > iMaxPage) { iPage = 1; oModel.setProperty("/currentPage", 1); }
            var aPage = ProjectService.paginatePage(aFiltered, iPage, PAGE_SIZE);

            oModel.setProperty("/resultCount", iTotal);
            oModel.setProperty("/displayedProjects", aPage);
            oModel.setProperty("/paginationHtml",
                this._buildPaginationHtml(iPage, iMaxPage, iTotal));
        },

        onFilterChange: function () {
            var oModel = this.getView().getModel("view");
            var oSelRole   = this.byId("selRole");
            var oSelStatus = this.byId("selStatus");
            var oSelDate   = this.byId("selDate");
            oModel.setProperty("/filters/role",   oSelRole   ? oSelRole.getSelectedKey()   : "");
            oModel.setProperty("/filters/status", oSelStatus ? oSelStatus.getSelectedKey() : "");
            oModel.setProperty("/filters/date",   oSelDate   ? oSelDate.getSelectedKey()   : "");
            oModel.setProperty("/currentPage", 1);
            this._applyFilters();
        },

        onSearch: function (oEvent) {
            var sVal = oEvent.getParameter("query") || "";
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/filters/search", sVal);
            oModel.setProperty("/currentPage", 1);
            this._applyFilters();
        },

        onSearchLiveChange: function (oEvent) {
            var sVal = oEvent.getParameter("newValue") || "";
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/filters/search", sVal);
            oModel.setProperty("/currentPage", 1);
            this._applyFilters();
        },

        onCardPress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext("view");
            if (!oCtx) { return; }
            var oProject = oCtx.getObject();
            if (!oProject || !oProject.selectable) { return; }

            var oModel = this.getView().getModel("view");
            var sCurrent = oModel.getProperty("/selectedProjectId");

            // Remove selection class from all items
            var oList = this.byId("projectList");
            if (oList) {
                oList.getItems().forEach(function (item) {
                    item.removeStyleClass("rakCardSelected");
                });
            }

            if (sCurrent === oProject.projectId) {
                oModel.setProperty("/selectedProjectId", null);
            } else {
                oModel.setProperty("/selectedProjectId", oProject.projectId);
                oSource.addStyleClass("rakCardSelected");
            }
        },

        onFullDetails: function (oEvent) {
            oEvent.stopPropagation && oEvent.stopPropagation();
            MessageToast.show("Full Details — not available in mock mode.");
        },

        onSaveAsDraft: function () {
            MessageToast.show("Draft saved successfully.");
        },

        onDelete: function () {
            MessageBox.confirm("Are you sure you want to delete this application?", {
                title: "Confirm Delete",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.CANCEL,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        MessageToast.show("Application deleted.");
                    }
                }
            });
        },

        onNext: function () {
            var sId = this.getView().getModel("view").getProperty("/selectedProjectId");
            if (!sId) {
                MessageToast.show("Please select a project to continue.");
                return;
            }
            this.getOwnerComponent().getRouter().navTo("permit-information");
        },

        onPaginate: function (iPage) {
            var oModel = this.getView().getModel("view");
            oModel.setProperty("/currentPage", iPage);
            this._applyFilters();
        },

        /* ── HTML builders ──────────────────────────────────────────────── */

        _buildPermitHeadingHtml: function () {
            return "<div class='rakContent rakPermitHeading'>" +
                "<div class='rakPermitHeading__left'>" +
                "<img class='rakPermitHeading__icon' src='assets/figma/step1/icon-permit-muni-30.svg' alt='' />" +
                "<h2 class='rakPermitHeading__title'>New Building Permit</h2>" +
                "</div>" +
                "<div class='rakPermitHeading__actions'>" +
                "<button class='rakPermitHeading__action-btn' onclick=\"window._rakStep1Ctrl.onSaveAsDraft()\">" +
                "<img src='assets/figma/step1/icon-20px-a.svg' alt='' />Save as Draft</button>" +
                "<button class='rakPermitHeading__action-btn' onclick=\"window._rakStep1Ctrl.onDelete()\">" +
                "<img src='assets/figma/step1/icon-20px-b.svg' alt='' />Delete</button>" +
                "</div></div>";
        },

        _buildStepperHtml: function (iActiveStep) {
            var aStepNums = [1, 2, 3, 4, 5, 6];
            var sHtml = "<div class='rakContent' style='padding-top:8px;padding-bottom:4px;'>" +
                        "<div class='rakStepper' style='display:flex;align-items:flex-start;width:100%;'>";

            aStepNums.forEach(function (iStep, idx) {
                var sCircleClass = iStep === iActiveStep
                    ? "rakStepper__circle rakStepper__circle--active"
                    : "rakStepper__circle rakStepper__circle--inactive";
                var sLabelClass = iStep === iActiveStep
                    ? "rakStepper__label rakStepper__label--active"
                    : "rakStepper__label";
                var sLabel = STEP_LABELS[iStep - 1] || ("Step " + iStep);

                sHtml += "<div class='rakStepper__item' style='display:flex;flex-direction:column;align-items:center;flex-shrink:0;'>" +
                    "<div class='" + sCircleClass + "' style='width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:500;box-sizing:border-box;" +
                    (iStep === iActiveStep ? "background:#bf1313;color:#fff;" : "background:#fff;border:1px solid #616161;color:#616161;") + "'>" + iStep + "</div>" +
                    "<div class='" + sLabelClass + "' style='margin-top:6px;font-size:11px;text-align:center;max-width:72px;line-height:1.3;" +
                    (iStep === iActiveStep ? "color:#bf1313;font-weight:500;" : "color:#616161;") + "'>" + sLabel + "</div>" +
                    "</div>";

                if (idx < aStepNums.length - 1) {
                    sHtml += "<div class='rakStepper__connector' style='flex:1;height:1px;background:#dbdcdd;margin-top:15px;min-width:16px;'></div>";
                }
            });

            // "2 More steps" indicator
            sHtml += "<div class='rakStepper__connector' style='flex:1;height:1px;background:#dbdcdd;margin-top:15px;min-width:16px;'></div>" +
                "<div class='rakStepper__item' style='display:flex;flex-direction:column;align-items:center;flex-shrink:0;'>" +
                "<div style='width:30px;height:30px;border-radius:50%;background:#fff;border:1px solid #10233e;display:flex;align-items:center;justify-content:center;box-sizing:border-box;'>" +
                "<img src='assets/figma/step1/icon-right-arrow.svg' alt='more' style='width:14px;height:14px' />" +
                "</div>" +
                "<div style='margin-top:6px;font-size:11px;text-align:center;max-width:72px;line-height:1.3;color:#10233e;'>2 More<br>steps</div>" +
                "</div>";

            sHtml += "</div></div>";
            return sHtml;
        },

        _buildSectionHeaderHtml: function () {
            return "<div class='rakContent' style='background:#fff;border-radius:6px;padding:24px 24px 0;margin-bottom:0'>" +
                "<h3 class='rakSection__title'>Select Project</h3>" +
                "<p class='rakSection__desc'>Select the project for which you want to apply for a building permit. " +
                "You may only select projects where you are listed as the owner or authorized agent.</p>" +
                "</div>";
        },

        _buildPaginationHtml: function (iPage, iMaxPage, iTotal) {
            if (iTotal === 0) { return ""; }

            var sCtrl = "window._rakStep1Ctrl";
            var sDisFirst = iPage === 1 ? " rakPagination__btn--disabled" : "";
            var sDisLast  = iPage === iMaxPage ? " rakPagination__btn--disabled" : "";

            var sHtml = "<div class='rakPagination'>" +
                "<button class='rakPagination__btn" + sDisFirst + "'" +
                (iPage > 1 ? " onclick=\"" + sCtrl + ".onPaginate(1)\"" : "") + ">" +
                "<img src='assets/figma/step1/icon-pagination-first.svg' alt='First' /></button>" +
                "<button class='rakPagination__btn" + sDisFirst + "'" +
                (iPage > 1 ? " onclick=\"" + sCtrl + ".onPaginate(" + (iPage - 1) + ")\"" : "") + ">" +
                "&lt;</button>";

            for (var i = 1; i <= iMaxPage; i++) {
                var sActive = i === iPage ? " rakPagination__btn--active" : "";
                sHtml += "<button class='rakPagination__btn" + sActive + "'" +
                    " onclick=\"" + sCtrl + ".onPaginate(" + i + ")\">" + i + "</button>";
            }

            sHtml += "<button class='rakPagination__btn" + sDisLast + "'" +
                (iPage < iMaxPage ? " onclick=\"" + sCtrl + ".onPaginate(" + (iPage + 1) + ")\"" : "") + ">" +
                "&gt;</button>" +
                "<button class='rakPagination__btn" + sDisLast + "'" +
                (iPage < iMaxPage ? " onclick=\"" + sCtrl + ".onPaginate(" + iMaxPage + ")\"" : "") + ">" +
                "<img src='assets/figma/step1/icon-pagination-last.svg' alt='Last' /></button>" +
                "</div>";

            return sHtml;
        }

    });
});
