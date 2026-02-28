import { useState, useEffect } from "react";
import Login from "./Login";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = user?.id;

  // 🚨 Show login if not logged in
  if (!user) {
    return <Login setUser={setUser} />;
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(
          `http://localhost:8080/users/${userId}`
        );
        const userData = await userRes.json();
        setUser(userData);

        const txRes = await fetch(
          `http://localhost:8080/users/${userId}/transactions`
        );
        const txData = await txRes.json();

        // ✅ Sort newest first
        const sorted = txData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(sorted);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // Add Transaction
  const addTransaction = async () => {
    if (!amount || !category) return;

    try {
      const response = await fetch(
        `http://localhost:8080/transactions/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            category,
            type,
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      const newTransaction = await response.json();

      setTransactions(prev => [
        newTransaction,
        ...prev,
      ]);

      setAmount("");
      setCategory("");
    } catch {
      setError("Failed to add transaction.");
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await fetch(`http://localhost:8080/transactions/${id}`, {
        method: "DELETE",
      });

      setTransactions(prev =>
        prev.filter(t => t.id !== id)
      );
    } catch {
      setError("Failed to delete transaction.");
    }
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Finance Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Balance" value={`£${balance.toFixed(2)}`} />
        <StatCard
          label="Income"
          value={`£${totalIncome.toFixed(2)}`}
          color="text-green-600"
        />
        <StatCard
          label="Expenses"
          value={`£${totalExpense.toFixed(2)}`}
          color="text-red-600"
        />
        <StatCard
          label="Transactions"
          value={transactions.length}
        />
      </div>

      {/* Add Transaction */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Add Transaction
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded-xl w-full md:w-40"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded-xl w-full md:w-40"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />

          <select
            className="border p-2 rounded-xl w-full md:w-40"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>

          <button
            onClick={addTransaction}
            disabled={!amount || !category}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition disabled:bg-gray-400"
          >
            Add
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-6">
          Recent Transactions
        </h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500">
            No transactions yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {transactions.map(t => (
              <li
                key={t.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium">
                    {t.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.date}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold ${
                      t.type === "INCOME"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}£
                    {t.amount.toFixed(2)}
                  </span>

                  <button
                    onClick={() =>
                      deleteTransaction(t.id)
                    }
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-gray-800" }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
      <p className="text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default App;