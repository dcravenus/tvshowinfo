<show class='show-container' id='show-container-{opts.data.id}'>

        <div class="flex-container">
            <div style="margin-right: 2em;">
                <h3><i onclick="removeShow({opts.data.id})" class='fa fa-times'></i> {opts.data.name} </h3>
                <img src="{opts.data.image.medium}" />
            </div>
            <div>
                <h4>Latest Episode: S{opts.data._embedded.previousepisode.season}E{opts.data._embedded.previousepisode.number} - {opts.data._embedded.previousepisode.name}</h4>

                <script>
                    //Create seasons array
                    this.seasons = opts.data._embedded.episodes.reduce(function(array, episode){
                        if(array.length < episode.season){
                            array.push([episode]);
                        } else {
                            array[episode.season-1].push(episode);
                        }

                        return array;
                    },[]).map(function(season, index){
                        season.number = index+1;
                        return season;
                    });

                </script>

                <div each={season in seasons}>
                    <h4 onclick="toggleSeason('{parent.opts.data.id}-{season.number}')" style="cursor: pointer;">Season {season.number}</h4>

                    <div id="{parent.opts.data.id}-{season.number}" style="display:none;">
                        <table class='table'>
                        <tr><th>Episode</th><th>Name</th><th>Airdate</th></tr>
                        <tr each={episode in season}><td>{episode.number}</td><td>{episode.name}</td><td>{episode.airdate}</td></tr>


                        </table>
                    </div>

                </div>


            </div>
        </div>
        <hr>



</show>
