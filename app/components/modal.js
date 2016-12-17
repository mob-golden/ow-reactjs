import React from 'react';

const Modal = ({children, id}) => (
  <div
    className="modal fade"
    id={id}
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button
            className="close"
            data-dismiss="modal"
            type="button"
          >
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body clearfix">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
