import Examples from './Examples';

window.addEventListener('load', () => {
    const id = document.getElementById('example-id');
    if (!id) {
        return;
    }
    const example = id.innerText;
    Examples[example]();
});
