import { useEffect, useState } from "react";


function App() {
  const[name, setName] = useState('');
  const[datetime, setDatetime] = useState('');
  const[description, setDescription] = useState('');
  const[transactions, setTransactions] = useState([]);
  useEffect(()=>{
    getTransactions().then(setTransactions)
  },[name]);
  
  async function getTransactions(){
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev){
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL+'/transaction';
    const price = name.split(' ')[0];

    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        price,
        name:name.substring(price.length+1),
        description,
        datetime,
      }),
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDescription('');
        setDatetime('');
        console.log('result',json);
      })
    })
  }

  let balance=0;
  for(const transaction of transactions){
    balance = balance+transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  return (
    <div>
       <main>
      <h1>
        ₹ {balance}
        <span>.{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder={"price and name"}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={event => setDatetime(event.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={event => setDescription(event.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {
          transactions.length>0 && transactions.map(transaction =>(

            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={`price ${transaction.price<0?'red':'green'}`}>{transaction.price}</div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))
        }
      </div>
    </main>
    </div>
  );
}

export default App;
