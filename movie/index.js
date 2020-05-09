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




const spinner = document.getElementsByClassName('spinner-border')[0];

var i = 1;
var mov;
var totalResults;

function getUrl(movie) {
    spinner.classList.remove('d-none');
    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie + "&page=";
    fetch(url + i)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.Error == "Movie not found!") {
                alert('Movie not found!');
                spinner.classList.add('d-none');
            } else {
                totalResults = data.totalResults;
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

    var movie = document.getElementById('movie').value;
    var urlYandex = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200508T173205Z.ad231a2cd00028de.5caad0bb3d04c85a53c6ede494131fe80e58bfd6&text=${movie}&lang=ru-en`;
    fetch(urlYandex)
        .then(response => response.json())
        .then(date => date.text.join(''))
        .then((movie) => {
            mov = movie;
            mySwiper.removeAllSlides();
            getUrl(movie);
            document.getElementsByClassName('info')[0].innerText = `Showing results for ${movie}`;
        }).catch(e => {
            console.log(e);
            alert("Неверный запрос");

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
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})

var page = 0;

mySwiper.on('slideChange', function() {
    console.log(mySwiper.realIndex);
    console.log(mySwiper.realIndex % 10 == 7);

    if (mySwiper.realIndex % 10 == 7 && mySwiper.realIndex + 3 < totalResults) {
        i++;
        getUrl(mov);
    }
});

import Keyboard from 'rss-virtual-keyboard';
const keyboard = document.getElementsByClassName('keyboard-img')[0];

var kb = new Keyboard().init('.form-control', '.keyboard-container');

keyboard.addEventListener("mousedown", () => {
    document.getElementsByClassName('keyboard-container')[0].classList.toggle('kb-block');
    if (document.getElementsByClassName('keyboard-container')[0].classList.value == "keyboard-container") {
        document.getElementsByClassName('keyboard-container')[0].innerHTML = "";
    } else {
        kb.generateLayout();
    }
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

document.querySelector('.speak-btn').addEventListener('click', () => {
    document.querySelector('#movie').value = "";
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