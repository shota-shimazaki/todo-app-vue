(function(){
  'use strict';

  var vm = new Vue({
    el:'#app',
    data:{
      newItem: '',
      todos:[],
      editedTodo: null,
      filter: 'all',
    },
    watch: {
      todos: {
        handler:function(){
          localStorage.setItem('todos', JSON.stringify(this.todos));
        },
        deep: true
      }
    },
    mounted:function(){
      this.todos=JSON.parse(localStorage.getItem('todos')) || [];
    },
    methods:{
      pluralize: function (word, count) {
        return word + (count === 1 ? '' : 's');
      },
      addItem:function(){
        if (this.newItem == ''){
          return;
        }
        var item = {
          title:this.newItem,
          isDone:false,
        };
        this.todos.push(item);
        this.newItem='';
      },
      editTodo: function (todo) {
        this.beforeEditCache = todo.title;
        this.editedTodo = todo;
      },
      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return;
        }
        if (todo.title.trim() == ''){
          todo.title = this.beforeEditCache
        }
        this.editedTodo = null;
        todo.title = todo.title.trim();
        if (!todo.title) {
          this.removeTodo(todo);
        }
      },
      cancelEdit: function (todo) {
        this.editedTodo = null;
        todo.title = this.beforeEditCache;
      },
      deleteItem:function(index){
        this.todos.splice(index, 1);
      },
      clear:function(){
        this.todos = this.todos.filter(function(todo){
          return !todo.isDone;
        });
      }
    },
    computed: {
      remaining:function(){
        var items = this.todos.filter(function(todo){
          return !todo.isDone;
        });
        return items.length;
      },
      todosFiltered(){
        if(this.filter == 'all'){
          return this.todos 
        } else if(this.filter == 'active'){
          return this.todos.filter(todo => !todo.isDone)
        } else if(this.filter == 'completed'){
          return this.todos.filter(todo => todo.isDone)
        }
        return this.todos
      }
    },
  });

})();