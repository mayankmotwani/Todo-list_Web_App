import {useState, useEffect} from "react"; 
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState("Todos not yet fetched");
  const [todoUnderEdit, setTodoUnderEdit] = useState(null);

  useEffect(() => {
      const json = localStorage.getItem("todos");
      const loadedTodos = JSON.parse(json);
      if (loadedTodos)
        setTodos(loadedTodos);
  }, []);

  useEffect(() => {
      if (todos !== "Todos not yet fetched") {
          const json = JSON.stringify(todos);
          localStorage.setItem("todos", json);
      }
  }, [todos]);
  
  function handleSubmit(e) {
      e.preventDefault();

      let todoText = document.getElementById('todoAdd').value;
      const newTodo = {
        id: new Date().getTime(),
        text: todoText.trim(),
        completed: false
      };
      if (newTodo.text.length > 0)
        setTodos([...todos].concat(newTodo));
      else alert("Enter valid task!");
      document.getElementById('todoAdd').value = "";
  }
  
  function deleteTodo(id) {
      let updatedTodos = [...todos].filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
  }

  function toggleComplete(id) {
      let updatedTodos = [...todos].map((todo) => {
          if (todo.id === id)
            todo.completed = !todo.completed;
          return todo;
      });
      setTodos(updatedTodos);
  }

  function submitEdits(id) {
    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === id)
        todo.text = document.getElementById(id).value;
      return todo;
    });
    setTodos(updatedTodos);
    setTodoUnderEdit(null);
  }
  
  return(
    <div id="todo-list">
        {/* Heading */}
        <h1>My Todo List</h1>
        <form onSubmit={handleSubmit}>
            {/* New Todo input and submit button*/}
            <input type="text" id="todoAdd" placeholder="Add a new task"/>
            <button type="submit">Add Todo</button>
        </form>
        {todos !== "Todos not yet fetched" &&
        todos.map((todo) => (
            <div className="todo" key={todo.id}>
                <div className="todo-text">
                    {/* Todo checkbox */}
                    <input type="checkbox" id="completed" checked={todo.completed} onChange={() => toggleComplete(todo.id)}/>
                    {/* If editing mode, then input box, otherwise todo text */}
                    {todo.id === todoUnderEdit ?
                    (<input type="text" id={todo.id} defaultValue={todo.text}/>) : 
                    (<div className={todo.completed ? 'strike' : ''}>{todo.text}</div>)}
                </div>
                <div className="todo-actions">
                    {/* If editing mode, then Submit edits button, otherwise Edit button */}
                    {todo.id === todoUnderEdit ?
                    (<button onClick={() => submitEdits(todo.id)}>Submit Edits</button>) :
                    (<button onClick={() => setTodoUnderEdit(todo.id)}>Edit</button>)}
                    {/* Delete todo button */}
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
            </div>
        ))}
    </div>
  );
};

export default App;
