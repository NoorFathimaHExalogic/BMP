sap.ui.define(["rak/zp02/service/adapter/MockEweConsultantAdapter"], function (Adapter) {
    "use strict";
    return {
        search: function (sQuery) {
            return Adapter.search(sQuery);
        },
        getApplicantAsConsultant: function () {
            return Adapter.getApplicantAsConsultant();
        }
    };
});
