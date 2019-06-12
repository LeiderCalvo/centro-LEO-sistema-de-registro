import {
  withToastManager,
} from 'react-toast-notifications';

import React, { Component } from 'react';
import store from '../stores/store';

class toast extends Component {

  constructor(props){
    super(props);
    this.montarToast = this.montarToast.bind(this);
  }

  componentDidMount(){
    store.setCallBackToast(this.montarToast);
  }

  montarToast(content, appearance){
    this.props.toastManager.add(content, {
      appearance: appearance,
      autoDismiss: true,
      pauseOnHover: true,
    })
  }
  
  render(){
    return(
      <div/>
    );
  }
}
const Toast = withToastManager(toast);
export default Toast;