class HttpShowcase {
    constructor() {
        this.http = new HttpClient({
            baseURL: 'https://jsonplaceholder.typicode.com',
        });

        this.ui = {
            btnLoad: document.getElementById('loadButton'),
            btnError: document.getElementById('errorButton'),
            btnReset: document.getElementById('resetButton'),
            spinner: document.getElementById('loader'),
            errorBox: document.getElementById('errorHandler'),
            list: document.getElementById('postsList'),
        };

        this._attach();
    }

    _attach() {
        this.ui.btnLoad.addEventListener('click', () => this._fetchPosts());
        this.ui.btnError.addEventListener('click', () => this._triggerError());
        this.ui.btnReset.addEventListener('click', () => this._resetView());
    }

    async _fetchPosts() {
        this._toggleLoading(true);
        this._hideError();
        try {
            const data = await this.http.fetchGet('/posts', { timeout: 3000 });
            this._render(data.slice(0, 5));
        } catch (err) {
            this._displayError(err.message);
        } finally {
            this._toggleLoading(false);
        }
    }

    async _triggerError() {
        this._toggleLoading(true);
        this._hideError();
        try {
            await this.http.fetchGet('/error_endpoint');
        } catch (err) {
            this._displayError(err.message);
        } finally {
            this._toggleLoading(false);
        }
    }

    _toggleLoading(state) {
        this.ui.btnLoad.disabled = state;
        this.ui.btnError.disabled = state;
        this.ui.spinner.classList.toggle('active', state);
    }

    _displayError(msg) {
        this.ui.errorBox.textContent = msg;
        this.ui.errorBox.style.display = 'block';
    }

    _hideError() {
        this.ui.errorBox.style.display = 'none';
    }

    _render(items) {
        this.ui.list.innerHTML = items
            .map(
                (p) => `
                <li class="post">
                    <h3>${p.title}</h3>
                    <p>${p.body}</p>
                    <small>ID: ${p.id}</small>
                </li>`
            )
            .join('');
    }

    _resetView() {
        this.ui.list.innerHTML = '';
        this._hideError();
    }
}

new HttpShowcase();
