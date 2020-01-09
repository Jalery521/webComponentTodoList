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
    attributeChangedCallback(attr) {
      console.log('attr is update', attr, this.getAttribute('table-data'))
      this.handleTableData()
    }
    handleTableData() {
      this.tableData = JSON.parse(this.getAttribute('table-data') || '[]')
      const liEls = this.tableData.map((todo) => {
        const isEdit = todo.isEdit === true
        const $editDisplay = isEdit ? 'none' : 'inline-block'
        const $saveDisplay = isEdit ? 'inline-block' : 'none'
        const $value = todo.value
        return `<li>
        <input type="text" value="${$value}" ${isEdit ? '' : 'disabled'} />
        <button data-value="${$value}" data-category="edit" style="display:${$editDisplay}" >修改</button>
        <button style="display:${$saveDisplay}" data-value="${$value}" data-category="save">保存</button>
        <button data-value="${$value}" data-category="del">删除</button>
        </li>`
      })
      const ul = this.shadowRoot.querySelector('ul')
      ul.innerHTML = liEls.join('')
    }

    handleToDo(e) {
      const { target } = e
      const { tagName } = target
      if (tagName.toLocaleLowerCase() !== 'button') return
      const { value, category } = target.dataset
      console.log(value)
      const $index = this.tableData.findIndex((item) => item.value === value)
      console.log($index)
      console.log(JSON.stringify({ detail: { index: $index } }))
      if (category === 'save') {
        // 点击保存的时候判断更改后的值不与其他相同,然后交给父组件处理
        const $liEl = target.parentNode
        const $value = $liEl.children[0].value.trim()
        if (!$value) {
          return alert('不可修改为空,如不需要可删除!')
        }
        this.dispatchEvent(new CustomEvent('save-todo', {
          detail: {
            index: $index,
            value: $value
          }
        }))
        // 删除时找到index传递到父组件处理
      } else if (category === 'del') {
        this.dispatchEvent(new CustomEvent('del-todo', {
          detail: {
            index: $index
          }
        }))
      } else {
        // 点击编辑时取消input的disabled属性
        this.dispatchEvent(new CustomEvent('edit-todo', {
          detail: {
            index: $index
          }
        }))
      }
    }
  }
  customElements.define('todo-list', TodoList)
})()
