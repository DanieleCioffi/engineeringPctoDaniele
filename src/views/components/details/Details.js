class Details {
  constructor() {}

  render() {
    this.location = location.pathname;
    this.movieId = location.pathname.split("/")[2];
    console.log(this.movieId);

    fetch(
      `https://api.themoviedb.org/3/movie/${this.movieId}?api_key=c4d79d0d1e50bf8bc86b7afbd240e4df&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("main-container").innerHTML = `
            <div class ="center-div" id="topDiv">
                <div class="card mb-3" id="details">
                    <div class="row no-gutters">
                        <div class="col-md-3">
                            <img src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${data.poster_path}" class="img-fluid" alt="Responsive image">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body" id="cardBody">
                                <div>
                                    <h5 class="card-title" id="detailsTitle"></h5>
                                    <p class="card-text" id="detailsText"></p>
                                </div>
                                <div class="btn-div">
                                    <button class="btn btn-primary" id="backBtn">Back</button>
                                    <button class="btn btn-primary"id="trailerBtn">Trailer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("detailsTitle").innerHTML = data.title;
        document.getElementById("detailsText").innerHTML = data.overview;
        this.addActionListener();
      });
  }

  addActionListener() {
    document.getElementById("backBtn").addEventListener("click", () => {
      window.history.back();
    });

    document.getElementById("trailerBtn").addEventListener("click", () => {
      history.pushState({ page: 3 }, "title 3", location.pathname + "/trailer");
      this.showTrailer();
    });
  }

  showTrailer() {
    fetch(
      `https://api.themoviedb.org/3/movie/${this.movieId}/videos?api_key=c4d79d0d1e50bf8bc86b7afbd240e4df&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("main-container").innerHTML = `
            <div class="videoDiv">
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${data.results[0].key}" allowfullscreen></iframe>
                </div>
                <div class="btn-div">
                    <button class="btn btn-primary" id="backBtn">Back</button>
                </div>
                </div>
            </div>
        `;

        document.getElementById("backBtn").addEventListener("click", () => {
          window.history.back();
        });
      });
  }
}

export default Details;
