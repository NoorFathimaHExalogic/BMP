sap.ui.define(["sap/ui/core/Control"], function (Control) {
    "use strict";

    return Control.extend("rak.zp02.control.RakStepper", {

        metadata: {
            properties: {
                activeStep:  { type: "int",      defaultValue: 1  },
                stepLabels:  { type: "string[]", defaultValue: [] },
                extraSteps:  { type: "int",      defaultValue: 0  }
            },
            events: {}
        },

        renderer: {
            apiVersion: 2,

            render: function (oRm, oCtrl) {
                var iActive  = oCtrl.getActiveStep();
                var aLabels  = oCtrl.getStepLabels();
                var iExtra   = oCtrl.getExtraSteps();

                oRm.openStart("div", oCtrl);
                oRm.class("rakStepper");
                oRm.attr("role", "list");
                oRm.attr("aria-label", "Application progress");
                oRm.openEnd();

                aLabels.forEach(function (sLabel, idx) {
                    var iStep      = idx + 1;
                    var bActive    = iStep === iActive;
                    var bCompleted = iStep < iActive;

                    if (idx > 0) {
                        oRm.openStart("div");
                        oRm.class("rakStepper__connector");
                        oRm.attr("aria-hidden", "true");
                        oRm.openEnd();
                        oRm.close("div");
                    }

                    oRm.openStart("div");
                    oRm.class("rakStepper__item");
                    oRm.attr("role", "listitem");
                    if (bActive)    oRm.attr("aria-current", "step");
                    if (bCompleted) oRm.attr("aria-label", sLabel + " (completed)");
                    oRm.openEnd();

                    // circle
                    oRm.openStart("div");
                    oRm.class("rakStepper__circle");
                    if (bActive)         oRm.class("rakStepper__circle--active");
                    else if (bCompleted) oRm.class("rakStepper__circle--completed");
                    else                 oRm.class("rakStepper__circle--inactive");
                    oRm.attr("aria-hidden", "true");
                    oRm.openEnd();
                    if (bCompleted) {
                        oRm.openStart("span").class("rakStepper__check").openEnd();
                        oRm.text("✓");
                        oRm.close("span");
                    } else {
                        oRm.text(String(iStep));
                    }
                    oRm.close("div");

                    // label
                    oRm.openStart("div");
                    oRm.class("rakStepper__label");
                    if (bActive)    oRm.class("rakStepper__label--active");
                    if (bCompleted) oRm.class("rakStepper__label--completed");
                    oRm.openEnd();
                    oRm.text(sLabel);
                    oRm.close("div");

                    oRm.close("div"); // item
                });

                // "N More steps" pill
                if (iExtra > 0) {
                    oRm.openStart("div");
                    oRm.class("rakStepper__connector");
                    oRm.attr("aria-hidden", "true");
                    oRm.openEnd();
                    oRm.close("div");

                    oRm.openStart("div");
                    oRm.class("rakStepper__item");
                    oRm.attr("role", "listitem");
                    oRm.attr("aria-label", iExtra + " more steps");
                    oRm.openEnd();

                    oRm.openStart("div");
                    oRm.class("rakStepper__circle");
                    oRm.class("rakStepper__circle--more");
                    oRm.attr("aria-hidden", "true");
                    oRm.openEnd();
                    oRm.openStart("span").class("rakStepper__arrow").openEnd();
                    oRm.text("→");
                    oRm.close("span");
                    oRm.close("div");

                    oRm.openStart("div");
                    oRm.class("rakStepper__label");
                    oRm.class("rakStepper__label--more");
                    oRm.openEnd();
                    oRm.text(iExtra + " More");
                    oRm.voidStart("br").voidEnd();
                    oRm.text("steps");
                    oRm.close("div");

                    oRm.close("div"); // item
                }

                oRm.close("div"); // rakStepper
            }
        }
    });
});
