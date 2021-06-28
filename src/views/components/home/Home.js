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

        for (let i = 0; i < data.results.length; i++) {
          tmp = data.results[i];
          list.push(
            new Movie(
              tmp.title,
              tmp.overview,
              tmp.poster_path,
              tmp.release_date,
              "detailsButton" + i,
              "favoriteBtn" + i,
              tmp.id
            )
          );
        }

        this.list = list;
        this.favorites = [];
        this.initFavorites();
        this.showCards(this.list);
      });
  }

  //Shows the bootstrap cards using the values from the parameter of the function
  showCards(values) {
    let obj = "";
    for (let i = 0; i < values.length; i++) {
      obj += `
        <div class="card">
            <img class="card-img-top" src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${values[i].poster_path}"
            alt="Card image cap"></img>
            <div class="card-body">
                <h5 class="card-title">${values[i].title}</h5>
                <p class="card-text">${values[i].overview}</p>
                <div class="btn-div">
                    <a class ="btn btn-primary" value="no" id="${values[i].favoriteBtn}"><i class="far fa-star"></i></a>
                    <a class="btn btn-primary" id="${values[i].btnId}">Details</a>
                </div>
            </div>
        </div>
        `;
    }
    document.getElementById("films").innerHTML = obj;
    this.addActionListener(values);
    this.updateFavorites();
  }

  //searches for the string written in the searchbox and shows all the cards whose title contains the string
  searchFilm() {
    let value = document.getElementById("search").value;
    let res = [];

    for (let i = 0; i < this.list.length; i++) {
      let str = this.list[i].title.toUpperCase();
      if (str.search(value.toUpperCase()) >= 0) {
        res.push(this.list[i]);
      }
    }
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

    for (let i = 0; i < favorites.length; i++) {
      for (let j = 0; j < this.list.length; j++) {
        if (favorites[i] == this.list[j].id) {
          movies.push(this.list[j]);
        }
      }
    }

    this.showCards(movies);
    this.updateFavorites();
    document.getElementById("filmSelection").innerHTML = "Favorites";
  }

  //initializes favorite films
  initFavorites() {
    let favorites = localStorage.getItem("favorites");
    favorites = JSON.parse(favorites);

    for (let i = 0; i < favorites.length; i++) {
      this.favorites.push(favorites[i]);
    }
  }

  //updates the favorite buttons
  updateFavorites() {
    let favorites = localStorage.getItem("favorites");
    favorites = JSON.parse(favorites);
    let tmp;

    for (let i = 0; i < this.list.length; i++) {
      for (let j = 0; j < this.list.length; j++) {
        if (this.list[i].id == this.favorites[j]) {
          tmp = document.getElementById(this.list[i].favoriteBtn).firstChild;
          tmp.setAttribute("data-prefix", "fas");
          tmp.classList.remove("far");
          tmp.classList.add("fas");
        }
      }
    }
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
