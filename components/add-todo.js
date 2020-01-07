; (function () {
  class AddTodo extends HTMLElement {
    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      const template = `
    <style>
     div {
       width: 300px;
       margin: 20px auto;
       height: 30px;
       display: flex;
     }
     input {
       border: 1px solid #f5f5f5;
       outline: none;
       flex:1
     }
     button {
       background-color: #ccc;
       color: red
     }
    </style>
     <div>
     <input type="text" />
     <button>增加代办</button>
     </div>
    `
      shadowRoot.innerHTML = template
      const $button = shadowRoot.querySelector('button')
      $button.addEventListener('click', this.addTodoItem.bind(this))
    }

    addTodoItem() {
      const input = this.shadowRoot.querySelector('input')
      const value = input.value.trim()
      if (!value) {
        alert('不可提交空代办!')
      } else {
        this.dispatchEvent(new CustomEvent('add-todo', {
          detail: {
            value
          }
        }))
      }
      input.value = ''
    }
  }
  customElements.define('add-todo', AddTodo)
})()
