import React, { PropTypes } from 'react';

const MessageBar = ({ message }) => {
  const classes = message.type === 'ERROR' ? 'message-bar error' : 'message-bar';
  if (message) {
    return (
      <div className={classes}>
        <span className="message-text">{message.text}</span>
      </div>
    );
  }
  return <span></span>;
};

export default MessageBar;

MessageBar.propTypes = {
  message: PropTypes.object,
};
