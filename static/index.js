//C: \Users\ idht\ Desktop\ projects\ MovieSearch\ node_modules\ swiper\ js\ swiper.js
//var apikey = "ef4cf4c7";
var apikey = "5c527664";

class Model {
    constructor(options) {
        console.log("опции", options);

        if (options.Poster == "N/A")
            this.img = "img/no_img.png"
        else
            this.img = options.Poster;
        this.title = options.Title,
            this.year = options.Year,
            this.rating = options.imdbRating,
            this.link = options.imdbID;
    }


    getResult() {
        return `<div class="swiper-slide">
        <a href="https://www.imdb.com/title/${this.link}"> <h2>${this.title}</h2></a>
    <img  src="${this.img}"/>
    <h2>${this.year}</h2>
    <h2>${ this.rating}</h2>
    </div>
    `;

    }
    showResult() {
        mySwiper.appendSlide(this.getResult());
    }

}



async function getInfo(id) {

    var url = "http://www.omdbapi.com/?apikey=" + apikey + "&i=" + id;
    let response = await fetch(url);
    let data = await response.json();

    return data;


}

function getUrl(movie) {

    var url = "http://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie + "&page=";
    var movieAmountPage = 0;
    fetch(url + 1)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);

            movieAmountPage = Math.floor(data.totalResults / 10) + 1;
            if (!movieAmountPage) alert('ошибка!')
            else
                idCard(movieAmountPage, url);

        }).catch((e) => {
            console.log("Ошибка");
            console.log(e);

        });

}

var movieData = [];
async function idCard(movieAmountPage, url) {
    movieData = [];

    for (let page = 1; movieAmountPage > page; page++) {
        let response = await fetch(url + page);
        let data = await response.json();
        data.Search.forEach(el => {
            movieData.push(el.imdbID);
        })
    }
    mySwiper.removeAllSlides();
    cardShow(movieData, 1);
}

async function cardShow(movieData, page) {
    for (let i = page; i < page + 12; i++) {
        if (i < movieData.length) {
            let param = await getInfo(movieData[i])
            let a = new Model(param);

            a.showResult();
        }
    }
}
var controller = function controller() {
    var movie = document.getElementById('movie').value;
    event.preventDefault();
    getUrl(movie);

}
document.getElementById('movie').focus();
document.getElementById('movieForm').addEventListener('submit', () => controller());

var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    slidesPerView: 3,
    spaceBetween: 10,
    slidesPerGroup: 3,
    slidesPerGroupSkip: 1,
    breakpoints: {
        480: {
            slidesPerView: 1,
            slidesPerGroup: 1
        },
        640: {
            slidesPerView: 2,
            slidesPerGroup: 2
        },
        1200: {
            slidesPerView: 3,
            slidesPerGroup: 3
        }
    },
    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})

var page = 0;

mySwiper.on('slideChange', function() {

    if (mySwiper.slides.length - mySwiper.realIndex <= 5) {
        page += 12;
        cardShow(movieData, page);
    }

});
/*end*/