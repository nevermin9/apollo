import { ApolloError } from '@apollo/client/core';
import { ErrorResponse } from '@apollo/client/link/error';
export declare function getErrorMessages(error: ErrorResponse | ApolloError): string[];
export declare function logErrorMessages(error: ApolloError | ErrorResponse, printStack?: boolean): void;
