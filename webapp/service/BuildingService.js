sap.ui.define(["rak/zp02/service/adapter/MockBuildingAdapter"], function (Adapter) {
    "use strict";
    return {
        saveBuildings: function (aBuildings) { return Adapter.saveBuildings(aBuildings); },
        getBuildings:  function ()           { return Adapter.getBuildings();             }
    };
});
