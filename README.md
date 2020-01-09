## WebComponent

1.  使用window.CustomElementRegistry.define( 自定义组件名, 组件类 , 可选参数) 定义自定义组件,自定义组件名必须为包含短横线的字符串,不可为单个单词

2. 定义一个自定义元素/组件示例:

   ``` javascript
   class todoList extends HTMLElement {
       static get observedAttributes(){  // 需要监控的attr,切记attr不可为驼峰
             return[ 'todo-list'];
          }
       
       constructor(){
          super()  // 必须调用
       // 影子DOM 保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突
       //    this.attachShadow()方法开启 Shadow DOM , mode可选'open'/'closed'
       // open 表示你可以通过页面内的 JavaScript 方法来获取 Shadow DOM
       // mode设置为closed，那么就不可以在外部获取 Shadow DOM了    
         const shadowRoot = this.attachShadow({mode: 'open'})
         
       }
       
        // 声明周期介绍
         connectedCallback(){}  // 当元素插入dom时调用, 相当于vue中的mounted
         disconnectCallback(){} // 当元素从dom移除时调用,用户关闭浏览器或者浏览器tab的时候不会调用
         attributeChangedCallback(attr,oldVal,newVal){} //每当将属性添加到observedAttributes的数组中时，就会调用这个函数。这个方法调用时两个参数分别为旧值和新值。  
         adoptedCallback(){}  
   }
   ```

3. todoList代码演示

   ``` html
   // index.html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <meta http-equiv="X-UA-Compatible" content="ie=edge" />
       <title>todoList</title>
       <style>
         .todo-wrapper {
           width: 600px;
           margin: 0 auto;
         }
       </style>
     </head>
     <body>
       <div class="todo-wrapper">
         <add-todo id="add-todo-box"></add-todo>
         <todo-list id="todo-list-table"></todo-list>
       </div>
     </body>
     <script src="./components/todo-list.js"></script>
     <script src="./components/add-todo.js"></script>
     <script>
       ;(function() {
         const addTodoBox = document.querySelector('#add-todo-box')
         const todoListTable = document.querySelector('#todo-list-table')
         const tableData = []
         todoListTable.setAttribute('table-data', JSON.stringify(tableData))
         addTodoBox.addEventListener('add-todo', function(e) {
           const { value } = e.detail
           const isIn = tableData.find((todo) => todo.value === value)
           if (isIn) {
             alert('不可添加相同代办!')
           } else {
             tableData.push({ value })
             todoListTable.setAttribute('table-data', JSON.stringify(tableData))
           }
         })
         todoListTable.addEventListener('del-todo', function(e) {
           console.log(e)
           const { index } = e.detail
           tableData.splice(index, 1)
           todoListTable.setAttribute('table-data', JSON.stringify(tableData))
         })
         todoListTable.addEventListener('edit-todo', function(e) {
           console.log(e)
           const { index } = e.detail
           tableData[index].isEdit = true
           todoListTable.setAttribute('table-data', JSON.stringify(tableData))
         })
         todoListTable.addEventListener('save-todo', function(e) {
           const { index, value } = e.detail
        tableData[index] = { value }
           todoListTable.setAttribute('table-data', JSON.stringify(tableData))
         })
       })()
     </script>
   </html>
   
   
   ```
   
   ``` javascript
   // components/add-todo.js
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
   
   ```
   
   ``` javascript
   // components/todo-list.js
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
   
   ```
   
   

