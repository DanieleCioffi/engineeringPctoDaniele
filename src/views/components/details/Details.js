class Details {
  constructor() {}

  render() {
    return `
        <div class="center">
        <div class="card mb-3" style="max-width:50%" id = "main-details">
        </div>
        </div>
    `;
  }

  init() {
    this.location = location.pathname;
    this.movieId = location.pathname.split("/")[3];
    this.data;
    this.trailer;
    console.log(this.movieId);

    fetch(
      `https://api.themoviedb.org/3/movie/${this.movieId}?api_key=c4d79d0d1e50bf8bc86b7afbd240e4df&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => {
        this.data = data;
        this.showDescription();
      });
  }

  addBackListener() {
    document.getElementById("backBtn").addEventListener("click", () => {
      this.trailer = null;
      window.history.back();
    });
  }

  addTrailerListener() {
    document.getElementById("trailerBtn").addEventListener("click", () => {
      this.showTrailer();
    });
  }

  addDescriptionListener() {
    document.getElementById("descriptionBtn").addEventListener("click", () => {
      this.showDescription();
    });
  }

  showDescription() {
    document.getElementById("main-details").innerHTML = `
        <div class="row no-gutters">
            <div class="col-md-4">
                <img src=https://www.themoviedb.org/t/p/w600_and_h900_bestv2${this.data.poster_path} class="img-fluid" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body" id="cardBody">
                    <h5 class="card-title" style="font-size: 2rem">${this.data.title}</h5>
                    <p class="card-text" id="descriptionContainer" style="font-size: 1rem">${this.data.overview}</p>
                    <div class="btn-div">
                        <button id="backBtn" class="btn btn-primary" >Back</button>
                        <button id="trailerBtn" style="float:right" class="btn btn-primary">Trailer</button>
                        <button id="descriptionBtn" class="btn btn-secondary" >Description</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("descriptionBtn").disabled = true;
    this.addBackListener();
    this.addTrailerListener();
  }

  async showTrailer() {
    if (!this.trailer) {
      await fetch(
        `https://api.themoviedb.org/3/movie/${this.movieId}/videos?api_key=c4d79d0d1e50bf8bc86b7afbd240e4df&language=en-US`
      )
        .then((response) => response.json())
        .then((data) => {
          this.trailer = data;
        });
    }

    document.getElementById("cardBody").innerHTML = `
        <h5 class="card-title" style="font-size: 2rem">${this.data.title}</h5>
        <div class="embed-responsive embed-responsive-4by3">
            <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${this.trailer.results[0].key}" allowfullscreen></iframe>
        </div>
        <div class="btn-div">
            <button class="btn btn-primary" id="backBtn">Back</button>
            <button class="btn btn-secondary" id="trailerBtn">Trailer</button>
            <button class="btn btn-primary" id="descriptionBtn">Description</button>
        </div>
    `;

    document.getElementById("trailerBtn").disabled = true;
    console.log(this.trailer.results[0].key);

    this.addBackListener();
    this.addDescriptionListener();
  }
}

export default Details;
