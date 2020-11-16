document.addEventListener("DOMContentLoaded", function () {

    if (document.querySelector(".swiper-container") != undefined) {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 3,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    var connexion = new MovieDB();

    if (document.querySelector(".swiper-container") == undefined) {

        var params = (new URL(document.location)).searchParams;

        console.log(params.get("id"));

        connexion.requeteInfoFilm(params.get("id"));
    }
    else {
        connexion.requeteFilmPopulaire();
    }

        /** Scroll to top button implementation in vanilla JavaScript (ES6 - ECMAScript 6) **/

        var intervalId = 0; // Needed to cancel the scrolling when we're at the top of the page
        var $scrollButton = document.querySelector('#fleche'); // Reference to our scroll button

        function scrollStep() {
            // Check if we're at the top already. If so, stop scrolling by clearing the interval
            if (window.pageYOffset === 0) {
                clearInterval(intervalId);
            }
            window.scroll(0, window.pageYOffset - 50);
        }

        function scrollToTop() {
            // Call the function scrollStep() every 16.66 millisecons
            intervalId = setInterval(scrollStep, 16.66);
        }

// When the DOM is loaded, this click handler is added to our scroll button
        $scrollButton.addEventListener('click', scrollToTop);
    });

class MovieDB {
    constructor() {
        console.log("Parfait 2");

        this.APIKey = "eda01ad95b124c2be1b5f4308d87648f";

        this.lang = "fr-CA";

        this.baseURL = "https://api.themoviedb.org/3/";

        this.imgPath = "https://image.tmdb.org/t/p/";

        this.largeurAffiche = ["92", "154", "185", "342", "500", "780"];

        this.largeurTeteAffiche = ["45", "185"];

        this.totalFilm = 9;

        this.totalActeur = 6;
    }

    requeteFilmPopulaire() {

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", this.retourFilmPopulaire.bind(this));

        //xhr.open("GET", "https://api.themoviedb.org/3/movie/popular?page=1&language=en-US&api_key=%3C%3Capi_key%3E%3E");
        xhr.open("GET", this.baseURL + "movie/popular?page=1&language=" + this.lang + "&api_key=" + this.APIKey);

        xhr.send();
    }

    retourFilmPopulaire(e) {

        var target = e.currentTarget;

        var data;

        if (target.readyState === target.DONE) {


            data = JSON.parse(target.responseText).results;

            this.afficheFilmPopulaire(data);
        }

    }

    afficheFilmPopulaire(data) {
        console.log(data);

        for (var i = 0; i < this.totalFilm; i++) {

            var unArticle = document.querySelector(".template>.film").cloneNode(true);

            unArticle.querySelector("h1").innerText = data[i].title;

            unArticle.querySelector(".date").innerText = "Sorti le " + data[i].release_date;

            unArticle.querySelector(".note").innerText = data[i].vote_average + " / 10";

            if (data[i].overview === "") {
                unArticle.querySelector(".description").innerText = "Sans description";
            }
            else {
                unArticle.querySelector(".description").innerText = data[i].overview;
            }

            unArticle.querySelector("img").setAttribute("src", this.imgPath + "w500" + data[i].poster_path);
            unArticle.querySelector("img").setAttribute("alt", data[i].title);
            unArticle.querySelector("a").setAttribute("href", "fiche-film.html?id=" + data[i].id);

            document.querySelector(".liste-films").appendChild(unArticle);

            this.requeteNouveauFilm();
        }
    }

//    requete pour un film en particulier

    requeteInfoFilm(movieId) {

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", this.retourInfoFilm.bind(this));

        // xhr.open("GET", "https://api.themoviedb.org/3/movie/%7Bmovie_id%7D?language=en-US&api_key=%3C%3Capi_key%3E%3E");
        xhr.open("GET", this.baseURL + "movie/" + movieId + "?language=" + this.lang + "&api_key=" + this.APIKey);

        xhr.send();
    }

    retourInfoFilm(e) {

        var target = e.currentTarget;

        var data;

        if (target.readyState === target.DONE) {

            data = JSON.parse(target.responseText);

            this.afficheInfoFilm(data);
        }
    }

    afficheInfoFilm(data) {

        document.querySelector(".h1").innerText = data.title;
        document.querySelector("td.langue").innerText = data.original_language;
        document.querySelector("td.duree").innerText = data.runtime + " minutes";
        document.querySelector("td.budget").innerText = data.budget + " $";
        document.querySelector("td.recettes").innerText = data.revenue + " $";
        document.querySelector(".date").innerText = "Sorti le " + data.release_date;
        document.querySelector(".note").innerText = data.vote_average + " / 10";
        document.querySelector("img.affiche").setAttribute("src", this.imgPath + "w500" + data.poster_path);
        document.querySelector("img").setAttribute("alt", data.title);

        if (data.overview === "") {

            document.querySelector(".description").innerText = "Sans description francophone";
        }
        else {
            document.querySelector("p").innerText = data.overview;
        }

        this.requeteActeur(data.id)
    }

    requeteActeur(movieId) {

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", this.retourActeur.bind(this));

        //xhr.open("GET", "https://api.themoviedb.org/3/movie/%7Bmovie_id%7D/credits?api_key=%3C%3Capi_key%3E%3E");
        xhr.open("GET", this.baseURL + "movie/ " + movieId + "/credits?api_key=" + this.APIKey);

        xhr.send();
    }

    retourActeur(e) {

        var target = e.currentTarget;

        var data;

        if (target.readyState === target.DONE) {

            data = JSON.parse(target.responseText).cast;

            this.afficheActeur(data);
        }
    }

    afficheActeur(data){

        console.log(data);



        for (var i = 0; i < this.totalFilm; i++) {

            var unActeur = document.querySelector(".template>.acteur").cloneNode(true);

            unActeur.querySelector("h3").innerText = data[i].name;



            unActeur.querySelector("img").setAttribute("src", this.imgPath + "w185" + data[i].profile_path);
            unActeur.querySelector("img").setAttribute("alt", data[i].title);

console.log("allo");

            document.querySelector(".liste-acteurs").appendChild(unActeur);



        }
    }

    /////////////////////

    requeteNouveauFilm(movieId) {

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", this.retourInfoFilm.bind(this));

        // xhr.open("GET", "https://api.themoviedb.org/3/movie/%7Bmovie_id%7D?language=en-US&api_key=%3C%3Capi_key%3E%3E");
        xhr.open("GET", this.baseURL + "movie/" + movieId + "?language=" + this.lang + "&api_key=" + this.APIKey);

        xhr.send();
    }

    retourNouveauFilm(e) {

        var target = e.currentTarget;

        var data;

        if (target.readyState === target.DONE) {

            data = JSON.parse(target.responseText);
            console.log(data);
            this.afficheNouveauFilm(data);
        }
    }

    // afficheNouveauFilm(data) {
    //
    //     for (var i = 0; i < this.totalFilm; i++) {
    //         var unFilm = document.querySelector(".template .swiper-slide").cloneNode(true);
    //
    //         console.log(unFilm);
    //
    //         unFilm.querySelector(".h1").innerText = data[i].title;
    //
    //         unFilm.querySelector(".swiper-note").innerText = data[i].vote_average + " / 10";
    //         unFilm.querySelector("img").setAttribute("src", this.imgPath + "w500" + data[i].poster_path);
    //         unFilm.querySelector("img").setAttribute("alt", data[i].title);
    //
    //         document.querySelector("header").appendChild(unFilm);
    //
    //         //swiper.appendSlide(unFilm);
    //         swiper.update();
    //
    //         console.log("allo");
    //     }
    // }
}