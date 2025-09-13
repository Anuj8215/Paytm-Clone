import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [balance, setBalance] = useState(null);
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState("");
  const [updateForm, setUpdateForm] = useState({ firstName: "", lastName: "", password: "" });

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      const res = await api.get("/account/balance");
      setBalance(res.data.balance);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch balance");
    }
  }

  async function onSearch(e) {
    e.preventDefault();
    try {
      const res = await api.get(`/user/bulk?filter=${encodeURIComponent(filter)}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  }

  async function onTransfer(e) {
    e.preventDefault();
    if (!recipient) return alert("Select a recipient");
    try {
      await api.post("/account/transfer", { to: recipient._id, amount: Number(amount) });
      alert("Transfer successful");
      setAmount("");
      fetchBalance();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Transfer failed");
    }
  }

  async function onUpdate(e) {
    e.preventDefault();
    try {
      await api.put("/user/update", updateForm);
      alert("Profile updated");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-medium">Your balance</h3>
        <div className="text-3xl font-bold mt-2">{balance === null ? "—" : `${balance}`}</div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-medium mb-2">Send Money</h3>

        <form onSubmit={onSearch} className="flex gap-2 mb-3">
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search by first or last name" className="flex-1 border p-2 rounded" />
          <button className="px-4 py-2 bg-gray-200 rounded">Search</button>
        </form>

        <div className="mb-3">
          {users.length === 0 ? <div className="text-sm text-gray-500">No users</div> :
            users.map(u => (
              <div
                key={u._id}
                onClick={() => setRecipient(u)}
                className={`p-2 rounded cursor-pointer ${recipient && recipient._id === u._id ? "bg-indigo-50 border-l-4 border-indigo-400" : "hover:bg-gray-50"}`}
              >
                {u.firstName} {u.lastName} <span className="text-xs text-gray-400 ml-2">({u._id})</span>
              </div>
            ))}
        </div>

        <form onSubmit={onTransfer} className="space-y-3">
          <div>
            <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-40 border p-2 rounded" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-medium mb-2">Update profile</h3>
        <form onSubmit={onUpdate} className="space-y-2">
          <input value={updateForm.firstName} onChange={e => setUpdateForm({...updateForm, firstName: e.target.value})} placeholder="First name" className="w-full border p-2 rounded" />
          <input value={updateForm.lastName} onChange={e => setUpdateForm({...updateForm, lastName: e.target.value})} placeholder="Last name" className="w-full border p-2 rounded" />
          <input type="password" value={updateForm.password} onChange={e => setUpdateForm({...updateForm, password: e.target.value})} placeholder="New password (min 6)" className="w-full border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
        </form>
      </div>
    </div>
  );
}
