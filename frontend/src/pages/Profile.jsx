import { Bell, CreditCard, Gift, Lock, LogOut, Mail, Shield, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DefaultAvatar from "../components/DefaultAvatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout, showToast } = useAuth();
  const [walletAction, setWalletAction] = useState(null);
  const [walletAmount, setWalletAmount] = useState(100);
  if (!user) {
    return (
      <div className="section grid min-h-[70vh] place-items-center">
        <div className="glass max-w-lg rounded-[32px] p-8 text-center">
          <UserRound className="mx-auto text-accent" size={42} />
          <h1 className="mt-4 text-3xl font-black">Login or Register to Access Profile</h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link className="rounded-2xl bg-accent py-3 font-black text-white" to="/auth">Login</Link>
            <Link className="rounded-2xl bg-slate-900 py-3 font-black text-white" to="/auth">Register</Link>
          </div>
        </div>
      </div>
    );
  }

  const menu = [
    ["Referral Program", Gift],
    ["Contact Us", Mail],
    ["About Us", Shield],
    ["Privacy Policy", Lock],
    ["Terms & Conditions", CreditCard],
    ["Notifications", Bell],
    ["Security Settings", Shield],
    ["Change Password", Lock]
  ];

  const completeWalletAction = () => {
    showToast(`${walletAction} request submitted for $${Number(walletAmount || 0).toFixed(2)}`);
    setWalletAction(null);
  };

  return (
    <div className="section space-y-8 py-8">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="glass rounded-[32px] p-7 text-center">
          <DefaultAvatar name={user.name} />
          <h1 className="mt-4 text-3xl font-black">{user.name}</h1>
          <p className="font-bold text-slate-500">{user.email}</p>
          <div className="mt-5 rounded-2xl bg-white p-4 text-left">
            <p className="text-sm font-black text-slate-500">User ID</p>
            <p className="text-xl font-black">{user.id}</p>
            <p className="mt-3 text-sm font-black text-slate-500">Join Date</p>
            <p className="font-bold">{user.joinDate}</p>
            <p className="mt-3 text-sm font-black text-slate-500">Account Status</p>
            <p className="font-bold text-gain">{user.status}</p>
          </div>
          <button onClick={logout} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-black text-white"><LogOut size={18} /> Logout</button>
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Available Balance", "$18,420.00"],
              ["Total Trades", "124"],
              ["Investment Value", "$42,880.70"]
            ].map(([label, value]) => <div key={label} className="rounded-[28px] bg-white p-6 shadow-sm"><p className="font-black text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => setWalletAction("Deposit")} className="min-h-14 rounded-2xl bg-gain px-4 py-4 font-black text-white transition hover:brightness-95">Deposit</button>
            <button onClick={() => setWalletAction("Withdraw")} className="min-h-14 rounded-2xl bg-accent px-4 py-4 font-black text-white transition hover:brightness-95">Withdraw</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {menu.map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => showToast(`${label} opened`)}
                className="flex min-h-16 items-center gap-3 rounded-2xl bg-white p-4 text-left font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Icon className="shrink-0 text-accent" size={20} />
                <span className="min-w-0 break-words">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {walletAction && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-[32px] bg-white p-7 shadow-glass">
            <h2 className="text-3xl font-black">{walletAction}</h2>
            <label className="mt-5 block text-sm font-black text-slate-500">Amount</label>
            <div className="mt-2 flex items-center rounded-2xl border border-slate-200 px-4 py-3">
              <span className="text-lg font-black text-slate-400">$</span>
              <input className="w-full bg-transparent px-2 text-lg font-black outline-none" min="1" type="number" value={walletAmount} onChange={(event) => setWalletAmount(event.target.value)} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => setWalletAction(null)} className="rounded-2xl bg-slate-100 py-3 font-black">Cancel</button>
              <button onClick={completeWalletAction} className="rounded-2xl bg-accent py-3 font-black text-white">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
