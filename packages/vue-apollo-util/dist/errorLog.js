"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrorMessages = exports.getErrorMessages = void 0;
const printer_1 = require("graphql/language/printer");
function getErrorMessages(error) {
    const messages = [];
    const { graphQLErrors, networkError } = error;
    const operation = 'operation' in error ? error.operation : undefined;
    const stack = 'stack' in error ? error.stack : undefined;
    let printedQuery;
    if (operation) {
        printedQuery = (0, printer_1.print)(operation.query);
    }
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations }) => {
            messages.push(`[GraphQL error] ${message}`);
            if (operation) {
                messages.push(logOperation(printedQuery, locations));
                if (Object.keys(operation.variables).length) {
                    messages.push(`with variables: ${JSON.stringify(operation.variables, null, 2)}`);
                }
            }
        });
    }
    if (networkError)
        messages.push(`[Network error] ${networkError}`);
    if (stack)
        messages.push(stack);
    return messages;
}
exports.getErrorMessages = getErrorMessages;
function logErrorMessages(error, printStack = true) {
    getErrorMessages(error).forEach(message => {
        const result = /\[([\w ]*)](.*)/.exec(message);
        if (result) {
            const [, tag, msg] = result;
            console.log(`%c${tag}`, 'color:white;border-radius:3px;background:#ff4400;font-weight:bold;padding:2px 6px;', msg);
        }
        else {
            console.log(message);
        }
    });
    if (printStack) {
        let stack = new Error().stack;
        if (stack == null)
            return;
        const newLineIndex = stack.indexOf('\n');
        stack = stack.slice(stack.indexOf('\n', newLineIndex + 1));
        console.log(`%c${stack}`, 'color:grey;');
    }
}
exports.logErrorMessages = logErrorMessages;
function logOperation(printedQuery, locations) {
    const lines = printedQuery.split('\n');
    const l = lines.length;
    const result = lines.slice();
    const lineMap = {};
    for (let i = 0; i < l; i++) {
        lineMap[i] = i;
    }
    if (locations) {
        for (const { line, column } of locations) {
            const index = lineMap[line];
            result.splice(index, 0, '▲'.padStart(column, ' '));
            // Offset remaining lines
            for (let i = index + 1; i < l; i++) {
                lineMap[i]++;
            }
        }
    }
    return result.join('\n');
}
//# sourceMappingURL=errorLog.js.map