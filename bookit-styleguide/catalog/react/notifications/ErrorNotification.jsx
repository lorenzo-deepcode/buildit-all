import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

class ErrorNotification extends Component {
    notifyFailure = () => {
        toast.error("Error Notification !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    render() {
        return (
            <div className="error-notif">
                <button className="trigger" onClick={this.notifyFailure}>Display Error Notification</button>
                <ToastContainer />
                <p>*Notification will appear at the top-right of your window</p>
            </div>
        );
    }
}

export default ErrorNotification