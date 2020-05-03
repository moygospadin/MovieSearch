window.onload = function() {

    var apikey = "ef4cf4c7";

    document.getElementById('movieForm').addEventListener('submit', (event) => {

        event.preventDefault();
        var movie = document.getElementById('movie').value;
        var url = "http://www.omdbapi.com/?apikey=" + apikey;
        var request = new XMLHttpRequest();
        var result = "";
        request.open('GET', url + "&s=" + movie, true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var data = JSON.parse(this.response);
                console.log(data);
                data.Search.forEach(el => {
                    console.log(el);

                    result += `<div class="card">
                    <img style="float:left" class="img-thumnail" width="200" height="200" src="${el.Poster}"/>
                    <h2>${el.Title}</h2>
                    <h2>${el.Year}</h2>
                    </div>
                    `;
                });

                document.getElementById('result').innerHTML = result;
            } else {
                // We reached our target server, but it returned an error

            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
        };

        request.send();
    });




    /*end*/
}