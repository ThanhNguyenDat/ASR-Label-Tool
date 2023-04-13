import React, { useState, useEffect, useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';

export const withPromise = (func, params) =>
  new Promise((resolve, reject) =>
    func({
      ...params,
      resolve,
      reject,
    })
  );

export const withPromiseAndDispatch = (func, ctx, dispatch) =>
  new Promise((resolve, reject) => dispatch(func({ ...ctx, resolve, reject })));

export const useStateCallback = initialState => {
  const [state, setState] = useState(initialState);

  const cbRef = useRef(null);

  const setStateCallback = (nextState, cb) => {
    cbRef.current = cb;
    setState(nextState);
  };

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
};

export const showConfirmDialog = ({ message, onConfirm }) => {
  confirmAlert({
    customUI: ({ onClose }) => (
      <Modal isOpen={true}>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            OK
          </Button>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    ),
  });
};
