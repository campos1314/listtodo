import './App.css';
import { useState, useEffect} from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';


const api = 'http://localhost:5000';

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);



  // Load todo on page load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(api + "/todo")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => err);

      setLoading(false);

      setTodos(res);
    };

    loadData();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault()

    const todos = {
      id:Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(api + '/todo',{
      method: "POST",
      //vai transformar em uma string
      body: JSON.stringify(todos),
      headers:{
        "Content-Type":"application/json"
      },

    });
    setTodos((prevState)=>[...prevState, todos])

    setTitle("");
    setTime("");

  };

  const handleDone = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(api + "/todo/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  const handleDelete = async (id) => {
    await fetch(api + "/todo/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };


  if(loading){
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
        <div className='todo-header'>
          <h1>Lista Para Fazer</h1>
        </div>
      <div className='todo-form'>
          <h2>Insira a sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
            <div className='control-form'>
              <label htmlFor='title'>O que vc vai fazer?</label>
              <input
                type="text"
                name="title"
                placeholder="Título da tarefa"
                onChange={(e) => setTitle(e.target.value)}
                value={title || ""}
                required
              />
            </div>
            <div className="control-form">
            <label htmlFor="time">Duração:</label>
            <input
              type="text"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time}
              required
            />
          </div>
          <input type="submit" value="Criar Tarefa" />

        </form>
      </div>
      <div className='todo-list'>
        <h2>Listas de tarefa</h2>
        {todos.length === 0 && <p>Não há tarefas para fazer</p>}
        {todos.map((todo)=>(
          <div className='todo' key={todo.id}>
              <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
              <p>Duração: {todo.time}h</p> 
              <div className='actions'>
              <span onClick={() => handleDone(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
              </div>
          </div>
        ))}
      </div>      
    </div>
  );
}

export default App;
