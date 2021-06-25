class Home {
  constructor(list) {}

  render() {
    this.initList();
    return `
        <form class="d-flex" id="searchBar" style="width: max-content;">
            <input id="search" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button id="searchBtn"class="btn btn-outline-success" type ="button">Search</button>
        </form>
  
        <h1 align="center" id="filmSelection">Selezione film</h1>
  
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
          let icon = document.getElementById(values[i].favoriteBtn);
          console.log(icon.firstChild);

          if (icon.value === "no") {
            icon.value = "yes";
            icon.className = "fas fa-star";
            this.favorites.push(values[i].id);
          }
          if (icon.value === "si") {
            icon.value = "yes";
            icon.className = "far fa-star";
            this.favorites.pop(values[i].id);

            for (let j = 0; j < this.favorites.length; j++) {
              if (values[i].id === this.favorites[i].id)
                this.favorites.splice(j, 1);
            }
          }
        });
    }

    console.log(this.favorites);

    document
      .getElementById("searchBtn")
      .addEventListener("click", this.searchFilm.bind(this));
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
