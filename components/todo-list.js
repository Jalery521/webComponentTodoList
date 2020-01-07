; (function () {
  class TodoList extends HTMLElement {
    static get observedAttributes() {
      return ['table-data']
    }
    constructor() {
      super()
      this.tableData = []
      const shadowRoot = this.attachShadow({ mode: 'open' })
      const ul = document.createElement('ul')
      ul.addEventListener('click', this.handleToDo.bind(this))
      shadowRoot.appendChild(ul)
    }
    attributeChangedCallback() {
      console.log('attr is update')
      this.handleTableData()
    }
    handleTableData() {
      this.tableData = JSON.parse(this.getAttribute('table-data') || '[]')
      const liEls = this.tableData.map((todo, index) => {
        return `<li>
        <input type="text" value="${todo}" disabled />
        <button data-todo="${todo}" data-category="edit">修改</button>
        <button style="display:none" data-todo="${todo}" data-category="save">保存</button>
        <button data-todo="${todo}" data-category="del">删除</button>
        </li>`
      })
      const ul = this.shadowRoot.querySelector('ul')
      ul.innerHTML = liEls.join('')
    }

    handleToDo(e) {
      const { target } = e
      const { tagName } = target
      if (tagName.toLocaleLowerCase() !== 'button') return
      const { todo, category } = target.dataset
      const $index = this.tableData.findIndex((item) => item === todo)
      // 删除时找到index传递到父组件处理
      if (category === 'del') {
        this.dispatchEvent(new CustomEvent('del-todo', {
          detail: {
            index: $index
          }
        }))
      } else {
        const $liEl = target.parentNode
        const $children = $liEl.children
        if (category === 'edit') {
          // 点击编辑时取消input的disabled属性
          $children[0].disabled = false
          $children[1].style.display = 'none'
          $children[2].style.display = 'inline-block'
        } else {
          // 点击保存的时候判断更改后的值不与其他相同,然后交给父组件处理
          const $value = $children[0].value.trim()
          const isRepetition = this.tableData.find((item, index) => index !== $index && $value === item)
          if (!$value) {
            return alert('不可修改为空,如不需要可删除!')
          }
          if (isRepetition) {
            return alert('与已存在的代办重复,请修改!')
          }
          this.dispatchEvent(new CustomEvent('edit-todo', {
            detail: {
              index: $index,
              value: $value
            }
          }))
        }
      }
    }
  }
  customElements.define('todo-list', TodoList)
})()
