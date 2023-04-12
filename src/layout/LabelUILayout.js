// @flow
import * as React from 'react';
import { Outlet } from 'react-router-dom';


function LabelUILayout() {
  return (
    <div id='labelui-container' className='row'>
      <div className='col-sm-2'><h1>col 1</h1></div>
      <div className='col-sm-10'><Outlet /></div>
    </div>

  )
}

export default LabelUILayout