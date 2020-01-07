class MyElement extends HTMLElement {

  static get observedAttributes() {

    return ['disabled'];

  }

  constructor() {

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `

<style>

.disabled {

opacity: 0.4;

}

</style>

<div id= "container"></div>

`;

    this.container = this.shadowRoot('#container');

  }

  attributeChangedCallback(attr, oldVal, newVal) {

    if (attr === 'disabled') {

      if (this.disabled) {

        this.container.classList.add('disabled');

      }

      else {

        this.container.classList.remove('disabled')

      }

    }

  }

}
