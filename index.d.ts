import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

declare namespace EdgeGrid {
    interface EdgeGridConfig {
        path?: string;
        section?: string;
        debug?: boolean;
        client_token?: string;
        client_secret?: string;
        access_token?: string;
        host?: string;
    }

    interface Request {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Common methods
        path: string;
        headers?: Record<string, any>;
        qs?: Record<string, any>; // Query string parameters
        body?: any; // Request body (string, object, Buffer, etc.)
    }

    // Define a type for the callback function used in send()
    type SendCallback = (error: AxiosError | Error | null, response?: AxiosResponse, body?: any) => void;
}

declare class EdgeGrid {
    config: {
        client_token: string;
        client_secret: string;
        access_token: string;
        host: string;
        max_body: number; // Still present internally, though deprecated
    };
    request: AxiosRequestConfig; // Stores the prepared Axios request config

    constructor(config: EdgeGrid.EdgeGridConfig);
    constructor(client_token: string, client_secret: string, access_token: string, host: string, debug?: boolean);

    /**
     * Sends the request and invokes the callback function.
     * @param {Function} callback The callback function (err, response, body).
     * @returns EdgeGrid object (self)
     */
    send(callback: EdgeGrid.SendCallback): this;

    /**
    * Builds the request using the properties of the local config Object.
     *
    * @param  {Object} req The request Object. Can optionally contain a
    *                      'headersToSign' property: An ordered list header names
    *                      that will be included in the signature. This will be
    *                      provided by specific APIs.
    * @return EdgeGrid object (self)
    */
    auth(req: EdgeGrid.Request): this;
}

// Use default export for better ESM compatibility
export default EdgeGrid;