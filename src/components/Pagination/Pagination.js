import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { nanoid } from 'nanoid';
import { change } from 'vomgallStore/gallerySlice';

import pa from './Pagination.module.scss';

const Pagination = () => {

    const selectorGallSlice = useSelector(state => state.gallery);
    const dispatch = useDispatch();

    useEffect(() => {
        pagMenuCounter();
        pagesCreator();
        console.log(selectorGallSlice.pageBuffer);
    },[selectorGallSlice.pageSelector]);

    const pagesCreator = ( ) => {
        
        const totalItemsQuantity = selectorGallSlice.itemsBuffer;

        let miniPageBuffer = [];
        let mainPageBuffer = [];
        if(totalItemsQuantity !== null) {
            if(totalItemsQuantity.length > selectorGallSlice.pageSelector) 
            {  
                if(totalItemsQuantity.length % selectorGallSlice.pageSelector === 0) {
                
                    for(let p = 0; p < totalItemsQuantity.length; p += 1 ) {

                        if(miniPageBuffer.length !== selectorGallSlice.pageSelector) {
                            miniPageBuffer.push(totalItemsQuantity[p]);
                        } else {
                            mainPageBuffer.push(miniPageBuffer);
                            miniPageBuffer = [];
                        };
                    };
                    dispatch(change({operation: 'changePageBuffer', data: mainPageBuffer}));

                } else {
                    console.log("!")
                    for(let c = 0; c < totalItemsQuantity.length; c += 1 ) {
                        if(mainPageBuffer.length < Math.round(totalItemsQuantity.length / selectorGallSlice.pageSelector)){
                        if(miniPageBuffer.length !== selectorGallSlice.pageSelector) {
                            miniPageBuffer.push(totalItemsQuantity[c]);
                        } else {
                            mainPageBuffer.push(miniPageBuffer);
                            miniPageBuffer = [];
                        };  
                        } else {
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
            pages.push(i + 1);
        }

        return pages;
    };

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

                dispatch(change({operation: 'changePageQuantity', data: [1]}));
            }

        }
    };

    const selectChange = (evt) => {

        dispatch(change({operation: 'changePageSelector', data: Number(evt.target.value)}))

        pagMenuCounter();

    };
        
    return(
        
    <div className={pa.container}>
        
        <label className={pa.lab}> Quantity/page
            <select className={pa.datalist} value={selectorGallSlice.pageSelector} onChange={selectChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={80}>80</option>
                <option value={100}>100</option>
            </select>
        </label>

        <ul>
            {selectorGallSlice.pageQuantity !== undefined ? selectorGallSlice.pageQuantity.map(value => 
                {return <li key={nanoid()}><button>{value}</button></li>}    
            ) : ''}
        </ul>
            
    </div>);
};

export default Pagination;
