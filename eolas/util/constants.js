'use strict'

exportConstant('DEFECTSUMMARYCOLLECTION', 'dailyDefectSummary');
exportConstant('DEMANDSUMMARYCOLLECTION', 'dailyDemandSummary');
exportConstant('EFFORTSUMMARYCOLLECTION', 'dailyEffortSummary');

exportConstant('STATUSOK', 'green');
exportConstant('STATUSWARNING', 'amber');
exportConstant('STATUSERROR', 'red');

exportConstant('EVENTCOLLECTION', 'loadEvents');
exportConstant('PROJECTCOLLECTION', 'project');

function exportConstant (name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}
