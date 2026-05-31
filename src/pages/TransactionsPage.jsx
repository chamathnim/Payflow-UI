import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const BASE_URL = "http://localhost:8080/api/v1";

function TransactionsPage() {
    const { user, token } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        receiverId: "",
        amount: "",
        description: "",
    });
    const [sendLoading, setSendLoading] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [sendSuccess, setSendSuccess] = useState(null);

    const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    async function fetchTransactions() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/transactions/user/${user.id}`, {
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to load transactions");
            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSend(e) {
        e.preventDefault();
        setSendError(null);
        setSendSuccess(null);

        if (!form.receiverId || !form.amount) {
            setSendError("Receiver ID and amount are required");
            return;
        }

        if (Number(form.amount) <= 0) {
            setSendError("Amount must be greater than 0");
            return;
        }

        setSendLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/transactions`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({
                    idempotencyKey: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    senderId: user.id,
                    receiverId: Number(form.receiverId),
                    amount: Number(form.amount),
                    currency: "USD",
                    description: form.description || "Transfer",
                }),
            });

            if (!response.ok) throw new Error("Transfer failed");

            setSendSuccess(`$${form.amount} sent successfully`);
            setForm({ receiverId: "", amount: "", description: "" });
            fetchTransactions();
        } catch (err) {
            setSendError(err.message);
        } finally {
            setSendLoading(false);
        }
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    }

    return (
        <div className="page">
            <Navbar />
            <div className="page-content">
                <h2 className="page-title">Transactions</h2>

                {/* Send Money */}
                <div className="card">
                    <h3>Send Money</h3>
                    <form onSubmit={handleSend} className="send-form">
                        <div className="field-group">
                            <label>Receiver User ID</label>
                            <input
                                type="number"
                                name="receiverId"
                                value={form.receiverId}
                                onChange={handleChange}
                                placeholder="e.g. 5"
                            />
                        </div>
                        <div className="field-group">
                            <label>Amount (USD)</label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                        <div className="field-group">
                            <label>Description (optional)</label>
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="e.g. Rent, Lunch"
                            />
                        </div>
                        {sendError && <p className="error-msg">{sendError}</p>}
                        {sendSuccess && <p className="success-msg">{sendSuccess}</p>}
                        <button type="submit" disabled={sendLoading}>
                            {sendLoading ? "Sending..." : "Send Money"}
                        </button>
                    </form>
                </div>

                {/* Transaction History */}
                <div className="card">
                    <h3>History</h3>
                    {loading && <p>Loading...</p>}
                    {error && <p className="error-msg">{error}</p>}
                    {!loading && transactions.length === 0 && (
                        <p>No transactions yet.</p>
                    )}
                    <div className="txn-list">
                        {transactions.map((txn) => {
                            const isSender = txn.senderId === user.id;
                            return (
                                <div key={txn.id} className="txn-row">
                                    <div className="txn-icon">
                                        {isSender ? "↑" : "↓"}
                                    </div>
                                    <div className="txn-details">
                                        <span className="txn-desc">{txn.description || "Transfer"}</span>
                                        <span className="txn-meta">
                                            {isSender ? `To user #${txn.receiverId}` : `From user #${txn.senderId}`}
                                            {" · "}{formatDate(txn.createdAt)}
                                        </span>
                                    </div>
                                    <div className="txn-right">
                                        <span className={`txn-amount ${isSender ? "debit" : "credit"}`}>
                                            {isSender ? "-" : "+"}USD {Number(txn.amount).toFixed(2)}
                                        </span>
                                        <span>{txn.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TransactionsPage;