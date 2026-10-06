sap.ui.define([
    "rak/zp02/service/adapter/MockAttachmentAdapter"
], function (MockAttachmentAdapter) {
    "use strict";

    return {

        // Resolve the set of Appendix 5.6 column type keys that are active
        // given a list of Step 3 building type codes (BT-01 … BT-07).
        // If no buildings exist fall back to PRIVATE_VILLA (most common single-type).
        // FENCE column activated when project contains at least one fence object.
        resolveActiveTypes: function (aBuildings, aFences) {
            return MockAttachmentAdapter.getBuildingTypeMap().then(function (oBtMap) {
                var oSeen = {};
                if (aBuildings && aBuildings.length > 0) {
                    aBuildings.forEach(function (oBuilding) {
                        var sCol = oBtMap[oBuilding.buildingTypeCode];
                        if (sCol) { oSeen[sCol] = true; }
                    });
                } else {
                    oSeen["PRIVATE_VILLA"] = true;
                }
                if (aFences && aFences.length > 0) {
                    oSeen["FENCE"] = true;
                }
                return Object.keys(oSeen);
            });
        },

        // Resolve applicable documents for given active types.
        // Returns array of enriched document objects (register entry + applicability).
        // SYSTEM docs with mock prereq available=true → providingMechanism stays SYSTEM.
        // SYSTEM docs with mock prereq available=false → providingMechanism overridden to UPLOAD.
        // DOC-21 excluded — handled in dedicated Load Cards section of the view.
        resolveApplicableDocuments: function (aActiveTypes) {
            var oSelf = this;
            return Promise.all([
                MockAttachmentAdapter.getDocumentRegister(),
                MockAttachmentAdapter.resolveApplicability(aActiveTypes),
                MockAttachmentAdapter.getPrerequisiteMap()
            ]).then(function (aResults) {
                var aRegister = aResults[0];
                var aApplicability = aResults[1];
                var oPrereqMap = aResults[2];

                var oApplicabilityIndex = {};
                aApplicability.forEach(function (o) {
                    oApplicabilityIndex[o.ref] = o.applicability;
                });

                var oRegisterIndex = {};
                aRegister.forEach(function (o) {
                    oRegisterIndex[o.ref] = o;
                });

                var aDocs = [];
                aApplicability.forEach(function (oItem) {
                    if (oItem.applicability === "—") { return; }
                    var oDoc = oRegisterIndex[oItem.ref];
                    if (!oDoc) { return; }
                    if (oDoc.ref === "DOC-21") { return; } // handled separately

                    var sEffectiveMechanism = oDoc.providingMechanism;
                    if (sEffectiveMechanism === "SYSTEM") {
                        var bAvail = oPrereqMap[oDoc.ref];
                        if (!bAvail) {
                            sEffectiveMechanism = "UPLOAD";
                        }
                    }

                    aDocs.push({
                        ref: oDoc.ref,
                        name: oDoc.name,
                        category: oDoc.category,
                        applicability: oItem.applicability,
                        isMandatory: oItem.applicability === "M",
                        providingMechanism: sEffectiveMechanism,
                        conditionMetadata: oDoc.conditionMetadata,
                        // upload state
                        uploadState: "IDLE",
                        uploadProgress: 0,
                        uploadError: null,
                        fileMeta: null
                    });
                });
                return aDocs;
            });
        },

        // Group a flat array of documents into category sections
        // for rendering as a flat docItems list with CATEGORY header rows.
        // Returns array of { type:"CATEGORY", label, ref } or { type:"DOC", ...doc } entries.
        groupByCategory: function (aDocs) {
            var oGrouped = {};
            var aCategoryOrder = [];
            aDocs.forEach(function (oDoc) {
                if (!oGrouped[oDoc.category]) {
                    oGrouped[oDoc.category] = [];
                    aCategoryOrder.push(oDoc.category);
                }
                oGrouped[oDoc.category].push(oDoc);
            });
            var aItems = [];
            aCategoryOrder.forEach(function (sCat) {
                aItems.push({ type: "CATEGORY", label: sCat });
                oGrouped[sCat].forEach(function (oDoc) {
                    aItems.push(Object.assign({ type: "DOC" }, oDoc));
                });
            });
            return aItems;
        },

        // Return array of refs for mandatory docs that have not been uploaded.
        // Includes DOC-21 check via oLoadCard parameter.
        getMissingMandatoryDocuments: function (aDocs, oLoadCard) {
            var aMissing = [];
            aDocs.forEach(function (oDoc) {
                if (oDoc.type !== "DOC") { return; }
                if (!oDoc.isMandatory) { return; }
                if (oDoc.providingMechanism === "SYSTEM") { return; }
                if (oDoc.uploadState !== "UPLOADED") {
                    aMissing.push(oDoc.ref);
                }
            });
            if (oLoadCard && oLoadCard.uploadState !== "UPLOADED") {
                aMissing.push("DOC-21");
            }
            return aMissing;
        },

        // Start upload simulation for a document slot.
        // Returns interval id for external cleanup.
        simulateUpload: function (progressCb, doneCb) {
            return MockAttachmentAdapter.simulateUpload(progressCb, doneCb);
        },

        // Validate file size and (for DOC-21) extension.
        validateFileMetadata: function (oFileMeta, sDocRef) {
            return MockAttachmentAdapter.validateFileMetadata(oFileMeta, sDocRef);
        }

    };
});
