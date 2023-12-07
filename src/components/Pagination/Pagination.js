import { useState, useEffect, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { nanoid } from 'nanoid';
import { change } from 'vomgallStore/gallerySlice';
import { ReactComponent as LeftImg } from '../../images/left-chevron-svgrepo-com.svg';
import { ReactComponent as RightImg } from '../../images/right-chevron-svgrepo-com.svg';

import pa from './Pagination.module.scss';

const Pagination = () => {

    const selectorGallSlice = useSelector(state => state.gallery);
    const dispatch = useDispatch();

    const [ pagButtonLength, setPagButtonLength ] = useState(true);
    const [windowSize, setWindowSize] = useState(getWindowSize());

    const pagContainer = createRef();
    const pagLabContainer = createRef();
    const pagButtonContainer = createRef();

    function getWindowSize() {
        const {innerWidth} = window;
        return {innerWidth};
    }

    useEffect(() => {

      const widthLimit = pagContainer.current.offsetWidth / 2;    

      pagButtonContainer.current.offsetWidth < widthLimit ? setPagButtonLength(true) : setPagButtonLength(false);
    
    },[windowSize.innerWidth]);

    useEffect(() => {
        function handleWindowResize() {
          setWindowSize(getWindowSize());
        }
      
        window.addEventListener('resize', handleWindowResize);
      
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
       
        pagesCreator();
        console.log(selectorGallSlice.pageBuffer);
        
    },[selectorGallSlice.pageQuantity]);

    useEffect(() => {

        pagMenuCounter();
       
    },[selectorGallSlice.pageSelector]);

    // create mini array form 'selectorGallSlice.itemsBuffer' that loaded from firebase
    const pagesCreator = ( ) => {
        
        const totalItemsQuantity = selectorGallSlice.itemsBuffer;

        let miniPageBuffer = [];
        let mainPageBuffer = [];
        
        if(totalItemsQuantity !== null) {
            if(totalItemsQuantity.length > selectorGallSlice.pageSelector) 
            {  
                if(totalItemsQuantity.length % selectorGallSlice.pageSelector === 0) {
                
                    for(let p = 0; p < totalItemsQuantity.length; p += 1 ) {
                        miniPageBuffer.push(totalItemsQuantity[p]);
                        if(miniPageBuffer.length === selectorGallSlice.pageSelector) {
                            mainPageBuffer.push(miniPageBuffer);
                            miniPageBuffer = []; 
                        } 
                    };
                    dispatch(change({operation: 'changePageBuffer', data: mainPageBuffer}));

                } else {
                   
                    for(let c = 0; c < totalItemsQuantity.length; c += 1 ) {
                        // fill totalItemsQuantity.length % selectorGallSlice.pageSelector
                        if(mainPageBuffer.length < Math.round(totalItemsQuantity.length / selectorGallSlice.pageSelector)){
                            miniPageBuffer.push(totalItemsQuantity[c]);
                            if(miniPageBuffer.length === selectorGallSlice.pageSelector) {
                               mainPageBuffer.push(miniPageBuffer);
                               miniPageBuffer = []; 
                            }  
                        } else {
                            // fill rest
                            miniPageBuffer.push(totalItemsQuantity[c]);
                        }  
                    };

                    mainPageBuffer.push(miniPageBuffer);
                    dispatch(change({operation: 'changePageBuffer', data: mainPageBuffer}));        
                }

            } else {
                mainPageBuffer.push(totalItemsQuantity);
                dispatch(change({operation: 'changePageBuffer', data: mainPageBuffer}));
            }
        } 
    };

    const fill = (total, onePage) => {

        const pages = [];

        for(let i = 0; i < total / onePage; i += 1)
        {
            // each button have been 'state' - by click and value for print as her name (1,2,3...) 
            i === 0 ? pages.push({name: i + 1, active: true, position: i,}) :
            pages.push({name: i + 1, active: false, position: i,});
        }

        return pages;
    };

    // create page button array 
    const pagMenuCounter = () => {

        const totalItemsQuantity = selectorGallSlice.itemsBuffer;

        if(totalItemsQuantity !== null) {

            if(totalItemsQuantity.length > selectorGallSlice.pageSelector) 
            {
                if(totalItemsQuantity.length % selectorGallSlice.pageSelector === 0) {

                    const pagesFill = fill(totalItemsQuantity.length, selectorGallSlice.pageSelector);
                    dispatch(change({operation: 'changePageQuantity', data: pagesFill}));
                 

                } else {

                    const pagesFill = fill(totalItemsQuantity.length, selectorGallSlice.pageSelector + 1);
                    dispatch(change({operation: 'changePageQuantity', data: pagesFill}));
                    
                  
                }

            } else {

                dispatch(change({operation: 'changePageQuantity', data:[{name: 1, active: true, position: 0,}]}));
            }

        }
    };

    const selectChange = (evt) => {

        dispatch(change({operation: 'changePageSelector', data: Number(evt.target.value)}));

        pagMenuCounter();
       
    };

    const pageSelected = (evt) => {

        if(selectorGallSlice.pageQuantity.length !== 0) {

            // reset all button (more that one) 
            if(selectorGallSlice.pageQuantity.length > 1){

               selectorGallSlice.pageQuantity.forEach(element => {
                dispatch(change({operation: 'changePageQuantityReset', data: element.name}));

               }); 

                dispatch(change({operation: 'changePageQuantityActive', data: evt.target.name}));};
            }
            
    };

    return(
        
    <div className={pa.container} ref={pagContainer}>
        
        <label className={pa.lab} ref={pagLabContainer}> Quantity/page
            <select className={pa.datalist} value={selectorGallSlice.pageSelector} onChange={selectChange}>
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={80}>80</option>
                <option value={100}>100</option>
            </select>
        </label>

        <div className={pa.buttonSet} ref={pagButtonContainer}>
            
            {selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.pageQuantity.
            find(value => value.active === true).position !== 0 ? <button className={pa.rewind}><LeftImg style={{width: '20px', height: '20px', color: 'gray'}} /> <LeftImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : ''}

            {selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.pageQuantity.
            find(value => value.active === true).position !== 0 ? <button className={pa.next}><LeftImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : ''}

            <ul>
                {selectorGallSlice.pageQuantity !== undefined ? selectorGallSlice.pageQuantity.map(value => 
                    {return <li key={nanoid()}>{pagButtonLength ? <button style={value.active ? {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'none'}}
                    onClick={pageSelected} name={value.name}>{value.name}</button> : ''}</li>}    
                ) : ''}
            </ul>

            {selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.pageQuantity.
            find(value => value.active === true).position !== selectorGallSlice.pageQuantity.length - 1 ? <button className={pa.next}><RightImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : ''}
            {selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.pageQuantity.
            find(value => value.active === true).position !== selectorGallSlice.pageQuantity.length - 1 ? <button className={pa.rewind}><RightImg style={{width: '20px', height: '20px', color: 'gray'}} /><RightImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : ''}

        </div>
            
    </div>);
};

export default Pagination;
