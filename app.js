
import React, { useMemo, useState } from "react";
const LOGO_SRC = "KW Explore_White.png";
const KW_RED = "#E31837";
const fmtZAR = (n)=> new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR",maximumFractionDigits:0}).format(isFinite(n)?n:0);
function monthlyPayment({principal, annualRatePct, years}){ const r=(annualRatePct/100)/12; const n=years*12; return r===0? principal/n : principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1); }
function buildAmortization({principal, annualRatePct, years}){ const rows=[]; const r=(annualRatePct/100)/12; const n=years*12; const pmt=monthlyPayment({principal,annualRatePct,years}); let bal=principal; for(let i=1;i<=n;i++){ const interest=bal*r; const cap=Math.min(pmt-interest,bal); bal=Math.max(0,bal-cap); rows.push({month:i,payment:pmt,interest,principal:cap,balance:bal}); if(bal<=0) break;} return rows; }
const TRANSFER_GUIDE=[{value:100000,total:11119},{value:200000,total:13865},{value:500000,total:22703},{value:1000000,total:36227},{value:2000000,total:83161},{value:3000000,total:170332}];
const BOND_GUIDE=[{bond:250000,total:15819},{bond:500000,total:22703},{bond:1000000,total:36227},{bond:2000000,total:49375}];
const getT=(p)=>{let c=TRANSFER_GUIDE[0]; for(const r of TRANSFER_GUIDE){if(p>=r.value) c=r; else break;} return c.total;};
const getB=(b)=>{let c=BOND_GUIDE[0]; for(const r of BOND_GUIDE){if(b>=r.bond) c=r; else break;} return c.total;};
function App(){
  const [active,setActive]=useState('quick');
  const [price,setPrice]=useState(1800000);
  const [deposit,setDeposit]=useState(0);
  const [rate,setRate]=useState(11.75);
  const [years,setYears]=useState(20);
  const loan=Math.max(0,price-deposit);
  const pmt=monthlyPayment({principal:loan,annualRatePct:rate,years});
  const amort=useMemo(()=>buildAmortization({principal:loan,annualRatePct:rate,years}),[loan,rate,years]);
  return (<div className="min-h-screen bg-neutral-900 text-white">
    <header className="sticky top-0 z-20 text-white border-b" style={{backgroundColor:KW_RED}}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3"><img src={LOGO_SRC} className="h-10 w-auto"/><div><div className="font-semibold leading-tight">KW Explore Bond <span className="text-xs font-normal ml-2">— This is just an indication. Please contact transferring attorney for accurate quote.</span></div><div className="text-xs text-white/80 -mt-0.5">Keller Williams Realty • South Africa</div></div></div>
    </header>
    <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
      <nav className="grid grid-cols-6 gap-2 text-sm">{[{id:'quick',label:'Quick calc'},{id:'bond',label:'Bond repayment'},{id:'afford',label:'Affordability'},{id:'duty',label:'Transfer duty'},{id:'fees',label:'Deeds fees'},{id:'about',label:'About & notes'}].map(t=>(<button key={t.id} onClick={()=>setActive(t.id)} className={"px-3 py-2 rounded-xl border border-neutral-700 "+(active===t.id?"text-white":"bg-neutral-800 hover:bg-neutral-700 text-white")} style={active===t.id?{backgroundColor:KW_RED,borderColor:KW_RED}:{}}>{t.label}</button>))}</nav>
      {active==='quick' && (<div className="max-w-3xl mx-auto"><div className="bg-neutral-800 rounded-2xl shadow p-5 border border-neutral-700">
        <h2 className="text-lg font-semibold mb-2">Bond, Transfer & Attorney Cost Calculator</h2>
        <div className="grid gap-4">
          <label className="grid gap-1"><span className="text-sm text-neutral-300">Purchase Price (R)</span><input className="w-full p-3 outline-none bg-neutral-900 text-white rounded-xl border border-neutral-700" value={price} onChange={e=>setPrice(+e.target.value||0)}/></label>
          <label className="grid gap-1"><span className="text-sm text-neutral-300">Deposit (R)</span><input className="w-full p-3 outline-none bg-neutral-900 text-white rounded-xl border border-neutral-700" value={deposit} onChange={e=>setDeposit(+e.target.value||0)}/></label>
          <label className="grid gap-1"><span className="text-sm text-neutral-300">Interest Rate (%)</span><input className="w-full p-3 outline-none bg-neutral-900 text-white rounded-xl border border-neutral-700" value={rate} onChange={e=>setRate(+e.target.value||0)}/></label>
          <label className="grid gap-1"><span className="text-sm text-neutral-300">Term (Years)</span><input className="w-full p-3 outline-none bg-neutral-900 text-white rounded-xl border border-neutral-700" value={years} onChange={e=>setYears(+e.target.value||0)}/></label>
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <div>Estimated Monthly Repayment: <span className="font-semibold">{fmtZAR(pmt)}</span></div>
          <div>Bond Registration Costs: <span className="font-semibold">{fmtZAR(getB(loan))}</span></div>
          <div>Transfer Costs (incl. duty): <span className="font-semibold">{fmtZAR(getT(price))}</span></div>
        </div>
      </div></div>)}
      {active==='bond' && (<div className="bg-neutral-800 rounded-2xl shadow p-5 border border-neutral-700"><h3 className="text-xl font-semibold mb-4">Amortization</h3><div className="max-h-80 overflow-auto rounded-lg border border-neutral-700"><table className="min-w-full text-sm"><thead className="sticky top-0 bg-neutral-800"><tr><th className="text-left p-2">Month</th><th className="text-right p-2">Payment</th><th className="text-right p-2">Interest</th><th className="text-right p-2">Principal</th><th className="text-right p-2">Balance</th></tr></thead><tbody>{amort.map(r=>(<tr key={r.month} className="odd:bg-neutral-900 even:bg-neutral-800"><td className="p-2">{r.month}</td><td className="p-2 text-right">{fmtZAR(r.payment)}</td><td className="p-2 text-right">{fmtZAR(r.interest)}</td><td className="p-2 text-right">{fmtZAR(r.principal)}</td><td className="p-2 text-right">{fmtZAR(r.balance)}</td></tr>))}</tbody></table></div></div>)}
    </main>
  </div>);
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
