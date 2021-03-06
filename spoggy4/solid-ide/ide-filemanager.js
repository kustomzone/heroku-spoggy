import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../src/shared-styles.js';
/*import "../spoggy/spoggy-input.js";
import "../spoggy/spoggy-vis.js";*/
/*import "../spoggy/my-element.js";*/


class IdeFilemanager extends PolymerElement {
  static get template() {
    return html`
    <style include="shared-styles">
    :host {
      display: block;

      padding: 10px;
    }
    </style>

    <div class="card">
    <div class="circle">IdeFilemanager</div>
    <div>  Current : {{current}}
    </div>

    <!--  <h1>Tutoriel</h1>
    <p>Modus commodo minimum eum te, vero utinam assueverit per eu.</p>
    <p>Ea duis bonorum nec, falli paulo aliquid ei eum.Has at minim mucius aliquam, est id tempor laoreet.Pro saepe pertinax ei, ad pri animal labores suscipiantur.</p>
    -6>    </div>

    <div class="card">
    <spoggy-input></spoggy-input><!--import "../spoggy/spoggy-input.js";-->
    <!--<solid-login id="solid-login"></solid-login>-->

    </div>
    `;
  }

  static get properties() {
    return {
      current: {type: Object, notify: true, observer: "currentChanged"},
    }
  }

  connectedCallback(){
    super.connectedCallback();

  }


  currentChanged(newValue, oldValue){
    console.log(newValue)
    console.log(oldValue)
    console.log("CURRENT FILE :",this.current)
  //  if(newValue.key == "file"){
    //  this.file = newValue
  //  }
  }

}

window.customElements.define('ide-filemanager', IdeFilemanager);
