window.onload = () => {
    let timeOut;
    search('');
    document.getElementById('searcher').addEventListener('input', (e) => {
        if(timeOut != null){
            clearTimeout(timeOut);
        }

        timeOut = setTimeout(() =>{
            search(e.target.value);
            timeOut = null;
        }, 1000);
    });

    //Cerrar el modal cuando se presiona el botón "Regresar"
    document.getElementById('return').addEventListener('click',(e) =>{
        document.getElementById('modal').classList.remove('open');
        document.body.classList.remove('locked');
        document.getElementById('video').innerHTML= '';
    });

    //Si no es igual la información que se pone en el buscador a el titulo de un video existente, busca videos que
    //contengan alguna parte de lo que se buscó 
    document.getElementById('videos').addEventListener('click',(e) =>{
        let element= e.target;
        if(!element.matches('[data-id]')){
            element= element.closest('[data-id]');
        }

        //Implementación del API de videos de youtube 
        fetch('https://www.googleapis.com/youtube/v3/videos?id=' + element.getAttribute('data-id') + '&part=snippet,player,statistics&key=AIzaSyCLE50RdelyV2RG1s8sUM5Ezt8awVaAd6s',{
            method: 'GET',
            headers:{
                'Content-Type': 'aplication/json',
            }
        }).then((response) => response.json())
        .then((data) =>{
            console.log(data);
            if(data.items.length > 0){
                let video= data.items[0];
                document.getElementById('video').innerHTML= video.player.embedHtml;
                document.getElementById('title').textContent= video.snippet.title;
                document.getElementById('views').textContent= 'Vistas: ' + video.statistics.viewCount;
                document.getElementById('likes').textContent= 'Likes: ' + video.statistics.likeCount;
                document.getElementById('dislikes').textContent= 'Dislikes: ' + video.statistics.dislikeCount;
                document.getElementById('description').textContent = video.snippet.description;
                document.getElementById('modal').classList.add('open');
                document.body.classList.add('locked');
            }else{
                alert('Hubo un error cargando el video');
            }
        });

    });
}

//Implementación del API de buscador de youtube
function search(search){
    fetch('https://www.googleapis.com/youtube/v3/search?q=' + search + '&maxResults=20&part=snippet,id&type=video&safeSearch=moderate&key=AIzaSyCLE50RdelyV2RG1s8sUM5Ezt8awVaAd6s',{
        method: 'GET',
        headers: {
            'Content-Type': 'aplication/json',
        }
    }).then((response) => response.json())
    .then((data) => {
        console.log(data.items);
        document.getElementById('videos').innerHTML = '';
        for(let i=0; i < data.items.length; i++){
            const content = document.createElement('div');
            content.classList.add('space'); 
            content.classList.add('col');
            content.classList.add('col-4');
            content.setAttribute('data-id', data.items[i].id.videoId);
            content.setAttribute('title', data.items[i].snippet.title);

            const video = document.createElement('figure');

            const image = document.createElement('img');
            image.src = data.items[i].snippet.thumbnails.default.url;
            video.appendChild(image);

            const title = document.createElement('figcaption');
            title.textContent = data.items[i].snippet.title;
            video.appendChild(title);

            content.appendChild(video);
            document.getElementById('videos').appendChild(content);
        }
    });
}