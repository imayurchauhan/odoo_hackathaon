import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard(){
  const [stats, setStats] = useState({ equipment: 0, requests: 0, inProgress: 0, overdue: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [eqRes, reqRes] = await Promise.all([api.get('/equipment'), api.get('/maintenance')]);
        const eq = eqRes.data.length;
        const reqs = reqRes.data.length;
        const inProg = reqRes.data.filter(r => r.status === 'in_progress').length;
        const overdue = reqRes.data.filter(r => r.dueAt && new Date(r.dueAt) < new Date() && !['repaired','scrap'].includes(r.status)).length;
        setStats({ equipment: eq, requests: reqs, inProgress: inProg, overdue });
      } catch(e) {}
    })();
  }, []);

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const cardHoverStyle = {
    ...cardStyle,
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
  };

  const CardItem = ({ title, value, icon, color }) => {
    const [hover, setHover] = useState(false);
    return (
      <div style={hover ? cardHoverStyle : cardStyle} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
          <div>
            <div style={{fontSize:'14px',color:'#666',marginBottom:'8px'}}>{title}</div>
            <div style={{fontSize:'32px',fontWeight:700,color:'#1a1a2e'}}>{value}</div>
          </div>
          <div style={{fontSize:'32px'}}>{icon}</div>
        </div>
        <div style={{marginTop:'12px',height:'2px',background:color,borderRadius:'2px'}}></div>
      </div>
    );
  };

  return (
    <div>
      <h1 style={{margin:'0 0 32px 0',color:'#1a1a2e'}}>Dashboard</h1>
      
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:'24px',marginBottom:'40px'}}>
        <CardItem title="Total Equipment" value={stats.equipment} icon="⚙️" color="#00d4ff" />
        <CardItem title="All Requests" value={stats.requests} icon="📋" color="#00ff88" />
        <CardItem title="In Progress" value={stats.inProgress} icon="⚡" color="#ffa500" />
        <CardItem title="Overdue" value={stats.overdue} icon="⚠️" color="#ff6b6b" />
      </div>

      <div style={{background:'#fff',borderRadius:'12px',padding:'24px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <h2 style={{margin:'0 0 16px 0',color:'#1a1a2e'}}>Recent Requests</h2>
        <div style={{fontSize:'14px',color:'#999'}}>Quick view of latest maintenance requests coming soon...</div>
      </div>
    </div>
  );
}
