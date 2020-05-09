"use strict";
var apikey = "ef4cf4c7";
//var apikey = "5c527664";
import './style.css';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.interimResults = false;

class Model {
    constructor(options) {

        if (options.Poster == "N/A")
            this.img = "./img/no_img.png"
        else
            this.img = options.Poster;
        this.title = options.Title,
            this.year = options.Year,
            this.rating = options.imdbRating,
            this.link = options.imdbID;
    }


    getResult() {
        return `<div class="swiper-slide">
        <a href="https://www.imdb.com/title/${this.link}"> <h2>${this.title}</h2></a> <p class="fig">  <img  src="${this.img}"/></p>
        <div class="more-inf"> 
        <span>${this.year}</span>
        <img class="film-star" src="/img/star.png">
    <span>IMDb:${ this.rating}</span>
    </div>
    </div>
    `;

    }
    showResult() {
        mySwiper.appendSlide(this.getResult());
    }

}




const spinner = document.getElementsByClassName('spinner-border')[0];

var page = 1;
var mov;
var totalResults;

function getUrl(movie) {

    spinner.classList.remove('d-none');
    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie + "&page=";
    fetch(url + page)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.Error == "Movie not found!") spinner.classList.add('d-none');
            if (data.Error == "Movie not found!" && page == 1) {
                document.getElementsByClassName('info')[0].innerText = 'Movie not found!';
                spinner.classList.add('d-none');
            } else {
                totalResults = data.totalResults;
                if (page == 1) {
                    document.getElementsByClassName('info')[0].innerText = `Found ${totalResults} movies for the ${movie}`;
                    mySwiper.removeAllSlides();
                }

                data.Search.forEach(el => getInfo(el.imdbID));
                spinner.classList.add('d-none');
            }
        }).catch((e) => {
            console.log("Ошибка");
            console.log(e);

        });


}

async function getInfo(id) {
    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&i=" + id;
    let response = await fetch(url);
    let data = await response.json();
    let a = new Model(data);
    a.showResult();

}


var controller = function controller() {
    page = 1;
    var movie = document.getElementById('movie').value;
    var urlYandex = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200508T173205Z.ad231a2cd00028de.5caad0bb3d04c85a53c6ede494131fe80e58bfd6&text=${movie}&lang=ru-en`;
    fetch(urlYandex)
        .then(response => response.json())
        .then(date => date.text.join(''))
        .then((movie) => {
            mov = movie;
            getUrl(movie);

        }).catch(e => {
            console.log(e);
            document.getElementsByClassName('info')[0].innerText = 'Неверый запрос';

        })



    event.preventDefault();


}
document.getElementById('movie').focus();
document.getElementById('movieForm').addEventListener('submit', () => controller());

document.addEventListener('keydown', () => {
    if (event.key == "Enter") controller()

});
var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 3,
    spaceBetween: 10,
    slidesPerGroup: 3,
    slidesPerGroupSkip: 1,
    breakpoints: {
        20: {
            centeredSlidesBounds: true,
            slidesPerView: 1,
            slidesPerGroup: 1
        },
        690: {
            spaceBetween: 0,
            slidesPerView: 2,
            slidesPerGroup: 2
        },
        1200: {
            slidesPerView: 3,
            slidesPerGroup: 3
        }
    },

    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})



mySwiper.on('slideChange', function() {
    console.log(mySwiper.activeIndex);
    console.log(mySwiper.slides.length);
    console.log(totalResults);


    if (mySwiper.activeIndex % 10 >= 7 && mySwiper.activeIndex != 0 && mySwiper.slides.length + 1 < totalResults) {
        page++;
        getUrl(mov);
    }
});

import Keyboard from 'rss-virtual-keyboard';
const keyboard = document.getElementsByClassName('btn-primary1')[0];

var kb = new Keyboard().init('.form-control', '.keyboard-container');

keyboard.addEventListener("mousedown", () => {
    document.getElementsByClassName('keyboard-container')[0].classList.toggle('kb-block');
    if (document.getElementsByClassName('keyboard-container')[0].classList.value == "keyboard-container") {
        document.getElementsByClassName('keyboard-container')[0].innerHTML = "";
    } else {
        kb.generateLayout();
    }
});
document.getElementsByClassName('btn-primary2')[0].addEventListener('click', () => {
    document.querySelector('#movie').value = "";

});

function runOnKeys(func, ...codes) {

    let pressed = new Set();
    document.addEventListener('keydown', function(event) {
        pressed.add(event.code);
        for (let code of codes) {
            if (!pressed.has(code)) {
                return;
            }
        }
        pressed.clear();
        func();
    });
    document.addEventListener('keyup', function(event) {
        pressed.delete(event.code);
    });

}

runOnKeys(
    () => kb.switchLanguage(),
    "ShiftLeft",
    "AltLeft",
);
kb.on('Enter', () => controller());
document.querySelector('.speak-btn').addEventListener('click', () => {

    document.querySelector('.speak-btn').classList.add('pulse');
    console.log(recognition);

    recognition.start();
});

recognition.addEventListener('result', event => {
    let transcript = Array.from(event.results).map((result) => result[0]).map((result) => result.transcript).join('');
    document.querySelector('#movie').value = transcript;
    document.querySelector('.speak-btn').classList.remove('pulse');
});
recognition.addEventListener('end', () => document.querySelector('.speak-btn').classList.remove('pulse'));
/*end*/