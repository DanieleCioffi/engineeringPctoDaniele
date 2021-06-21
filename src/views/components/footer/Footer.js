class Footer {
  render() {
    return `
        <footer class="text-center text-white" style="background-color: #f1f1f1;">
            <div class="container pt-4">
                <img class="englogo" src = "./src/Assets/eng.png">
            </div>
            
            <div class="text-center text-dark p-3" style="background-color: rgba(0, 0, 0, 0.2);">
                © 2021 Copyright:
                <a class="text-dark" href="https://www.eng.it/">Engineering S.p.A.</a>
            </div>
        </footer>`;
  }
}

export default Footer;
