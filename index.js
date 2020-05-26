const clientId = 'yv2ws9845uioyt0eavfuyzxk5rc8hz';
const pageSize = 30;

async function getTopClips(period, cursor) {
    const r = await fetch(`https://api.twitch.tv/kraken/clips/top?period=${period}&limit=${pageSize}` + (cursor ? `&cursor=${cursor}` : ''), {
        method: 'GET',
        headers: {
        'Client-ID': clientId,
        'Accept': 'application/vnd.twitchtv.v5+json'
        }
    })
    return r.json();
}

function addMetadata(clip) {
    const metadataDiv = `<pre>
    Channel: ${clip.broadcaster.display_name}
    Title: ${clip.title}
    Category: ${clip.game}
    Views: ${clip.views}
    Date: ${new Date(clip.created_at)}
    </pre>`;
    return metadataDiv;
}

function loadClips(period, cursor) {
    document.period = period;
    const list = document.getElementById('clipslist');
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
                videoIframe.setAttribute('src', clip.embed_url+"&autoplay=false");
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
}

function loadMore(period) {
    loadClips(period, document.cursor);
}

loadClips('all');

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