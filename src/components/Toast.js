import {
  withToastManager,
} from 'react-toast-notifications';

import React, { Component } from 'react';
import store from '../stores/store';

class toast extends Component {
  componentDidMount(){
    store.setCallBackToast(this.montarToast);
  }

  montarToast(content){
    this.props.toastManager.add(content, {
      appearance: 'warning',
      autoDismiss: true,
      pauseOnHover: false,
    })
  }
  
  render(){
    return(
      <div onClick={() => this.montarToast('neeeeeeeeee')}>
        Add Toast
      </div>
    );
  }
}
const Toast = withToastManager(toast);
export default Toast;