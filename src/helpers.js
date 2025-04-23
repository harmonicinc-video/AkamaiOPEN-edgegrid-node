import crypto from 'crypto';
import logger from './logger.js';
import path from 'path';
import os from 'os';

const MAX_BODY = 131072;

function twoDigitNumberPad(number) {
    return String(number).padStart(2, '0');
}
/**
 * Create timestamp with format "yyyyMMddTHH:mm:ss+0000"
 *
 * @see https://developer.akamai.com/legacy/introduction/Client_Auth.html#authorizationheaderfields
 */
function createTimestamp() {
    const date = new Date(Date.now());

    return date.getUTCFullYear() +
        twoDigitNumberPad(date.getUTCMonth() + 1) +
        twoDigitNumberPad(date.getUTCDate()) +
        'T' +
        twoDigitNumberPad(date.getUTCHours()) + ':' +
        twoDigitNumberPad(date.getUTCMinutes()) +
        ':' +
        twoDigitNumberPad(date.getUTCSeconds()) +
        '+0000';
}

function contentHash(request, maxBody) {
    let contentHash = '';
    let preparedBody = request.body || '';
    const isTarball = preparedBody instanceof Uint8Array && request.headers['Content-Type'] === 'application/gzip';

    if (typeof preparedBody === 'object' && !isTarball) {
        let postDataNew = '';
        logger.info('Body content is type Object, transforming to POST data');
        
        for (const key in preparedBody) {
            postDataNew += key + '=' + encodeURIComponent(JSON.stringify(preparedBody[key])) + '&';
        }

        // Strip trailing ampersand
        postDataNew = postDataNew.replace(/&+$/, "");

        preparedBody = postDataNew;
        request.body = preparedBody; // Is this required or being used?
    }

    logger.info('Body is \"' + preparedBody + '\"');
    logger.debug('PREPARED BODY LENGTH', preparedBody.length);

    if (request.method === 'POST' && preparedBody.length > 0) {

        logger.info('Signing content: \"' + preparedBody + '\"');

            // If body data is too large, cut down to max-body size which is const value
        if (preparedBody.length > MAX_BODY) {
            logger.warn('Data length (' + preparedBody.length + ') is larger than maximum ' + MAX_BODY);
            if (isTarball)
                preparedBody = preparedBody.slice(0, MAX_BODY);
            else
                preparedBody = preparedBody.substring(0, MAX_BODY);
            logger.info('Body truncated. New value \"' + preparedBody + '\"');
        }

        logger.debug('PREPARED BODY', preparedBody);

        contentHash = base64Sha256(preparedBody);
        logger.info('Content hash is \"' + contentHash + '\"');
    }

    return contentHash;
}

/**
 *
 * @param {Object} request      The request Object. Can optionally contain a
 *                              'headersToSign' property: An ordered list header names
 *                              that will be included in the signature. This will be
 *                              provided by specific APIs.
 * @param {String} authHeader   The authorization header.
 * @param {Number} maxBody      This value is deprecated.
 */
function dataToSign(request, authHeader, maxBody) {
    const parsedUrl = new URL(request.url);
    const dataToSign = [
        request.method.toUpperCase(),
        parsedUrl.protocol.replace(":", ""),
        parsedUrl.host,
        parsedUrl.pathname + parsedUrl.search,
        canonicalizeHeaders(request.headersToSign),
        contentHash(request, maxBody),
        authHeader
    ];

    const dataToSignStr = dataToSign.join('\t').toString();

    logger.info('Data to sign: "' + dataToSignStr + '" \n');

    return dataToSignStr;
}



function extend(a, b) {
    for (const key in b) {
        if (!a.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

function extendHeaders(headers) {
    if (!headers.hasOwnProperty('Content-Type')) {
        headers['Content-Type'] = "application/json";
    }
    if (!headers.hasOwnProperty('Accept')) {
        headers['Accept'] = "application/json";
    }

    let userAgents = [headers['User-Agent']];
    if (process.env['AKAMAI_CLI'] && process.env['AKAMAI_CLI_VERSION']) {
        userAgents.push(`AkamaiCLI/${process.env['AKAMAI_CLI_VERSION']}`);
    }
    if (process.env['AKAMAI_CLI_COMMAND'] && process.env['AKAMAI_CLI_COMMAND_VERSION']) {
        userAgents.push(`AkamaiCLI-${process.env['AKAMAI_CLI_COMMAND']}/${process.env['AKAMAI_CLI_COMMAND_VERSION']}`);
    }

    userAgents = userAgents.filter(v => v);
    if (userAgents.length > 0) {
        headers['User-Agent'] = userAgents.join(' ');
    }

    return headers;
}

function isRedirect(statusCode) {
    return [
        300, 301, 302, 303, 307
    ].indexOf(statusCode) !== -1;
}

function base64Sha256(data) {
    const shasum = crypto.createHash('sha256').update(data);

    return shasum.digest('base64');
}

function base64HmacSha256(data, key) {
    const encrypt = crypto.createHmac('sha256', key);
    encrypt.update(data);

    return encrypt.digest('base64');
}

/**
 * Creates a String containing a tab delimited set of headers.
 * @param  {Object} headers Object containing the headers to add to the set.
 * @return {String}         String containing a tab delimited set of headers.
 */
function canonicalizeHeaders(headers) {
    const formattedHeaders = [];
        let key;

        for (key in headers) {
            formattedHeaders.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' '));
        }

    return formattedHeaders.join('\t');
}

function signingKey(timestamp, clientSecret) {
    const key = base64HmacSha256(timestamp, clientSecret);
    logger.info('Signing key: ' + key + '\n');
    return key;
}

/**
 *
 * @param {Object} request       The request Object. Can optionally contain a
 *                               'headersToSign' property: An ordered list header names
 *                               that will be included in the signature. This will be
 *                               provided by specific APIs.
 * @param {Date} timestamp       The timestamp with format "yyyyMMddTHH:mm:ss+0000".
 * @param {String} clientSecret  The client secret value from the .edgerc file.
 * @param {String} authHeader    The authorization header.
 * @param maxBody                This value is deprecated.
 * @returns {string}
 */
function signRequest(request, timestamp, clientSecret, authHeader, maxBody) {
    return base64HmacSha256(dataToSign(request, authHeader, maxBody), signingKey(timestamp, clientSecret));
}

function resolveHome(filePath) {
    if (filePath && filePath[0] === '~') {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}

export {
    MAX_BODY,
    createTimestamp,
    contentHash,
    dataToSign,
    extend,
    extendHeaders,
    isRedirect,
    base64Sha256,
    base64HmacSha256,
    canonicalizeHeaders,
    signingKey,
    signRequest,
    resolveHome
};
