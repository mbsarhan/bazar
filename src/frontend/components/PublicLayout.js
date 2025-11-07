// src/frontend/components/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import '../styles/PublicLayout.css'; // Make sure the CSS is imported

const PublicLayout = () => {
  return (
    <div className="public-layout-wrapper">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;