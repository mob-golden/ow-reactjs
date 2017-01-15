import React from 'react';

export default function PageNotFound () {
  return (
    <div className="fullheight">
      <div className="os-card card--404 row">
        <h2 className="os-card--404-header">Sorry, the page you're looking for doesn't exist</h2>
        <p className="os-card--404-text">Please head back to our home page</p>
        <button className="btn btn-primary os-btn-blue">Go Home</button>
      </div>
    </div>
  );
};
