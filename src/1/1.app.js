export function bootstrap() {
    return Promise.resolve();
}

export function mount() {
    const promise = new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/page1.html');
        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                resolve(xhr.responseText);
            }
        };
    });

    return promise.then(content =>
        document.getElementById('content').innerHTML = content
    );
}

export function unmount() {
    return Promise.resolve()
        .then(() => document.getElementById('content').innerHTML = '');
}
