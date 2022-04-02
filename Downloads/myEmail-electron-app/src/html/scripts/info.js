const { ipcRenderer } = require('electron')

ipcRenderer.send('onFailureRequest')
ipcRenderer.on('onFailure', function(event, message) {
    var paragraph = document.getElementById('info')
    paragraph.innerText = message
});
