import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Ban, CheckCircle, Clock } from 'lucide-react';

function Admin() {
  const [email, setEmail] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [users, setUsers] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      const data = await response.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // 2. Fetch Pending Transactions
  const fetchPendingTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/pending-transactions`);
      const data = await response.json();
      if (Array.isArray(data)) setPendingTransactions(data);
    } catch (err) {
      console.error("Failed to fetch pending transactions", err);
    }
  };

  // 3. Initial Load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchPendingTransactions()]);
      setIsLoading(false);
    };
    loadData();
  }, [API_URL]);

  // 4. Update Balance
  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/update-balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newBalance: Number(newBalance) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage(data.message);
      setEmail('');
      setNewBalance('');
      fetchUsers(); 
    } catch (err) {
      setError(err.message);
    }
  };

  // 5. Edit User
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setEditingUser(null); 
      fetchUsers(); 
    } catch (err) {
      alert(err.message); 
    }
  };

  // 6. Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      fetchUsers(); 
    } catch (err) {
      alert(err.message);
    }
  };

  // 7. Ban/Unban User
  const handleBanToggle = async (id, currentStatus) => {
    const action = currentStatus ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/ban-user/${id}`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      fetchUsers(); 
    } catch (err) {
      alert(err.message);
    }
  };

  // 8. Approve Transaction
  const handleApproveTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/approve-transaction/${id}`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      alert("Transaction Approved and Completed! ✅");
      fetchPendingTransactions(); // Refresh the pending list
      fetchUsers(); // Refresh users just in case balance changed
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8 text-white relative">
      <h2 className="text-3xl font-semibold mb-6">Admin Control Panel 🛠️</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Update Balance Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl w-full border border-slate-800">
            <h3 className="text-xl font-bold mb-4">Quick Update Balance</h3>
            {message && <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded-lg mb-4 text-sm text-center">{message}</div>}
            {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

            <form onSubmit={handleUpdateBalance} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">User Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="user@test.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">New Balance ($)</label>
                <input 
                  type="number" 
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="5000"
                  required
                />
              </div>
              <button type="submit" className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors">
                Update Balance
              </button>
            </form>
          </div>

          {/* PENDING APPROVALS SECTION */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl w-full border border-slate-800 mt-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
              <Clock className="w-5 h-5" /> Pending Approvals
            </h3>
            
            {pendingTransactions.length === 0 ? (
              <p className="text-slate-400 text-sm">No pending transactions to approve.</p>
            ) : (
              <div className="space-y-4">
                {pendingTransactions.map((tx) => (
                  <div key={tx._id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-white text-sm">{tx.type.replace('_', ' ').toUpperCase()}</p>
                      <p className="font-bold text-amber-400">${tx.amount.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{tx.senderEmail} → {tx.receiverEmail}</p>
                    <button 
                      onClick={() => handleApproveTransaction(tx._id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Transaction
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The User Database Table */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold">All Registered Users</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Balance</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center py-8 text-slate-400">Loading users...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-8 text-slate-400">No users found.</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium">{u.name}</td>
                        <td className="px-6 py-4 text-slate-400">{u.email}</td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">${u.balance.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {u.isAdmin && (
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold mr-2">Admin</span>
                          )}
                          {u.isBanned ? (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">Banned</span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">Active</span>
                          )}
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                          <button 
                            onClick={() => handleBanToggle(u._id, u.isBanned)} 
                            className={`p-2 rounded-lg transition-colors ${u.isBanned ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white'}`}
                            title={u.isBanned ? "Unban User" : "Ban User"}
                          >
                            {u.isBanned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>

                          <button 
                            onClick={() => openEditModal(u)} 
                            className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button 
                            onClick={() => handleDelete(u._id)} 
                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* THE CUSTOM EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} 
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;