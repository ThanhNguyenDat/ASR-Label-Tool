import React, { useState, useEffect, useRef } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Modal, ModalBody, Button, ModalFooter } from 'reactstrap';

// import Global from '../constants/Global';
// import { getMobileOperatingSystem } from '../utils/commonUtils';

// export const getVersionCode = () => {
//   if (Global.versionCode) return Global.versionCode;
//   let version = parseInt(Global.getVersionCodeFromCookie());
//   if (getMobileOperatingSystem() === 'Android') {
//     version %= 1000;
//   }
//   Global.versionCode = version;
//   return version;
// };

// export const withPromise = (func, params) =>
//   new Promise((resolve, reject) =>
//     func({
//       ...params,
//       resolve,
//       reject,
//     })
//   );

export const withPromiseAndDispatch = (func, ctx, dispatch) =>
  new Promise((resolve, reject) => dispatch(func({ ...ctx, resolve, reject })));

// export const useStateCallback = initialState => {
//   const [state, setState] = useState(initialState);

//   const cbRef = useRef(null);

//   const setStateCallback = (nextState, cb) => {
//     cbRef.current = cb;
//     setState(nextState);
//   };

//   useEffect(() => {
//     if (cbRef.current) {
//       cbRef.current(state);
//       cbRef.current = null;
//     }
//   }, [state]);

//   return [state, setStateCallback];
// };

// export const mappingCategorySlug = slug => {
//   if (slug === 'text-to-speech') {
//     return 'text-to-audio-converter';
//   }
//   if (slug === 'dirty-content-filter') {
//     return 'nsfw-content-classification';
//   }
//   if (slug === 'general-classification') {
//     return 'image-classification';
//   }
//   if (slug === 'nine-dash-line-detector') {
//     return 'illegal-nine-dash-line-detector';
//   }
//   return slug;
// };

// export const showConfirmDialog = ({ message, onConfirm }) => {
//   confirmAlert({
//     customUI: ({ onClose }) => (
//       <Modal isOpen={true}>
//         <ModalBody>{message}</ModalBody>
//         <ModalFooter>
//           <Button
//             color="primary"
//             onClick={() => {
//               onClose();
//               onConfirm();
//             }}
//           >
//             OK
//           </Button>
//           <Button color="secondary" onClick={onClose}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </Modal>
//     ),
//   });
// };
