import React from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export default function Register(){
  const [name,setName] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [password,setPassword] = React.useState('');
  const [team,setTeam] = React.useState('');
  const [error,setError] = React.useState(null);
  const [loading,setLoading] = React.useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password, team || undefined);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{maxWidth:420,margin:'48px auto',padding:24,background:'#fff',borderRadius:8,boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
      <h2 style={{marginBottom:8}}>Create an account</h2>
      <form onSubmit={onSubmit}>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:13,marginBottom:6}}>Full name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e0e0e0'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:13,marginBottom:6}}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e0e0e0'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:13,marginBottom:6}}>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e0e0e0'}} />
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:'block',fontSize:13,marginBottom:6}}>Team (optional)</label>
          <input value={team} onChange={e=>setTeam(e.target.value)} placeholder="Team ID or name" style={{width:'100%',padding:10,borderRadius:6,border:'1px solid #e0e0e0'}} />
        </div>
        {error && <div style={{color:'#b00020',marginBottom:12}}>{error}</div>}
        <div style={{display:'flex',gap:12}}>
          <button type="submit" disabled={loading} style={{flex:1,background:'#0077ff',color:'#fff',border:'none',padding:'10px 16px',borderRadius:6,cursor:'pointer'}}>{loading? 'Creating...' : 'Create account'}</button>
        </div>
        <p style={{textAlign:'center',marginTop:16,fontSize:14,color:'#666'}}>Already have an account? <a href="/login" style={{color:'#0077ff',textDecoration:'none',fontWeight:600}}>Sign in here</a></p>
      </form>
    </div>
  );
}
