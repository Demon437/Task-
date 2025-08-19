import React from 'react';

export default function SiteHeader() {
  return (
    <header className="shadow-sm">
      <div className="bg-white d-flex align-items-center py-3">
        <img
          src="/Untitled design.png"
          alt="Khulasa First Logo"
          style={{ height: '120px', marginLeft: '50px' }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/logo192.png';
          }}
        />
      </div>
      <div className="container-fluid bg-danger py-2">
        <div className="d-flex justify-content-between align-items-center flex-wrap text-white fw-bold">
          <a href="#home" className="bg-white text-black px-3 py-2 rounded d-flex align-items-center text-decoration-none">
            <i className="bi bi-house-door-fill me-1"></i> होम
          </a>
          <div className="d-flex flex-wrap justify-content-center gap-4 mx-3">
            <a href="#desh" className="text-black text-decoration-none">देश</a>
            <a href="#sports" className="text-black text-decoration-none">खेल</a>
            <a href="#politics" className="text-black text-decoration-none">राजनीति</a>
            <a href="#tech" className="text-black text-decoration-none">टेक्नोलॉजी</a>
          </div>
          <a href="/epaper" className="bg-white text-black px-3 py-2 rounded d-flex align-items-center text-decoration-none">
            <i className="bi bi-newspaper me-2"></i> ई-पेपर
          </a>
        </div>
      </div>
    </header>
  );
}

