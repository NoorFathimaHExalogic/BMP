sap.ui.define(["rak/zp02/service/adapter/MockFenceAdapter"], function (Adapter) {
    "use strict";
    return {
        saveFences: function (aFences) { return Adapter.saveFences(aFences); },
        getFences:  function ()        { return Adapter.getFences();          }
    };
});
