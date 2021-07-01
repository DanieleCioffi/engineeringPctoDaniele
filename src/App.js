// modulo App
import Navbar from "./views/components/navbar/Navbar";
import Home from "./views/components/home/Home";
import Footer from "./views/components/footer/Footer";
import Details from "./views/components/details/Details";
import Route from "./Route";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import route from "color-convert/route";

class App {
  constructor(header, home, footer, details) {
    this.init();
    this.header = new Navbar();
    this.home = new Home();
    this.footer = new Footer();
    this.details = new Details();
  }

  /**
   * Inizializzazione
   */
  init() {
    this.initAppDOMElement();
    this.bootstrap();
  }

  /**
   * Handler dell'evento load della pagina principale
   * Esegue il bootstrap dell'applicazione
   */
  bootstrap() {
    window.addEventListener("load", this.render.bind(this));
  }

  /**
   * Ottiene il nodo DOM principale sul quale rendere l'applicazione
   */
  initAppDOMElement() {
    this.app = null || document.getElementById("app");
  }

  /**
   * Metodo di render dell'applicazione principale
   * dove è definito il layout generale dell'applicazione
   */
  render() {
    this.app.innerHTML =
      this.header.render() +
      "<div id ='main-container'>" +
      this.home.render() +
      "</div>" +
      this.footer.render();

    this.home.init();

    history.pushState({ page: 1 }, "title 1", "homepage");
    //this.map.set("/homepage", this.home);
    document.getElementById("titleWebSite").innerHTML = "homepage";
    this.addListener();
  }

  addListener() {
    window.onpopstate = () => {
      let path;
      const keys = [...Route.keys()];

      keys.forEach((element, index) => {
        if (element === location.pathname.split("/")[index + 1])
          path = location.pathname.split("/")[index + 1];
      });

      if (Route.has(path)) {
        const element = new (Route.get(path))();
        document.getElementById("main-container").innerHTML = element.render();
        element.init();
      }
    };
  }
}

const app = new App();
