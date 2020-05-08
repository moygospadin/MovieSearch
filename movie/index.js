"use strict";
//var apikey = "ef4cf4c7";
var apikey = "5c527664";

import './style.css';
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

function getUrl(movie) {

    var url = "https://www.omdbapi.com/?apikey=" + apikey + "&s=" + movie + "&page=";
    var movieAmountPage = 0;
    fetch(url + 1)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);

            movieAmountPage = Math.floor(data.totalResults / 10) + 1;
            if (!movieAmountPage || movieAmountPage > 70) alert('ошибка!')
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
        20: {
            centeredSlidesBounds: true,
            slidesPerView: 1,
            slidesPerGroup: 1
        },
        690: {
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

import Keyboard from 'rss-virtual-keyboard';
const keyboard = document.getElementsByClassName('keyboard-img')[0];

const kb = new Keyboard().init('.form-control', '.keyboard-container');

keyboard.addEventListener("mousedown", () => {

    document.getElementsByClassName('keyboard-container')[0].classList.toggle('kb-block');
    if (document.getElementsByClassName('keyboard-container')[0].classList.value == "keyboard-container") document.getElementsByClassName('keyboard-container')[0].innerHTML = "";
    else kb.generateLayout();

});
console.log(kb);

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
kb.on('Enter', () => console.log('Enter button pressed'));
kb.on('Space', () => console.log('Space button pressed'));
/*end*/