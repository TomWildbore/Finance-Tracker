import { useState, useEffect } from "react";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const userId = 1;

  useEffect(() => {
    fetch(`http://localhost:8080/users/${userId}/transactions`)
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  const addTransaction = async () => {
    await fetch(`http://localhost:8080/transactions/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        category: category,
        type: "EXPENSE",
        date: new Date().toISOString().split("T")[0]
      })
    });

    window.location.reload();
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Finance Tracker</h1>

      <h2>Add Transaction</h2>
      <input
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <button onClick={addTransaction}>Add</button>

      <h2>Transactions</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            £{t.amount} - {t.category} - {t.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;