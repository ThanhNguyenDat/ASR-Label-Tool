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
        entireResultLabel,
        setEntireResultLabel, 
        dataLabelId,

        clicked,
        points,
        ...other 
    } = props;

    const colors = {
        null: '#f5f5f5',
        'Other': '#808080',
        'Good': '#0080ff',
        'Bad': '#ff0000',
        'Remake': '#bfff00'
    }
    
    
    const current_result_data_label = entireResultLabel.find(resultLabel => {
      if (resultLabel && resultLabel.length > 0)
        {
          return resultLabel[0][0].item_id === id
        }
    })

    // console.log('_resultLabel: ', _resultLabel)
    // get review
    let review = null
    if (current_result_data_label) {
      review = current_result_data_label[0][0].content.extras.review

    }
    let color = colors[review]



    function updateStatusReview(review) {
      const indexResultLabel = entireResultLabel.findIndex(resultLabel => resultLabel[0][0].item_id === dataLabelId)
      console.log('index: ', indexResultLabel)
      const currentResult = entireResultLabel[indexResultLabel]
      // console.log('current: ', currentResult)
      
      const updateResult = [currentResult[0].map(current => {
        current.content.extras.review = review;
        return current
      })]

      const _entireResultLabel = entireResultLabel
      _entireResultLabel[indexResultLabel] = updateResult
      
      return _entireResultLabel
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
                      const _entireResultLabel = updateStatusReview('Other')
                      setEntireResultLabel(_entireResultLabel)
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
                    const _entireResultLabel = updateStatusReview('Good')
                    setEntireResultLabel(_entireResultLabel)
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
                    const _entireResultLabel = updateStatusReview('Bad')
                    setEntireResultLabel(_entireResultLabel)
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
                    const _entireResultLabel = updateStatusReview('Remake')
                    setEntireResultLabel(_entireResultLabel)

                  }
                },
                {
                  label: 'Undo',
                  key: 4,
                  style: {
                    backgroundColor: colors[null]
                  },
                  icon: <TfiBackLeft />,
                  onClick: () => {
                    const _entireResultLabel = updateStatusReview(null)
                    setEntireResultLabel(_entireResultLabel)
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
                      
                      
                      console.log("click id: ", id)
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