import React from 'react';

const Modal = ({children, id, text}) => (
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
          <h6 className="modal-title m-b-1">{text}</h6>
          {children}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-primary"
            type="submit"
          >{text}</button>
          <button
            className="btn btn-secondary"
            data-dismiss="modal"
            type="button"
          >Close</button>
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
