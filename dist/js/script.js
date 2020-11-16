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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci1jb250YWluZXJcIikgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIHN3aXBlciA9IG5ldyBTd2lwZXIoJy5zd2lwZXItY29udGFpbmVyJywge1xyXG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgICBzcGFjZUJldHdlZW46IDMwLFxyXG4gICAgICAgICAgICBzbGlkZXNQZXJHcm91cDogMyxcclxuICAgICAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXBhZ2luYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0RWw6ICcuc3dpcGVyLWJ1dHRvbi1uZXh0JyxcclxuICAgICAgICAgICAgICAgIHByZXZFbDogJy5zd2lwZXItYnV0dG9uLXByZXYnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjb25uZXhpb24gPSBuZXcgTW92aWVEQigpO1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN3aXBlci1jb250YWluZXJcIikgPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgIHZhciBwYXJhbXMgPSAobmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbikpLnNlYXJjaFBhcmFtcztcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocGFyYW1zLmdldChcImlkXCIpKTtcclxuXHJcbiAgICAgICAgY29ubmV4aW9uLnJlcXVldGVJbmZvRmlsbShwYXJhbXMuZ2V0KFwiaWRcIikpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29ubmV4aW9uLnJlcXVldGVGaWxtUG9wdWxhaXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIC8qKiBTY3JvbGwgdG8gdG9wIGJ1dHRvbiBpbXBsZW1lbnRhdGlvbiBpbiB2YW5pbGxhIEphdmFTY3JpcHQgKEVTNiAtIEVDTUFTY3JpcHQgNikgKiovXHJcblxyXG4gICAgICAgIHZhciBpbnRlcnZhbElkID0gMDsgLy8gTmVlZGVkIHRvIGNhbmNlbCB0aGUgc2Nyb2xsaW5nIHdoZW4gd2UncmUgYXQgdGhlIHRvcCBvZiB0aGUgcGFnZVxyXG4gICAgICAgIHZhciAkc2Nyb2xsQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZsZWNoZScpOyAvLyBSZWZlcmVuY2UgdG8gb3VyIHNjcm9sbCBidXR0b25cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2Nyb2xsU3RlcCgpIHtcclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgd2UncmUgYXQgdGhlIHRvcCBhbHJlYWR5LiBJZiBzbywgc3RvcCBzY3JvbGxpbmcgYnkgY2xlYXJpbmcgdGhlIGludGVydmFsXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2luZG93LnNjcm9sbCgwLCB3aW5kb3cucGFnZVlPZmZzZXQgLSA1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzY3JvbGxUb1RvcCgpIHtcclxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gc2Nyb2xsU3RlcCgpIGV2ZXJ5IDE2LjY2IG1pbGxpc2Vjb25zXHJcbiAgICAgICAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbChzY3JvbGxTdGVwLCAxNi42Nik7XHJcbiAgICAgICAgfVxyXG5cclxuLy8gV2hlbiB0aGUgRE9NIGlzIGxvYWRlZCwgdGhpcyBjbGljayBoYW5kbGVyIGlzIGFkZGVkIHRvIG91ciBzY3JvbGwgYnV0dG9uXHJcbiAgICAgICAgJHNjcm9sbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNjcm9sbFRvVG9wKTtcclxuICAgIH0pO1xyXG5cclxuY2xhc3MgTW92aWVEQiB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlBhcmZhaXQgMlwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5BUElLZXkgPSBcImVkYTAxYWQ5NWIxMjRjMmJlMWI1ZjQzMDhkODc2NDhmXCI7XHJcblxyXG4gICAgICAgIHRoaXMubGFuZyA9IFwiZnItQ0FcIjtcclxuXHJcbiAgICAgICAgdGhpcy5iYXNlVVJMID0gXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL1wiO1xyXG5cclxuICAgICAgICB0aGlzLmltZ1BhdGggPSBcImh0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL1wiO1xyXG5cclxuICAgICAgICB0aGlzLmxhcmdldXJBZmZpY2hlID0gW1wiOTJcIiwgXCIxNTRcIiwgXCIxODVcIiwgXCIzNDJcIiwgXCI1MDBcIiwgXCI3ODBcIl07XHJcblxyXG4gICAgICAgIHRoaXMubGFyZ2V1clRldGVBZmZpY2hlID0gW1wiNDVcIiwgXCIxODVcIl07XHJcblxyXG4gICAgICAgIHRoaXMudG90YWxGaWxtID0gOTtcclxuXHJcbiAgICAgICAgdGhpcy50b3RhbEFjdGV1ciA9IDY7XHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWV0ZUZpbG1Qb3B1bGFpcmUoKSB7XHJcblxyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIHRoaXMucmV0b3VyRmlsbVBvcHVsYWlyZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy94aHIub3BlbihcIkdFVFwiLCBcImh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvbW92aWUvcG9wdWxhcj9wYWdlPTEmbGFuZ3VhZ2U9ZW4tVVMmYXBpX2tleT0lM0MlM0NhcGlfa2V5JTNFJTNFXCIpO1xyXG4gICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIHRoaXMuYmFzZVVSTCArIFwibW92aWUvcG9wdWxhcj9wYWdlPTEmbGFuZ3VhZ2U9XCIgKyB0aGlzLmxhbmcgKyBcIiZhcGlfa2V5PVwiICsgdGhpcy5BUElLZXkpO1xyXG5cclxuICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldG91ckZpbG1Qb3B1bGFpcmUoZSkge1xyXG5cclxuICAgICAgICB2YXIgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5yZWFkeVN0YXRlID09PSB0YXJnZXQuRE9ORSkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLnJlc3VsdHM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFmZmljaGVGaWxtUG9wdWxhaXJlKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWZmaWNoZUZpbG1Qb3B1bGFpcmUoZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG90YWxGaWxtOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1bkFydGljbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlbXBsYXRlPi5maWxtXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaDFcIikuaW5uZXJUZXh0ID0gZGF0YVtpXS50aXRsZTtcclxuXHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiLmRhdGVcIikuaW5uZXJUZXh0ID0gXCJTb3J0aSBsZSBcIiArIGRhdGFbaV0ucmVsZWFzZV9kYXRlO1xyXG5cclxuICAgICAgICAgICAgdW5BcnRpY2xlLnF1ZXJ5U2VsZWN0b3IoXCIubm90ZVwiKS5pbm5lclRleHQgPSBkYXRhW2ldLnZvdGVfYXZlcmFnZSArIFwiIC8gMTBcIjtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhW2ldLm92ZXJ2aWV3ID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvblwiKS5pbm5lclRleHQgPSBcIlNhbnMgZGVzY3JpcHRpb25cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uXCIpLmlubmVyVGV4dCA9IGRhdGFbaV0ub3ZlcnZpZXc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpLnNldEF0dHJpYnV0ZShcInNyY1wiLCB0aGlzLmltZ1BhdGggKyBcInc1MDBcIiArIGRhdGFbaV0ucG9zdGVyX3BhdGgpO1xyXG4gICAgICAgICAgICB1bkFydGljbGUucXVlcnlTZWxlY3RvcihcImltZ1wiKS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgZGF0YVtpXS50aXRsZSk7XHJcbiAgICAgICAgICAgIHVuQXJ0aWNsZS5xdWVyeVNlbGVjdG9yKFwiYVwiKS5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiZmljaGUtZmlsbS5odG1sP2lkPVwiICsgZGF0YVtpXS5pZCk7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3RlLWZpbG1zXCIpLmFwcGVuZENoaWxkKHVuQXJ0aWNsZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlcXVldGVOb3V2ZWF1RmlsbSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbi8vICAgIHJlcXVldGUgcG91ciB1biBmaWxtIGVuIHBhcnRpY3VsaWVyXHJcblxyXG4gICAgcmVxdWV0ZUluZm9GaWxtKG1vdmllSWQpIHtcclxuXHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgdGhpcy5yZXRvdXJJbmZvRmlsbS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy8geGhyLm9wZW4oXCJHRVRcIiwgXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL21vdmllLyU3Qm1vdmllX2lkJTdEP2xhbmd1YWdlPWVuLVVTJmFwaV9rZXk9JTNDJTNDYXBpX2tleSUzRSUzRVwiKTtcclxuICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIm1vdmllL1wiICsgbW92aWVJZCArIFwiP2xhbmd1YWdlPVwiICsgdGhpcy5sYW5nICsgXCImYXBpX2tleT1cIiArIHRoaXMuQVBJS2V5KTtcclxuXHJcbiAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXRvdXJJbmZvRmlsbShlKSB7XHJcblxyXG4gICAgICAgIHZhciB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAgIHZhciBkYXRhO1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0LnJlYWR5U3RhdGUgPT09IHRhcmdldC5ET05FKSB7XHJcblxyXG4gICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh0YXJnZXQucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWZmaWNoZUluZm9GaWxtKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZmZpY2hlSW5mb0ZpbG0oZGF0YSkge1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmgxXCIpLmlubmVyVGV4dCA9IGRhdGEudGl0bGU7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRkLmxhbmd1ZVwiKS5pbm5lclRleHQgPSBkYXRhLm9yaWdpbmFsX2xhbmd1YWdlO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0ZC5kdXJlZVwiKS5pbm5lclRleHQgPSBkYXRhLnJ1bnRpbWUgKyBcIiBtaW51dGVzXCI7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRkLmJ1ZGdldFwiKS5pbm5lclRleHQgPSBkYXRhLmJ1ZGdldCArIFwiICRcIjtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGQucmVjZXR0ZXNcIikuaW5uZXJUZXh0ID0gZGF0YS5yZXZlbnVlICsgXCIgJFwiO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0ZVwiKS5pbm5lclRleHQgPSBcIlNvcnRpIGxlIFwiICsgZGF0YS5yZWxlYXNlX2RhdGU7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ub3RlXCIpLmlubmVyVGV4dCA9IGRhdGEudm90ZV9hdmVyYWdlICsgXCIgLyAxMFwiO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbWcuYWZmaWNoZVwiKS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdGhpcy5pbWdQYXRoICsgXCJ3NTAwXCIgKyBkYXRhLnBvc3Rlcl9wYXRoKTtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhLnRpdGxlKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEub3ZlcnZpZXcgPT09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25cIikuaW5uZXJUZXh0ID0gXCJTYW5zIGRlc2NyaXB0aW9uIGZyYW5jb3Bob25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwicFwiKS5pbm5lclRleHQgPSBkYXRhLm92ZXJ2aWV3O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZXF1ZXRlQWN0ZXVyKGRhdGEuaWQpXHJcbiAgICB9XHJcblxyXG4gICAgcmVxdWV0ZUFjdGV1cihtb3ZpZUlkKSB7XHJcblxyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIHRoaXMucmV0b3VyQWN0ZXVyLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICAvL3hoci5vcGVuKFwiR0VUXCIsIFwiaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9tb3ZpZS8lN0Jtb3ZpZV9pZCU3RC9jcmVkaXRzP2FwaV9rZXk9JTNDJTNDYXBpX2tleSUzRSUzRVwiKTtcclxuICAgICAgICB4aHIub3BlbihcIkdFVFwiLCB0aGlzLmJhc2VVUkwgKyBcIm1vdmllLyBcIiArIG1vdmllSWQgKyBcIi9jcmVkaXRzP2FwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSk7XHJcblxyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyQWN0ZXVyKGUpIHtcclxuXHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgICAgdmFyIGRhdGE7XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXQucmVhZHlTdGF0ZSA9PT0gdGFyZ2V0LkRPTkUpIHtcclxuXHJcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHRhcmdldC5yZXNwb25zZVRleHQpLmNhc3Q7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFmZmljaGVBY3RldXIoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFmZmljaGVBY3RldXIoZGF0YSl7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50b3RhbEZpbG07IGkrKykge1xyXG5cclxuICAgICAgICAgICAgdmFyIHVuQWN0ZXVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50ZW1wbGF0ZT4uYWN0ZXVyXCIpLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHVuQWN0ZXVyLnF1ZXJ5U2VsZWN0b3IoXCJoM1wiKS5pbm5lclRleHQgPSBkYXRhW2ldLm5hbWU7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIHVuQWN0ZXVyLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc2V0QXR0cmlidXRlKFwic3JjXCIsIHRoaXMuaW1nUGF0aCArIFwidzE4NVwiICsgZGF0YVtpXS5wcm9maWxlX3BhdGgpO1xyXG4gICAgICAgICAgICB1bkFjdGV1ci5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhW2ldLnRpdGxlKTtcclxuXHJcbmNvbnNvbGUubG9nKFwiYWxsb1wiKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdGUtYWN0ZXVyc1wiKS5hcHBlbmRDaGlsZCh1bkFjdGV1cik7XHJcblxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIHJlcXVldGVOb3V2ZWF1RmlsbShtb3ZpZUlkKSB7XHJcblxyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIHRoaXMucmV0b3VySW5mb0ZpbG0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vIHhoci5vcGVuKFwiR0VUXCIsIFwiaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9tb3ZpZS8lN0Jtb3ZpZV9pZCU3RD9sYW5ndWFnZT1lbi1VUyZhcGlfa2V5PSUzQyUzQ2FwaV9rZXklM0UlM0VcIik7XHJcbiAgICAgICAgeGhyLm9wZW4oXCJHRVRcIiwgdGhpcy5iYXNlVVJMICsgXCJtb3ZpZS9cIiArIG1vdmllSWQgKyBcIj9sYW5ndWFnZT1cIiArIHRoaXMubGFuZyArIFwiJmFwaV9rZXk9XCIgKyB0aGlzLkFQSUtleSk7XHJcblxyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0b3VyTm91dmVhdUZpbG0oZSkge1xyXG5cclxuICAgICAgICB2YXIgdGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5yZWFkeVN0YXRlID09PSB0YXJnZXQuRE9ORSkge1xyXG5cclxuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UodGFyZ2V0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmFmZmljaGVOb3V2ZWF1RmlsbShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWZmaWNoZU5vdXZlYXVGaWxtKGRhdGEpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvdGFsRmlsbTsgaSsrKSB7XHJcbiAgICAvLyAgICAgICAgIHZhciB1bkZpbG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlbXBsYXRlIC5zd2lwZXItc2xpZGVcIikuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2codW5GaWxtKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIHVuRmlsbS5xdWVyeVNlbGVjdG9yKFwiLmgxXCIpLmlubmVyVGV4dCA9IGRhdGFbaV0udGl0bGU7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICB1bkZpbG0ucXVlcnlTZWxlY3RvcihcIi5zd2lwZXItbm90ZVwiKS5pbm5lclRleHQgPSBkYXRhW2ldLnZvdGVfYXZlcmFnZSArIFwiIC8gMTBcIjtcclxuICAgIC8vICAgICAgICAgdW5GaWxtLnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuc2V0QXR0cmlidXRlKFwic3JjXCIsIHRoaXMuaW1nUGF0aCArIFwidzUwMFwiICsgZGF0YVtpXS5wb3N0ZXJfcGF0aCk7XHJcbiAgICAvLyAgICAgICAgIHVuRmlsbS5xdWVyeVNlbGVjdG9yKFwiaW1nXCIpLnNldEF0dHJpYnV0ZShcImFsdFwiLCBkYXRhW2ldLnRpdGxlKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoZWFkZXJcIikuYXBwZW5kQ2hpbGQodW5GaWxtKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIC8vc3dpcGVyLmFwcGVuZFNsaWRlKHVuRmlsbSk7XHJcbiAgICAvLyAgICAgICAgIHN3aXBlci51cGRhdGUoKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiYWxsb1wiKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbn0iXSwiZmlsZSI6InNjcmlwdC5qcyJ9
