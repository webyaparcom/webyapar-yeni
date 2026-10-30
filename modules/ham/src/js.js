function imgfull(img) {
    const popout = document.getElementById('poputfull');
    if (popout) {
        popout.remove();
    }
    const popoutHTML = `
      <div class="poputfullchile">
        <img src="${img}" alt="Pop-up Image">
      </div>
      <div class="poputfullremove" onclick="poputfullremove()"></div>
    `;
    const newPopout = document.createElement('div');
    newPopout.id = 'poputfull';
    newPopout.innerHTML = popoutHTML;
    document.body.appendChild(newPopout);
}

function poputfullremove() {
    const popout = document.getElementById('poputfull');
    if (popout) {
        popout.remove();
    } else {
        console.log('Element to remove not found.');
    }
}

// Cookie işlemleri
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Token kontrolü ve oluşturma
function checkAndCreateToken() {
    let token = getCookie('token');
    if (!token) {
        token = Math.random().toString(36).substring(2, 15);
        document.cookie = 'token=' + token;
    }
    return token;
}
// Token oluşturma işlemini başlat
checkAndCreateToken();
