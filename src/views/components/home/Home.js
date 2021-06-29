class Home {
  constructor(list) {}

  render() {
    this.initList();
    return `
        <form class="d-flex" id="searchBar" style="width: max-content;">
            <input id="search" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button id="searchBtn"class="btn btn-outline-success" type ="button">Search</button>
            <button id="favoriteBtn"class="btn btn-outline-success" type ="button">Favorites</button>
        </form>
  
        <h1 align="center" id="filmSelection">Film selection</h1>
  
        <div id="films" class='row'></div>`;
  }

  //initializes the list using fetch from a server
  async initList() {
    fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=c4d79d0d1e50bf8bc86b7afbd240e4df&language=en&page=1"
    )
      .then((response) => response.json())
      .then((data) => {
        let list = [];
        let tmp;

        data.results.forEach((element, index) => {
          list.push(
            new Movie(
              element.title,
              element.overview,
              element.poster_path,
              element.release_date,
              "detailsButton" + index,
              "favoriteBtn" + index,
              element.id
            )
          );
        });

        this.list = list;
        this.favorites = [];
        this.initFavorites();
        this.showCards(this.list);
      });
  }

  //Shows the bootstrap cards using the values from the parameter of the function
  showCards(values) {
    let obj = "";

    values.forEach((element) => {
      obj += `
        <div class="card">
            <img class="card-img-top" src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${element.poster_path}"
            alt="Card image cap"></img>
            <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">${element.overview}</p>
                <div class="btn-div">
                    <a class ="btn btn-primary" value="no" id="${element.favoriteBtn}"><i class="far fa-star"></i></a>
                    <a class="btn btn-primary" id="${element.btnId}">Details</a>
                </div>
            </div>
        </div>
        `;
    });

    document.getElementById("films").innerHTML = obj;
    this.addActionListener(values);
    this.updateFavorites();
  }

  //searches for the string written in the searchbox and shows all the cards whose title contains the string
  searchFilm() {
    let value = document.getElementById("search").value;
    let res = [];
    let tmp;

    this.list.forEach((element) => {
      tmp = element.title.toUpperCase();
      if (tmp.search(value.toUpperCase()) >= 0) res.push(element);
    });

    this.showCards(res);
    this.updateFavorites();

    if (!value)
      document.getElementById("filmSelection").innerHTML = "Film selection";
    else document.getElementById("filmSelection").innerHTML = "Results";
  }

  //shows all the favorite movies as cards
  showFavorites() {
    let favorites = localStorage.getItem("favorites");
    favorites = JSON.parse(favorites);
    let movies = [];

    favorites.forEach((favorite) => {
      this.list.forEach((element) => {
        if (favorite == element.id) movies.push(element);
      });
    });

    this.showCards(movies);
    this.updateFavorites();
    document.getElementById("filmSelection").innerHTML = "Favorites";
  }

  //initializes favorite films
  initFavorites() {
    let favorites = localStorage.getItem("favorites");
    favorites = JSON.parse(favorites);

    if (favorites) {
      favorites = localStorage.getItem("favorites");
      favorites = JSON.parse(favorites);

      favorites.forEach((element) => {
        this.favorites.push(element);
      });
    }
  }

  //updates the favorite buttons
  updateFavorites() {
    let favorites = localStorage.getItem("favorites");
    favorites = JSON.parse(favorites);
    let tmp;

    this.list.forEach((element) => {
      this.favorites.forEach((favorite) => {
        if (element.id == favorite) {
          tmp = document.getElementById(element.favoriteBtn).firstChild;
          tmp.setAttribute("data-prefix", "fas");
          tmp.classList.remove("far");
          tmp.classList.add("fas");
        }
      });
    });
  }

  //actionListener for the search button and popstate events
  addActionListener(values) {
    for (let i = 0; i < values.length; i++) {
      document.getElementById(values[i].btnId).addEventListener("click", () => {
        history.pushState(
          { page: 1 },
          "title 2",
          location.pathname + "/" + values[i].id
        );
        window.dispatchEvent(new Event("popstate"));
        document.getElementById("titleWebSite").innerHTML = "details";
      });

      document
        .getElementById(values[i].favoriteBtn)
        .addEventListener("click", () => {
          let currentMovieId = values[i].id.toString();
          let icon = document.getElementById(values[i].favoriteBtn).firstChild;

          if (icon.getAttribute("data-prefix") == "far") {
            icon.setAttribute("data-prefix", "fas");

            this.favorites.push(currentMovieId);
            localStorage.setItem("favorites", JSON.stringify(this.favorites));
          } else if (icon.getAttribute("data-prefix") == "fas") {
            icon.setAttribute("data-prefix", "far");

            for (let j = 0; j < this.favorites.length; j++) {
              if (this.favorites[j] == currentMovieId) {
                this.favorites.splice(j, 1);
                localStorage.setItem(
                  "favorites",
                  JSON.stringify(this.favorites)
                );
              }
            }

            console.log(this.favorites);
          }
        });
    }

    document
      .getElementById("searchBtn")
      .addEventListener("click", this.searchFilm.bind(this));

    document
      .getElementById("favoriteBtn")
      .addEventListener("click", this.showFavorites.bind(this));
  }
}

//class that defines movie objects
class Movie {
  constructor(title, overview, poster_path, date, btnId, favoriteBtn, id) {
    this.title = title;
    this.overview = overview;
    this.poster_path = poster_path;
    this.date = date;
    this.totalOverview = this.cutOverview();
    this.btnId = btnId;
    this.favoriteBtn = favoriteBtn;
    this.id = id;
  }

  cutOverview() {
    const maxChar = 200;
    let res = this.overview;

    if (this.overview.length > maxChar) {
      this.overview = this.overview.slice(0, maxChar);
      this.overview += "...";
    }

    return res;
  }

  toString() {
    return this.title + " " + this.btnId;
  }
}

export default Home;
