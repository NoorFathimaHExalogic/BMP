sap.ui.define(["rak/zp02/service/adapter/MockReferenceDataAdapter"], function (Adapter) {
    "use strict";
    return {
        getCivilDefenceAreas: function () { return Adapter.getCivilDefenceAreas(); },
        getGrantTypes:        function () { return Adapter.getGrantTypes(); }
    };
});
