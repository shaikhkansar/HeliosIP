import logo from './logo.svg';
import './App.css';


function GetEntityFromChatID() {

  fetch("https://prod-03.centralindia.logic.azure.com:443/workflows/d3ee0df170f442c28f9d0aad00decdaf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TUxwXjMdAxOzXQKSNCBM80V4S4qEL9Mu7BlDKgBwe00",{
    method: "POST",
    headers : {
      Accept:"application/json",
      "Content-Type" : "application/json",
    },
    body : JSON.stringify(
     
        {
         "chatid": "19%3ameeting_MmUyNTVmMGEtNWQxZi00MjhiLWEwYzctMGI4NGEyZjE5OTY3%40thread.v2"
        }
      
    
    ),
    })
   .then(response => response.json())
   .then(data => console.log(data));



  return (
    <div className="App">

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Sample. Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default GetEntityFromChatID;