// modulo App
import Navbar from "./views/components/navbar/Navbar";
import Home from "./views/components/home/Home";
import Footer from "./views/components/footer/Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App {
  constructor() {
    this.init();
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
    this.app.innerHTML = Navbar.render() + Home.render() + Footer.render();
  }
}

const app = new App();
