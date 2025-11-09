import React from 'react';
import '../styles/Notifications.css';

function Notifications({ notifications, onDismiss }) {
  if (notifications.length === 0) return null;

  return (
    <div className="notifications">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <p>{notification.message}</p>
            {notification.details && (
              <pre className="notification-details">{notification.details}</pre>
            )}
          </div>
          <button
            className="notification-dismiss"
            onClick={() => onDismiss(index)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
