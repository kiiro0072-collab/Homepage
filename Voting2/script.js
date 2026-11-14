const form = document.getElementById('login-form');
const message = document.getElementById('message');
const submit = document.getElementById('submit');
const loginView = document.getElementById('login-view');
const doneView = document.getElementById('done-view');
const doneName = document.getElementById('done-name');

function showDone(name) {
    loginView.hidden = true;
    doneView.hidden = false;
    if (doneName) doneName.textContent = name ? 'ようこそ、' + name + ' さん' : '';
}

async function checkExistingSession() {
    const token = sessionStorage.getItem('mataku.token');
    const username = sessionStorage.getItem('mataku.username');
    if (!token || !username) return;
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, username })
        });
        const body = await response.json();
        if (response.ok && body.success) {
            showDone(username);
        }
    } catch (e) {
        // APIに接続できない場合はフォームをそのまま表示
    }
}

checkExistingSession();

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.className = '';
    message.textContent = '';
    submit.disabled = true;
    submit.textContent = 'ログイン中...';

    try {
        const response = await fetch(API_BASE_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('username').value.trim(),
                password: document.getElementById('password').value,
                source: 'web'
            })
        });
        const body = await response.json();
        if (!response.ok || !body.success) {
            throw new Error(body.message || 'ログインに失敗しました。');
        }
        sessionStorage.setItem('mataku.username', body.data.username);
        sessionStorage.setItem('mataku.token', body.data.token);
        if (body.data.uuid) {
            sessionStorage.setItem('mataku.uuid', body.data.uuid);
        }
        message.className = 'success';
        message.textContent = 'ログインしました。';
        form.reset();
        setTimeout(() => showDone(body.data.username), 600);
    } catch (error) {
        message.className = 'error';
        message.textContent = error.message || 'サーバーに接続できませんでした。';
    } finally {
        submit.disabled = false;
        submit.textContent = 'ログイン';
    }
});
