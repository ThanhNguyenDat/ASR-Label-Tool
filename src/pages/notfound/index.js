import React from 'react';

import styles from './styles.module.scss';

const PageNotFound = () => (
  <div id={styles.notfound}>
    <div className={styles.notfound}>
      <h2>Oops! This Page Could Not Be Found</h2>
      <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
      <a href="/">Go To Homepage</a>
    </div>
  </div>
);

export default React.memo(PageNotFound);
