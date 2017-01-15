import React from 'react';
import { Popover, PopoverContent } from 'reactstrap';

import {
  Component,
  PropTypes
} from 'react';

import {
  connect
} from 'react-redux';

class EditDeleteButton extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render(){
    const {
      deleteHandle,
      editHandle,
      editable,
      id
    } = this.props;
  	return(
  	  <div>
  	  	<div className="os-ud-control-button" onClick={this.toggle} id={`popover-${id}`}>
  	  		<span className="one-dot"></span>
  	  		<span className="one-dot"></span>
  	  		<span className="one-dot"></span>
  	  	</div>

        <Popover placement="bottom" isOpen={this.state.popoverOpen} target={`popover-${id}`} toggle={this.toggle}>
          <PopoverContent>
            { editable ? <a className="os-ud-control-edit" onClick={(e)=>{editHandle(id),this.toggle();}}>EDIT</a> : null }
            <a className="os-ud-control-delete" onClick={(e)=>{deleteHandle(id),this.toggle();}}>DELETE</a>
          </PopoverContent>
        </Popover>
  	  </div>
  	);
  }
}

export default connect()(EditDeleteButton);
