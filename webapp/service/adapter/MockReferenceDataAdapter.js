sap.ui.define([], function () {
    "use strict";

    var _cache = null;

    function _load() {
        if (_cache) { return Promise.resolve(_cache); }
        return new Promise(function (resolve, reject) {
            var sUrl = sap.ui.require.toUrl("rak/zp02/model/mock/referenceData.json");
            jQuery.ajax({
                url: sUrl,
                dataType: "json",
                success: function (data) { _cache = data; resolve(data); },
                error:   function (xhr, s, e) { reject(new Error(e || s)); }
            });
        });
    }

    return {
        getCivilDefenceAreas: function () {
            return _load().then(function (d) { return d.civilDefenceAreas || []; });
        },
        getGrantTypes: function () {
            return _load().then(function (d) { return d.grantTypes || []; });
        }
    };
});
