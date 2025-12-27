import React from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function Login(){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      await login(email, password);
      navigate('/');
    }catch(err){
      setError(err?.response?.data?.message || 'Login failed');
    }finally{setLoading(false)}
  };

  return (
    <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'#f3f6f9'}}>
      <form onSubmit={handleSubmit} style={{width:420,background:'#fff',padding:30,borderRadius:10,boxShadow:'0 8px 24px rgba(0,0,0,0.08)'}}>
        <h2 style={{margin:0,marginBottom:8}}>Sign in to GearGuard</h2>
        <p style={{color:'#666',marginTop:0,marginBottom:20}}>Enter your account details</p>

        {error && <div style={{background:'#ffefef',color:'#b00020',padding:8,borderRadius:6,marginBottom:12}}>{error}</div>}

        <label style={{display:'block',fontSize:13,marginBottom:6}}>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e6e9ef',marginBottom:12}} />

        <label style={{display:'block',fontSize:13,marginBottom:6}}>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e6e9ef',marginBottom:16}} />

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <small style={{color:'#888'}}>Use seeded account: admin@gearguard.com</small>
          <a href="#" onClick={(e)=>{e.preventDefault(); setEmail('admin@gearguard.com'); setPassword('password123');}} style={{fontSize:13}}>Fill demo</a>
        </div>

        <button type="submit" disabled={loading} style={{width:'100%',padding:12,borderRadius:8,border:'none',background:'#0077ff',color:'#fff',fontWeight:600,cursor:'pointer'}}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p style={{textAlign:'center',marginTop:16,fontSize:14,color:'#666'}}>Don't have an account? <a href="/register" style={{color:'#0077ff',textDecoration:'none',fontWeight:600}}>Register here</a></p>
      </form>
    </div>
  );
}
