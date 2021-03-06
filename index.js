function addShow(show_id) {
    if(!shows.find((show)=>show_id===show.id)) {
        getShowData(show_id).then(function(data){
            shows.push(data);
            localforage.setItem('shows', shows);
            appendShow(data);
        });
    }
}

function addImportedShow(imported_show){
    if(!shows.find((show)=>imported_show.id===show.id)) {
        shows.push(imported_show);
        localforage.setItem('shows', shows);
        appendShow(imported_show);
    }
}

function removeShow(show_id) {
    shows = shows.filter(function(show){
        return show.id != show_id;
    });
    localforage.setItem('shows', shows);

    //Remove show from DOM
    var node = document.getElementById("show-container-"+show_id);
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }

    var node = document.getElementById("show-title-"+show_id);
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
}

function getShowData(show_id) {
    var promise = new Promise(function(accept, reject){
        var url = 'http://api.tvmaze.com/shows/' + show_id + '?embed[]=episodes&embed[]=nextepisode&embed[]=previousepisode'

        fetch(url).then(function(response){
            response.json().then(function(data){
                accept(data);
            })
        })
    });
    return promise;
}

function appendShow(show_data){
    var show_div = document.createElement('div');
    var show_title_div = document.createElement('div');

    show_div.innerHTML = new EJS({url: 'show_container.ejs'}).render(show_data);
    show_title_div.innerHTML = new EJS({url: 'show_title.ejs'}).render(show_data);

    var old_show_div = document.getElementById('show-container-'+show_data.id);
    if(old_show_div){
        var parent = old_show_div.parentNode;
        parent.innerHTML = '';
        parent.appendChild(show_div);
    } else {
        document.getElementById('show-content').appendChild(show_div);
        document.getElementById('sidebar').appendChild(show_title_div);
    }
}

function searchForShow(show_query){
    url = 'http://api.tvmaze.com/singlesearch/shows?q=' + show_query

    fetch(url).then(function(response){
        response.json().then(function(data){
            addShow(data.id);
        })
    })
}

function refreshShow(show_id){
    getShowData(show_id).then(function(show_data){
        shows.forEach(function(show, index){
            if(show.id === show_id) {
                updateShowData(index, show_data);
            }
            appendShow(show_data);
        });
        localforage.setItem('shows', shows)
    });
}

function refreshShows(){
    last_refreshed = Date.now();
    localforage.setItem('last_refreshed', last_refreshed);

    updateLastUpdated();
    shows.forEach(function(show){
        refreshShow(show.id);
    });
}

function updateShowData(show_index, new_data){
    shows[show_index]['_embedded']['episodes'].forEach(function(episode, index){
        if(episode.strikethrough) {
            new_data['_embedded']['episodes'][index].strikethrough = true;
        }
    });

    shows[show_index] = new_data;
}

function updateLastUpdated(){
    var lastUpdatedTag = document.getElementById('last-updated');

    if(last_refreshed) {
        lastUpdatedTag.innerHTML = moment(last_refreshed).fromNow();
    } else {
        lastUpdatedTag.innerHTML = 'never';
    }
}

function pollAndUpdateLastUpdated(){
    setTimeout(function(){
        updateLastUpdated();
        pollAndUpdateLastUpdated();
    },10000);
}

function toggleSeason(season_id){
    var el = document.getElementById(season_id);

    if(el.style.display === 'none') {
        el.style.display = '';
    } else {
        el.style.display = 'none';
    }
}

function showShow(show_id){
    document.getElementById('show-container-'+show_id).scrollIntoView();
}

function sortShowByName(a, b){
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function toggleStrikethrough(el){
    var showId = parseInt(el.dataset.showId);
    var seasonId = parseInt(el.dataset.seasonId);
    var episodeId = parseInt(el.dataset.episodeId);
    var episode;

    var show = shows.find((show)=>showId===show.id);
    if(show){
        episode = show['_embedded']['episodes'].find((episode)=>episodeId===episode.number && seasonId===episode.season);
    }

    if(episode){
        el.classList.toggle('strikethrough');

        if(el.classList.contains('strikethrough')){
            episode.strikethrough = true;
        } else {
            episode.strikethrough = false;
        }
        localforage.setItem('shows', shows);
    }
}

function exportShows(){
    var dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shows));
    var downloadLink = document.getElementById('download-link');
    downloadLink.setAttribute('href', dataString);
    downloadLink.setAttribute('download', 'shows.json');
    downloadLink.click();
}

function importShows(file){
    var reader = new FileReader();
    reader.onload = function(event){
        var imported_shows = JSON.parse(event.target.result);
        imported_shows.forEach(function(imported_show){
            addImportedShow(imported_show);
        });

    };

    reader.readAsText(file);
}

function init() {

    document.addEventListener("DOMContentLoaded", function(event) {

        updateLastUpdated();
        pollAndUpdateLastUpdated();

        var addShowInput = document.getElementById('input-add-show');

        addShowInput.addEventListener('keyup', function(e) {
            if(e.keyCode === 13) {
                var show_query = addShowInput.value;
                searchForShow(show_query);
            }
        });

        var refresh_shows_button = document.getElementById('button-refresh-shows');
        refresh_shows_button.addEventListener('click', function(){
            refreshShows();
        });

        document.getElementById('export-button').addEventListener('click', function(){
            exportShows();
        });

        document.getElementById('import-button').addEventListener('click', function(){
            document.getElementById('upload-input').click();
        });

        document.getElementById('upload-input').addEventListener('change', function(){
            importShows(this.files[0]);
        });
    });

    localforage.getItem('shows').then(function(shows_data){
        if (shows_data) {
            shows = shows_data;
        }

        shows.sort(sortShowByName).forEach(function(show){
            appendShow(show);
        });

        //refreshShows();
    });

    localforage.getItem('last_refreshed').then(function(data){
        last_refreshed = data ? data : 0;
        updateLastUpdated();
    });
}

var shows = [];
var last_refreshed = 0;
init();
