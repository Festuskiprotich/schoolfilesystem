/*
 *  _____         _                  _  __  __  _
 * |  ___|__  ___| |_ _   _ ___ __ _(_)/ _|| |_| |_ _ __ _____  __
 * | |_ / _ \/ __| __| | | / __/ _` | | |_ | __| __| '__/ _ \ \/ /
 * |  _|  __/\__ \ |_| |_| \__ \ (_| | |  _|| |_| |_| | | (_) >  <
 * |_|  \___||___/\__|\__,_|___/\__,_|_|_|   \__|\__|_|  \___/_/\_\
 *
 *  LSM3 - Advanced School Portal
 *  Techswifttrix Agency
 */

import React, { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export default function TeacherMessages() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.filter(u => u.id !== user.id))).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    api.get(`/messages/conversation/${selected.id}`).then(r => setMessages(r.data)).catch(() => {});
  }, [selected]);

  useEffect(() => {
    if (!socket) return;
    socket.on('new_message', (msg) => {
      if (selected && (msg.senderId === selected.id || msg.receiverId === selected.id)) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => socket.off('new_message');
  }, [socket, selected]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selected) return;
    const msg = await api.post('/messages', { receiverId: selected.id, content: text });
    setMessages(prev => [...prev, msg.data]);
    setText('');
  };

  return (
    <div>
      <p className="page-title">Messages</p>
      <div style={{ display: 'flex', gap: 16, height: 520 }}>
        {/* Contact list */}
        <div className="card" style={{ width: 220, overflowY: 'auto', padding: 0 }}>
          {users.map(u => (
            <div key={u.id} onClick={() => setSelected(u)} style={{
              padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
              background: selected?.id === u.id ? '#eef2ff' : 'transparent',
            }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'capitalize' }}>{u.role}</div>
            </div>
          ))}
        </div>
        {/* Chat */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Select a contact to start messaging</div>
          ) : (
            <>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>{selected.name}</div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.senderId === user.id ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{ background: m.senderId === user.id ? '#4f46e5' : '#f3f4f6', color: m.senderId === user.id ? '#fff' : '#1a1a2e', padding: '8px 14px', borderRadius: 12, fontSize: 14 }}>{m.content}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, textAlign: m.senderId === user.id ? 'right' : 'left' }}>{new Date(m.sentAt).toLocaleTimeString()}</div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }} />
                <button className="btn btn-primary" type="submit">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
