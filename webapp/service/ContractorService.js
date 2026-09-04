sap.ui.define(["rak/zp02/service/adapter/MockContractorAdapter"], function (Adapter) {
    "use strict";
    return {
        findByTradeLicence: function (sLicenceNo) {
            return Adapter.findByTradeLicence(sLicenceNo);
        },
        findByName: function (sName) {
            return Adapter.findByName(sName);
        }
    };
});
