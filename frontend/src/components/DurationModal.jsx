import React, { useState, useEffect } from 'react';

const backdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
};
const boxStyle = { background: '#fff', padding: 20, borderRadius: 6, width: 320, maxWidth: '90%' };

export default function DurationModal({ open, initial = '', onCancel, onConfirm, title = 'Enter duration in hours (e.g. 2.5)' }){
  const [value, setValue] = useState(initial);
  useEffect(() => { setValue(initial || ''); }, [initial, open]);

  if (!open) return null;

  const submit = () => {
    const val = Number(value);
    if (!Number.isFinite(val) || val <= 0) return alert('Please enter a valid positive number');
    onConfirm(val);
  };

  return (
    <div style={backdropStyle} onMouseDown={onCancel}>
      <div style={boxStyle} onMouseDown={(e)=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>{title}</h3>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Value</label>
          <input autoFocus type="number" min="0.1" step="0.1" value={value} onChange={(e)=>setValue(e.target.value)} style={{width:'100%', padding:8}} />
        </div>
        <div style={{textAlign:'right'}}>
          <button onClick={onCancel} style={{marginRight:8}}>Cancel</button>
          <button onClick={submit}>Save</button>
        </div>
      </div>
    </div>
  );
}
