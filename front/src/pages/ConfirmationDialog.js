
import React from 'react';
import styles from '../css/ConfirmationDialog.module.css';





const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2 className={styles.message}>{message}</h2>
        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Yes
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
