sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
    "use strict";

    var _cache = null;

    function _load() {
        if (_cache) {
            return _cache;
        }
        _cache = new Promise(function (resolve, reject) {
            var oModel = new JSONModel();
            oModel.loadData(sap.ui.require.toUrl("rak/zp02/model/mock/projects.json"), null, false);
            var oData = oModel.getData();
            if (oData && oData.projects) {
                resolve(oData);
            } else {
                reject(new Error("MockProjectAdapter: failed to load projects.json"));
            }
        });
        return _cache;
    }

    return {
        getProjects: function () {
            return _load().then(function (d) { return d.projects; });
        },
        getStatusOptions: function () {
            return _load().then(function (d) { return d.statusOptions; });
        },
        getRoleOptions: function () {
            return _load().then(function (d) { return d.roleOptions; });
        }
    };
});
