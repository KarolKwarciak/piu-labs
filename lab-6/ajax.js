class HttpClient {
    constructor(cfg = {}) {
        this._root = cfg.baseURL || '';
        this._defaultHeaders = {
            'Content-Type': 'application/json',
            ...(cfg.headers || {}),
        };
        this._delay = cfg.timeout || 5000;
    }

    async fetchGet(path, opts = {}) {
        return this.#_send(path, { ...opts, method: 'GET' });
    }

    async fetchPost(path, payload, opts = {}) {
        return this.#_send(path, { ...opts, method: 'POST', body: payload });
    }

    async fetchPut(path, payload, opts = {}) {
        return this.#_send(path, { ...opts, method: 'PUT', body: payload });
    }

    async fetchDelete(path, opts = {}) {
        return this.#_send(path, { ...opts, method: 'DELETE' });
    }

    async #_send(path, opts = {}) {
        const ctrl = new AbortController();
        const killTimer = setTimeout(() => ctrl.abort(), opts.timeout || this._delay);

        const reqCfg = {
            ...opts,
            headers: {
                ...this._defaultHeaders,
                ...(opts.headers || {}),
            },
            signal: ctrl.signal,
        };

        if (opts.method !== 'GET' && opts.body) {
            reqCfg.body = JSON.stringify(opts.body);
        }

        try {
            const target = this._root + path;
            const res = await fetch(target, reqCfg);

            clearTimeout(killTimer);

            if (!res.ok) {
                const t = await res.text();
                throw new Error(`HTTP ${res.status}: ${t}`);
            }

            return await res.json();
        } catch (err) {
            clearTimeout(killTimer);
            if (err.name === 'AbortError') {
                throw new Error(`Timeout: ${opts.timeout || this._delay}`);
            }
            throw err;
        }
    }
}
