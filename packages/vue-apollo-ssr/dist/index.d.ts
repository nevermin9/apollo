import { ApolloClient } from '@apollo/client/core';
export declare type ApolloClients = {
    [key: string]: ApolloClient<any>;
};
export interface SerializeStatesOptions {
    useUnsafeSerializer?: boolean;
}
export declare function serializeStates(apolloClients: ApolloClients, options?: SerializeStatesOptions & GetStatesOptions): string;
export interface GetStatesOptions {
    exportNamespace?: string;
}
export declare function getStates(apolloClients: ApolloClients, options?: GetStatesOptions): Record<string, any>;
export interface ExportStatesOptions extends SerializeStatesOptions, GetStatesOptions {
    globalName?: string;
    attachTo?: string;
}
export declare function exportStates(apolloClients: ApolloClients, options?: ExportStatesOptions): string;
