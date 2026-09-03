sap.ui.define(["rak/zp02/service/adapter/MockPermitAdapter"], function (Adapter) {
    "use strict";
    return {
        saveDraft: function (oPermitData) { return Adapter.saveDraft(oPermitData); },
        getDraft:  function (sProjectId)  { return Adapter.getDraft(sProjectId);  }
    };
});
