function addShow(show_id) {
    if(!shows.find((show)=>show_id===show.id)) {
        getShowData(show_id).then(function(data){
            shows.push(data);
            localforage.setItem('shows', shows);
            appendShow(data);
        });
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
    var template =
    `
    <div class='container-fluid' id='show-container-<%=id%>'>
        <div class='row'>
            <div class='col-md-3'>
                <h3><%=name%> <button onclick="removeShow(<%=id%>)">Remove</button><button onclick="refreshShow(<%=id%>)">Refresh</button></h3>
                <img src="<%=image.medium%>" />
            </div>
            <div class='col-md-9'>
                <h4>Latest Episode: S<%=_embedded.previousepisode.season%>E<%=_embedded.previousepisode.number%> - <%=_embedded.previousepisode.name%></h4>

                <div style='overflow-y:scroll; height:300px;'>
                    <table class='table'>
                    <tr><th>Season</th><th>Episode</th><th>Name</th><th>Airdate</th></tr>
                    <% _embedded.episodes.forEach(function(episode){%>
                        <tr><td><%=episode.season%></td><td><%=episode.number%></td><td><%=episode.name%></td><td><%=episode.airdate%></td></tr>
                    <%})%>
                    </table>
                </div>
            </div>
        </div>
        <hr>
    </div>
    `;
    var show_div = document.createElement('div');
    var compiled_template = ejs.compile(template);
    show_div.innerHTML = compiled_template(show_data);

    var old_show_div = document.getElementById('show-container-'+show_data.id);
    if(old_show_div){
        var parent = old_show_div.parentNode;
        parent.innerHTML = '';
        parent.appendChild(show_div);
    } else {
        document.body.appendChild(show_div);
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
                shows[index] = show_data;
            }
            appendShow(show_data);
        });
        localforage.setItem('shows', shows)
    });
}

function init() {

    document.addEventListener("DOMContentLoaded", function(event) {
        var add_show_button = document.getElementById('button-add-show');
        add_show_button.addEventListener('click', function(){
            var show_query = document.getElementById('input-add-show').value;
            searchForShow(show_query);
        });
    });

    localforage.getItem('shows').then(function(shows_data){
        if (shows_data) {
            shows = shows_data;
        }

        shows.forEach(function(show){
            appendShow(show);
        });
    });
}

var shows = []
init();
