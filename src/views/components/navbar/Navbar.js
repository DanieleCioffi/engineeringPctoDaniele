class Navbar {
  render() {
    return `<div id="container" class="container-fluid" >
            <p align="center">
                <img src="./src/Assets/logo.png" id="logo" class="rounded" width="50">
                <a id="title">Cinema</a>
                <button id="login" class="btn btn-primary">Log in</button>
                <button id="register" class="btn btn-secondary">Sign up</button>
            </p>
        </div>`;
  }
}

export default Navbar;
