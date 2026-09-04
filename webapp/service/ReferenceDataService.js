sap.ui.define(["rak/zp02/service/adapter/MockReferenceDataAdapter"], function (Adapter) {
    "use strict";
    return {
        getCivilDefenceAreas: function ()                  { return Adapter.getCivilDefenceAreas();               },
        getGrantTypes:        function ()                  { return Adapter.getGrantTypes();                       },
        getBuildingTypes:     function ()                  { return Adapter.getBuildingTypes();                    },
        getUsageTypes:        function (sBuildingTypeCode) { return Adapter.getUsageTypes(sBuildingTypeCode);      },
        getBuildingShapes:    function ()                  { return Adapter.getBuildingShapes();                   },
        getFoundationTypes:   function ()                  { return Adapter.getFoundationTypes();                  },
        getSlabSystems:       function ()                  { return Adapter.getSlabSystems();                      },
        getFenceTypes:        function ()                  { return Adapter.getFenceTypes();                       }
    };
});
