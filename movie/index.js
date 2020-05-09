"use strict";
//var apikey = "ef4cf4c7";
var apikey = "5c527664";
import './style.css';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.interimResults = false;

class Model {
    constructor(options) {
        console.log("опции", options);

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



async function getInfo(id) {

    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&i=" + id;
    let response = await fetch(url);
    let data = await response.json();

    return data;


}
const spinner = document.getElementsByClassName('spinner-border')[0];

function getUrl(movie) {
    spinner.classList.remove('d-none');
    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie + "&page=";
    var movieAmountPage = 0;
    fetch(url + 1)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);

            movieAmountPage = Math.floor(data.totalResults / 10) + 1;


            if (!movieAmountPage) {
                alert(data.Error);
                spinner.classList.add('d-none');
            } else if (movieAmountPage > 70) {
                alert('To many results');
                spinner.classList.add('d-none');
            } else {
                console.log('srabotalo');
                idCard(movieAmountPage, url);
            }
        }).catch((e) => {
            console.log("Ошибка");
            console.log(e);

        });

}

var movieData = [];
async function idCard(movieAmountPage, url) {
    movieData = [];
    console.log(movieAmountPage);
    if (movieAmountPage == 1) movieAmountPage++;
    for (let page = 1; movieAmountPage > page; page++) {
        console.log('big');

        let response = await fetch(url + page);
        let data = await response.json();
        data.Search.forEach(el => {
            movieData.push(el.imdbID);
        })
    }
    mySwiper.removeAllSlides();
    console.log(movieData);

    cardShow(movieData, 1);
}

async function cardShow(movieData, page) {
    for (let i = page - 1; i < page + 12; i++) {
        if (i < movieData.length) {
            let param = await getInfo(movieData[i])
            let a = new Model(param);
            a.showResult();
        }
    }
    spinner.classList.add('d-none');
}

var controller = function controller() {
    var movie = document.getElementById('movie').value;
    var urlYandex = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200508T173205Z.ad231a2cd00028de.5caad0bb3d04c85a53c6ede494131fe80e58bfd6&text=${movie}&lang=ru-en`;

    fetch(urlYandex)
        .then(response => response.json())
        .then(date => date.text.join(''))
        .then((movie) => {
            getUrl(movie);
            document.getElementsByClassName('info')[0].innerText = `Showing results for ${movie}`;
        }).catch(e => {
            console.log(e);
            alert("Неверный запрос")

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

    if (mySwiper.slides.length - mySwiper.realIndex <= 5) {
        page += 12;
        cardShow(movieData, page);
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
    recognition.start();
});

recognition.addEventListener('result', event => {
        let transcript = Array.from(event.results).map((result) => result[0]).map((result) => result.transcript).join('');
        document.querySelector('#movie').value = transcript;
        document.querySelector('.speak-btn').classList.remove('pulse');
    })
    /*end*/