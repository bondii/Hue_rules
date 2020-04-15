export async function REST(params) {
    if (!params.path) { throw Error('params.path must be specified') }
    const api = new RestControllerConnection({ name: params.path, version: 'beta' })

    let res = await api.createCall({ ...params, path: '', method: params.method || 'GET' })
    res.data = await res.json()
    return res
}

export class RestControllerConnection {
    constructor(options) {
        this.endpoint = `http://192.168.2.220/api/5UpZWaAwdfEqAFY43C2ZBcgpSihc1CVHwx-rxVA5/${options.name}`
        // TODO: future use example: this.endpoint = `/api/${options.name}/${options.version}/` || ''
    }

    /**
     * Performs a fetch request with default settings
     * @param {object} parameters Parameters containing:
     * {string} method,
     * {object} body,
     * [{string} path],
     * [{string} query],
     * [{object} headers]
     * @returns {Promise} a promise
     */
    createCall(parameters) {
        const headers = (parameters.headers || {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        const isJsonRequest = headers['Content-Type'] === 'application/json';

        return fetch(this.endpoint + parameters.path, {
            method: parameters.method,
            headers: headers,
            credentials: 'same-origin',
            // MS Edge requires body to be undefined in case empty, not null!
            body: (parameters.body && isJsonRequest ? JSON.stringify(parameters.body) : parameters.body || undefined)
        })
    }

    /**
     * GET
     * @param {string} query request query parameter
     * @param {object} headers optional custom headers
     * @param {string} path optional additional path
     * @returns {Promise} a promise
     */
    get(query, headers, path) {
        return this.createCall({method: 'GET', query: query, headers: headers, path: path});
    }

    /**
     * GET JSON
     * A shorthand method for retrieving the JSON result
     * and binding it to the body property of the response
     * @param {string} query request query parameter
     * @param {object} headers optional custom headers
     * @param {string} path optional additional path
     * @returns {Promise} a promise
     */
    async getJson(query, headers, path) {
        let res = await this.get(query, headers, path)
        res.data = await res.json()
        return res
    }

    /**
     * POST
     * @param {object} body request body
     * @param {object} headers custom headers
     * @returns {Promise} a promise
     */
    post(body, headers) {
        return this.createCall({method: 'POST', body: body, headers: headers});
    }

    /**
     * PUT
     * @param {string} query request query parameter
     * @param {object} body request body
     * @param {object} headers custom headers
     * @returns {Promise} a promise
     */
    put(query, body, headers, path) {
        return this.createCall({method: 'PUT', body: body, query: query, path: path});
    }

    /**
     * DELETE
     * @param {string} query request query parameter
     * @param {object} body request body
     * @param {object} headers custom headers
     * @returns {Promise} a promise
     */
    delete(query, body, headers) {
        return this.createCall({method: 'DELETE', query: query, headers: headers});
    }
}
