import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const BASE_URL = "http://localhost:8080/api/v1";

function DashboardPage() {
  const { user, token } = useAuth();

  const [wallet, setWallet]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [topupAmount, setTopupAmount]   = useState("");
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupError, setTopupError]     = useState(null);
  const [topupSuccess, setTopupSuccess] = useState(null);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  async function fetchWallet() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/wallets/${user.id}`, {
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Failed to load wallet");
      const data = await response.json();
      setWallet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWallet();
  }, []);

  async function handleTopup(e) {
    e.preventDefault();

    if (!topupAmount || Number(topupAmount) <= 0) {
      setTopupError("Enter a valid amount");
      return;
    }

    setTopupLoading(true);
    setTopupError(null);
    setTopupSuccess(null);

    try {
      const response = await fetch(`${BASE_URL}/wallets/topup`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          userId: user.id,
          amount: Number(topupAmount),
        }),
      });

      if (!response.ok) throw new Error("Top-up failed");

      setTopupSuccess(`$${topupAmount} added successfully`);
      setTopupAmount("");
      fetchWallet();
    } catch (err) {
      setTopupError(err.message);
    } finally {
      setTopupLoading(false);
    }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-content">
        <h2 className="page-title">Wallet</h2>

        {loading && <p>Loading wallet...</p>}
        {error   && <p className="error-msg">{error}</p>}

        {wallet && (
          <>
            <div className="wallet-card">
              <div className="wallet-label">Available Balance</div>
              <div className="wallet-balance">
                {wallet.currency} {Number(wallet.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="wallet-meta">
                <span>{wallet.status}</span>
                <span>Wallet #{wallet.id}</span>
              </div>
            </div>

            <div className="card">
              <h3>Top Up</h3>
              <form onSubmit={handleTopup} className="inline-form">
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Amount (USD)"
                  min="1"
                />
                <button type="submit" disabled={topupLoading}>
                  {topupLoading ? "Processing..." : "Add Funds"}
                </button>
              </form>
              {topupError   && <p className="error-msg">{topupError}</p>}
              {topupSuccess && <p className="error-msg">{topupSuccess}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;