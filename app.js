var express = require('express');
var expressLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var app = express();
var TodoList = require('./models').TodoList;
var Todo = require('./models').Todo;
var TodoMore = require('./models').TodoMore;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))

//shows all todo lists
app.get('/', function (request, response) {
  TodoList.findAll().then(function(todoLists){
    response.render('index', {todoLists: todoLists})
  }).catch(function(error){
    response.send("Error, couldn't fetch TodoLists")
  })
})

//shows each todo list on a seperate page
app.get('/todo-list/:id', function(request, response){
  TodoList.findById(request.params.id,
    {include: [{
      model: Todo,
      as: 'todos'
    }]
  }).then(function(todoList){
    response.render('todo-list', {todoList: todoList, todos: todoList.todos})
  }).catch(function(error){
    response.send("Error, couldn't fetch TodoList")
  })
})

//marks each todo list item as complete with a green strikethrough
app.post('/todo-list/:todoListId/todo/:id/complete', function(request, response){
  Todo.findById(request.params.id).then(function(todo){
    todo.isComplete = true
    return todo.save()
  }).then(function(todo){
    response.redirect("/todo-list/" + request.params.todoListId)
  }).catch(function(error){
    response.send("Error, couldn't fetch Todo")
  })
})

//creates a new todo item & displays it in the list
app.post('/todo-list/:todoListId/todo/new', function(request, response){
  TodoList.findById(request.params.todoListId).then(function(todoList){
    return todoList.createTodo({
      name: request.body.name,
      isComplete: false
    })
  }).then(function(todo){
    response.redirect("/todo-list/" + request.params.todoListId)
  }).catch(function(error){
    response.send("Error, couldn't create Todo")
  })
})

//Deletes a todo item
app.post('/todo-list/:todoListId/todo/:id/delete', function(request, response){
  Todo.findById(request.params.id).then(function(todo){
    return todo.destroy()
  }).then(function(todo){
    response.redirect("/todo-list/" + request.params.todoListId)
  }).catch(function(error){
    response.send("Error, couldn't fetch Todo")
  })
})

//Creates a new Todo list
app.post('/todo-list/new', function(request, response){
    TodoList.create({
        name: request.body.name
    }).then(function(todo){
      response.redirect('/')
  }).catch(function(error){
    response.send("Error, couldn't create New Todo List")
  })
})

//Removes Todo lists
app.post('/todo-list/:id/delete',function(request, response){
    TodoList.findById(request.params.id).then(function(todo){
        return todo.destroy()
    }).then(function(todo){
        response.redirect("/")
    }).catch(function(error){
        response.send("Error, couldn't remove Todo list")
    })
})

app.listen(3000, function () {
 console.log('Example app listening on port 3000!');
});
