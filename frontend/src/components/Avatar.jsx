import React from 'react';

export default function Avatar({ user, size=32 }){
  const url = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'User')}&size=${size}`;
  return <img src={url} alt={user?.name} style={{width:size,height:size,borderRadius:'50%'}} />;
}
