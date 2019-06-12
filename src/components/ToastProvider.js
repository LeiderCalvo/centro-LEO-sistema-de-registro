import {
  ToastProvider,
} from 'react-toast-notifications';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Toast from './Toast';

class ToastProv extends Component {
  render(){
    return(<ToastProvider>
        <Toast/>
    </ToastProvider>);
  }
}

export default observer(ToastProv);