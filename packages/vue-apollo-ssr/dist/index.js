"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStates = exports.getStates = exports.serializeStates = void 0;
const serializeJs = require("serialize-javascript");
function serializeStates(apolloClients, options = {}) {
    const state = getStates(apolloClients, options);
    return options.useUnsafeSerializer
        ? JSON.stringify(state)
        : serializeJs(state);
}
exports.serializeStates = serializeStates;
function getStates(apolloClients, options = {}) {
    const finalOptions = Object.assign({}, {
        exportNamespace: '',
    }, options);
    const states = {};
    for (const key in apolloClients) {
        const client = apolloClients[key];
        const state = client.cache.extract();
        states[`${finalOptions.exportNamespace}${key}`] = state;
    }
    return states;
}
exports.getStates = getStates;
function exportStates(apolloClients, options = {}) {
    const finalOptions = Object.assign({}, {
        globalName: '__APOLLO_STATE__',
        attachTo: 'window',
        useUnsafeSerializer: false,
    }, options);
    return `${finalOptions.attachTo}.${finalOptions.globalName} = ${serializeStates(apolloClients, options)};`;
}
exports.exportStates = exportStates;
//# sourceMappingURL=index.js.map