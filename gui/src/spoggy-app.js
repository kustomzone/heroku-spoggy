import {PolymerElement, html} from 'https://unpkg.com/@polymer/polymer@next/polymer-element.js?module';
//import './ide-current.js';

class SpoggyApp extends PolymerElement {

  static get properties() { return { mood: String }}

  static get template() {
    return html`
      <style> .mood { color: green; } </style>
      Web Components SPOGGY are <span class="mood">[[mood]]</span>!
      <br>
    <!--  <ide-current>ide-current chargement</ide-current>-->
flok a blop
Blik a Blop Filk Flok
    `;
  }
}

customElements.define('spoggy-app', SpoggyApp);
