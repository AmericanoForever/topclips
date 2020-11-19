const clientId = 'yv2ws9845uioyt0eavfuyzxk5rc8hz';
const pageSize = 30;

async function getTopClips(period, cursor) {
    const r = await fetch(`https://api.twitch.tv/kraken/clips/top?period=${period}&limit=${pageSize}` + (cursor ? `&cursor=${cursor}` : '') + (document.koOnly ? '&language=ko' : ''), {
        method: 'GET',
        headers: {
        'Client-ID': clientId,
        'Accept': 'application/vnd.twitchtv.v5+json'
        }
    })
    return r.json();
}

function addMetadata(clip) {
    var since = undefined;
    const clipTime = moment(clip.created_at);
    if (document.period === 'day') {
        const now = moment(new Date());
        since = moment.duration(now.diff(clipTime));
    }
    const metadataDiv = `<pre>
    Channel: ${clip.broadcaster.display_name}
    Title: ${clip.title}
    Category: ${clip.game}
    Views: ${clip.views}
    Date: ${clipTime.format('YYYY/MM/DD h:mm a')}${since ? ' (' + Math.floor(since.asHours()) + ' hrs ago)' : ''}
    </pre>`;
    return metadataDiv;
}

function loadClips(period, cursor) {
    document.period = period;
    const list = document.getElementById('clipslist');
    const prePos = window.pageYOffset ;
    console.log(prePos);
    getTopClips(period, cursor).then(r => {
        const startIndex = list.childElementCount;
        for(i = 0; i < r.clips.length; i++) {
            const clip = r.clips[i];
            const row = document.createElement('tr');
            
            const tdIndex = document.createElement('td');
            const index = document.createElement('p');
            index.innerHTML = `<p>${startIndex+i+1}</p>`
            tdIndex.appendChild(index);
            row.appendChild(tdIndex);
            
            const tdImg = document.createElement('td');
            const img = document.createElement('img');
            img.addEventListener('click', function() {
                const videoIframe = document.getElementById('clipvideo');
                videoIframe.setAttribute('src', clip.embed_url+"&autoplay=false&parent=americanoforever.github.io");
            });
            img.setAttribute('src', clip.thumbnails.small);
            tdImg.appendChild(img);
            row.appendChild(tdImg);

            const tdMetadata = document.createElement('td');
            tdMetadata.innerHTML = addMetadata(clip);
            row.appendChild(tdMetadata);

            list.appendChild(row);
        }
        document.cursor = r._cursor;
    });
    window.scrollTo(0, prePos - 40);
}

function loadMore(period) {
    loadClips(period, document.cursor);
}

document.getElementById("day").checked = true;
document.getElementById('koOnly').checked = true;
document.koOnly = true;
loadClips('day');

document.getElementById('day').addEventListener('click', function() {
    const list = document.getElementById('clipslist');
    list.innerHTML = '';
    loadClips('day');
});

document.getElementById('week').addEventListener('click', function() {
    const list = document.getElementById('clipslist');
    list.innerHTML = '';
    loadClips('week');
});

document.getElementById('month').addEventListener('click', function() {
    const list = document.getElementById('clipslist');
    list.innerHTML = '';
    loadClips('month');
});

document.getElementById('all').addEventListener('click', function() {
    const list = document.getElementById('clipslist');
    list.innerHTML = '';
    loadClips('all');
});

document.getElementById('more').addEventListener('click', function() {
    loadMore(document.period);
});

document.getElementById('koOnly').addEventListener('click', function() {
    const list = document.getElementById('clipslist');
    list.innerHTML = '';
    const koCB = document.getElementById('koOnly');
    document.koOnly = koCB.checked;
    loadClips(document.period);
});
