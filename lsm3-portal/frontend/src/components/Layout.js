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

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function Layout({ children, navItems, title }) {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const unread = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 60,
        background: '#1e1b4b',
        color: '#fff',
        transition: 'width .2s',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid #312e81',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 18 }}>LSM3</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: 20, cursor: 'pointer' }}
          >
            â˜°
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end !== false && navItems.indexOf(item) === 0}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                color: isActive ? '#a5b4fc' : '#c7d2fe',
                background: isActive ? '#312e81' : 'transparent',
                borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
              })}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid #312e81' }}>
          {sidebarOpen && (
            <div style={{ fontSize: 13, color: '#a5b4fc', marginBottom: 8 }}>
              {user?.name}
              <br />
              <span style={{ fontSize: 11, textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              border: 'none',
              color: '#fff',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 13,
              cursor: 'pointer',
              width: sidebarOpen ? '100%' : 'auto',
            }}
          >
            {sidebarOpen ? 'Logout' : 'â†©'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          background: '#fff',
          padding: '12px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 600 }}>{title}</h1>
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: 22, cursor: 'pointer' }}>ðŸ””</span>
            {unread > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: 18,
                height: 18,
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {unread}
              </span>
            )}
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
