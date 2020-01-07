; (function () {
  class TodoList extends HTMLElement {
    static get observedAttributes() {
      return ['table-data']
    }
    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      const ul = document.createElement('ul')
      shadowRoot.appendChild(ul)
    }
    attributeChangedCallback() {
      console.log('attr is update')
      this.handleTableData()
    }
    handleTableData() {
      const tableData = JSON.parse(this.getAttribute('table-data') || '[]')
      const liEls = tableData.map((todo) => `<li>${todo}</li>`)
      const ul = this.shadowRoot.querySelector('ul')
      ul.innerHTML = liEls.join('')
    }
  }
  customElements.define('todo-list', TodoList)
})()
