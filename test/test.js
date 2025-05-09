// Instrument the tests
import assert from 'assert';
import * as auth from '../src/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Replicate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const base_url = "https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/",
    access_token = "akab-access-token-xxx-xxxxxxxxxxxxxxxx",
    client_token = "akab-client-token-xxx-xxxxxxxxxxxxxxxx",
    client_secret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=",
    nonce = "nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    timestamp = "20140321T19:34:21+0000";

let test_auth = null;

describe('Signature Generation', function () {
    describe('simple GET', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=tL+y4hxyHxgWVD30X3pWnGKHcPzmrIF+LThiAOhMxYU=";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "",
                "method": "GET"
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });
    describe('get with querystring', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=hKDH1UlnQySSHjvIcZpDMbQHihTQ0XyVAKZaApabdeA=";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t1?p1=1&p2=2",
                "method": "GET"
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('get with querystring Object', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=hKDH1UlnQySSHjvIcZpDMbQHihTQ0XyVAKZaApabdeA=";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t1",
                "method": "GET",
                "qs": {
                    "p1": 1,
                    "p2": 2
                }
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('Post uses passed-max-body', function() {
        it('should return the expected string when the signing request is run.', function() {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=hXm4iCxtpN22m4cbZb4lVLW5rhX8Ca82vCFqXzSTPe4=";
            const data = "datadatadatadatadatadatadatadata";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t3",
                "method": "POST",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.equal(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('POST inside limit', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=hXm4iCxtpN22m4cbZb4lVLW5rhX8Ca82vCFqXzSTPe4=";
            const data = "datadatadatadatadatadatadatadata";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t3",
                "method": "POST",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('POST too large', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=Qevb0l2aILIipbL0DcTyjEQCfKdm8YthPULEJD3BOh8=";
            const data = fs.readFileSync(path.resolve(__dirname, 'test_body_data.txt'));

            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t3",
                "method": "POST",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('POST length equals max_body', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=6Q6PiTipLae6n4GsSIDTCJ54bEbHUBp+4MUXrbQCBoY=";
            const data = "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t3",
                "method": "POST",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('POST empty body', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=1gEDxeQGD5GovIkJJGcBaKnZ+VaPtrc4qBUHixjsPCQ=";
            const data = "";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t6",
                "method": "POST",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);

        });
    });

    describe('simple header signing with GET', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=YgMcMzBrimnBmp7wxzjirUsAcC0UK6MVPydEpjKVcHc=";
            const headers = {
                "X-Test1": "test-simple-header"
            };
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t4",
                "method": "GET",
                "headers": headers
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            console.log("Test AUTH with GET: ", test_auth.headers.Authorization);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('headers containing spaces', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=YgMcMzBrimnBmp7wxzjirUsAcC0UK6MVPydEpjKVcHc=";
            const headers = {
                "X-Test1": "\"     test-header-with-spaces     \""
            };
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t4",
                "method": "GET",
                "headers": headers
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            console.log("Test AUTH with spaces: ", test_auth.headers.Authorization);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('headers with leading and interior spaces', function () {
        it('should return the expected string when the signing request is run.', function () {
            const headers = {
                "X-Test1": "     first-thing      second-thing"
            };
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=YgMcMzBrimnBmp7wxzjirUsAcC0UK6MVPydEpjKVcHc=";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t4",
                "method": "GET",
                "headers": headers
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            console.log("Test AUTH with leading interior spaces: ", test_auth.headers.Authorization);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('PUT test', function () {
        it('should return the expected string when the signing request is run.', function () {
            const data = "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP";
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=GNBWEYSEWOLtu+7dD52da2C39aX/Jchpon3K/AmBqBU=";
            const request = {
                //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
                "path": "testapi/v1/t6",
                "method": "PUT",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, false, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('POST request when max_body is provided in .edgerc file', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=lUcTuRl/Iy5vmBp7uNvya9BoRaA9/oyHKC+pCDOlg1s=";
            const data = "{\"name\":\"text24.devexp-cli-dns-test.net\",\"type\":\"SRV\",\"ttl\":300,\"zone\":\"devexp-cli-dns-test.net\",\"rdata\":[\"10 40 5061 small.example.com\",\"20 10 5060 tiny.example.com\"]}";
            const request = {
                "path": "testapi/v1/t3",
                "method": "POST",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, 169, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });

    describe('POST request when max_body is less than data', function () {
        it('should return the expected string when the signing request is run.', function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=lUcTuRl/Iy5vmBp7uNvya9BoRaA9/oyHKC+pCDOlg1s=";
            const data = "{\"name\":\"text24.devexp-cli-dns-test.net\",\"type\":\"SRV\",\"ttl\":300,\"zone\":\"devexp-cli-dns-test.net\",\"rdata\":[\"10 40 5061 small.example.com\",\"20 10 5060 tiny.example.com\"]}";
            const request = {
                "path": "testapi/v1/t3",
                "method": "POST",
                "body": data
            };
            test_auth = auth.generateAuth(request, client_token, client_secret, access_token, base_url, 1, nonce, timestamp);
            assert.strictEqual(test_auth.headers.Authorization, expected_header);
        });
    });
});
