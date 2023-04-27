import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dropdown } from 'antd';
import { TfiAlert, TfiEye, TfiBackLeft, TfiCheck, TfiClose } from 'react-icons/tfi';

import styles from './styles.module.css';

function ItemFlexbox(props) {
    let { 
        sx, 
        id, 
        seed,
        entireDataLabel,
        setEntireDataLabel,
        dataLabelId,

        clicked,
        points,
        currentDataInfo,
        ...other 
    } = props;
    
    const colors = {
        "": '#f5f5f5',
        'Other': '#808080',
        'Good': '#0080ff',
        'Bad': '#ff0000',
        'Remake': '#bfff00'
    }
    
    // get current result
    // const indexDataLabel = currentDataInfo.index
    // const currentData = currentDataInfo.data
    const indexDataLabel = entireDataLabel.findIndex(sample => sample.data[0].id === dataLabelId)
    const currentData = entireDataLabel[indexDataLabel]
    console.log('index: ', indexDataLabel)
    let review = ""
    if (currentData && currentData.annotation.length > 0) {
      // review = currentData.annotation[0].content?.extras?.review
    }
    let color = colors[review]
    // console.log('color: ', color)


    function updateStatusReview(review) {
      const updateAnnoReview = currentData.annotation.map(anno => {
        anno.content.extras.review = review || "";
        return anno
      })
      
      const updateResult = {
        "annotation": updateAnnoReview,
        "data": currentData['data'],
      }
      const _entireDataLabel = JSON.parse(JSON.stringify(entireDataLabel))
      _entireDataLabel[indexDataLabel] = updateResult
      
      setEntireDataLabel(_entireDataLabel)
    }
    
    return (
        <>
            <Dropdown
              menu={{
                items: [
                  {
                    label: 'Other',
                    key: 0,
                    style: {
                      backgroundColor: colors['Other'],
                      color: 'white'
                    },
                    icon: <TfiEye />,
                    onClick: () => {
                      updateStatusReview('Other')
                    },
                  },
                {
                  label: 'Good',
                  key: 1,
                  style: {
                    backgroundColor: colors['Good'],
                  },
                  icon: <TfiCheck />,
                  onClick: () => {
                    updateStatusReview('Good')
                  }
                },
                {
                  label: 'Bad',
                  key: 2,
                  style: {
                    backgroundColor: colors['Bad']
                  },
                  icon: <TfiClose />,
                  onClick: () => {
                    updateStatusReview('Bad')
                  }
                },
                {
                  label: 'Remake',
                  key: 3,
                  style: {
                    backgroundColor: colors['Remake']
                  },
                  icon: <TfiAlert />,
                  onClick: (e) => {
                    updateStatusReview('Remake')
                  }
                },
                {
                  label: 'Undo',
                  key: 4,
                  style: {
                    backgroundColor: colors[""]
                  },
                  icon: <TfiBackLeft />,
                  onClick: () => {
                    updateStatusReview("")
                  }  
                },
              ]}}
              trigger={['contextMenu']}
              
            >
              <Button 
                  key={id}
                  id={id}
                  className={`${styles['btnDataLabel']}`}
                  style={{
                      background: color,
                  }}
                  {...other}
                  onClick={(e) => {
                      props.onClick(e);
                      console.log("click entireDataLabel: ", entireDataLabel)
                  }}
              >{seed}</Button>
            </Dropdown>
      </>
    );
}

ItemFlexbox.propTypes = {
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
      ),
      PropTypes.func,
      PropTypes.object,
    ]),
};
  
export default ItemFlexbox;