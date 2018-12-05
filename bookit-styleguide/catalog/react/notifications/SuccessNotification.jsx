import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

class SuccessNotification extends Component {
    notifySuccess = () => {
        toast.success("Success Notification !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    render() {
        return (
            <div className="success-notif">
                <button  className="trigger" onClick={this.notifySuccess}>Display Success Notification</button>
                <ToastContainer />
                <p>*Notification will appear at the top-right of your window</p>
            </div>
        );
    }
}

export default SuccessNotification