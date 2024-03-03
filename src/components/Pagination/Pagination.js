import { useEffect, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { nanoid } from 'nanoid';
import { change } from 'vomgallStore/gallerySlice';
import { useResizeDetector} from 'react-resize-detector';
import { ReactComponent as LeftImg } from '../../images/left-chevron-svgrepo-com.svg';
import { ReactComponent as RightImg } from '../../images/right-chevron-svgrepo-com.svg';

import pa from './Pagination.module.scss';

const Pagination = () => {

    const selectorGallSlice = useSelector(state => state.gallery);
    const selectorUserPath = useSelector(state => state.path);

    // const selectorItemsUrl = useSelector(state => state.readStorage);
    const dispatch = useDispatch();

    // const [ pagButtonLength, setPagButtonLength ] = useState(true);
    // const [windowSize, setWindowSize] = useState();

    // get pagButtonContainer size
    const { width, ref } = useResizeDetector();

    // const pagContainer = createRef();
    const pagLabContainer = createRef();
    const pagButtonContainer = createRef();
    // const pagButton = createRef();

    useEffect(() => {
        if(selectorGallSlice.pageQuantity.length !== 0 ) {
            dispatch(change({operation: 'changeFractions', data: 5}));
            // dispatch(change({operation: 'changePageQuantity', data: []}));
         } 
         // eslint-disable-next-line
    },[]);

    useEffect(() => {
        dispatch(change({operation: 'changeLastWindowSize', data: selectorGallSlice.lastWindowSize - 100}));
        // eslint-disable-next-line
    },[selectorGallSlice.pageSelector]);

    useEffect(() => {

        dispatch(change({operation: 'changeSelectfractionPage', data: 0}));

        const pageFraction = () => {
           
            let fractionsPageQuantity = [];
            let minifractionsPageQuantity = [];

            if(selectorGallSlice.pageQuantity !== null) {
                
                // this code fraction electorGallSlice.pageQuantity on parts
                if(selectorGallSlice.pageQuantity.length % selectorGallSlice.fractions === 0) {

                    for(let f=0; f < selectorGallSlice.pageQuantity.length ; f += 1) {
                        
                        minifractionsPageQuantity.push(selectorGallSlice.pageQuantity[f]);
                       
                        if(minifractionsPageQuantity.length === selectorGallSlice.fractions) {
                            fractionsPageQuantity.push(minifractionsPageQuantity);
                            minifractionsPageQuantity = [];
                        }
                        
                    };
                    dispatch(change({operation: 'changeFractionPageQuantity', data: fractionsPageQuantity}));

                } else {

                    for(let fn = 0; fn < selectorGallSlice.pageQuantity.length; fn += 1 ) {
                        // fill totalItemsQuantity.length % selectorGallSlice.pageSelector
                        if(fractionsPageQuantity.length < Math.round(selectorGallSlice.pageQuantity.length / selectorGallSlice.fractions)){
                            minifractionsPageQuantity.push(selectorGallSlice.pageQuantity[fn]);
                            if(minifractionsPageQuantity.length === selectorGallSlice.fractions) {
                                fractionsPageQuantity.push(minifractionsPageQuantity);
                                minifractionsPageQuantity = []; 
                            }  
                        } else {
                          
                            // fill rest
                            minifractionsPageQuantity.push(selectorGallSlice.pageQuantity[fn]);
                        }  
                    };
                    fractionsPageQuantity.push(minifractionsPageQuantity);
                    dispatch(change({operation: 'changeFractionPageQuantity', data: fractionsPageQuantity}));
                } 
                // this code fraction electorGallSlice.pageQuantity on parts
            }
        };
        
        // calculating, when page's button fits end correct quality of it on page
        let counter = Math.floor((selectorGallSlice.lastWindowSize - 400) / 50);
              
        if(counter > 0 && counter <= selectorGallSlice.pageQuantity.length) {
           dispatch(change({operation: 'changeFractions', data: counter})); 
           pageFraction(); 
        } else {
           counter < 1 ? counter = 1 : counter = selectorGallSlice.pageQuantity.length;
           dispatch(change({operation: 'changeFractions', data: counter})); 
           pageFraction(); 
        };
       
        // remember current window size  
        dispatch(change({operation: 'changeLastWindowSize', data: Math.round(width)}));
       
    // eslint-disable-next-line
    },[width, selectorGallSlice.lastWindowSize, selectorGallSlice.pageQuantity,]);

    useEffect(() => {
       
        pagesCreator();
  
    // eslint-disable-next-line    
    },[selectorGallSlice.pageQuantity, selectorGallSlice.itemsBuffer]);

    useEffect(() => {

        pagMenuCounter();

       // add selectorUserPath.logicPath below - pageQuantity chenge, when path change
       // wait chenge selectorGallSlice.itemsBuffer (below), because in gellary create selectorGallSlice.itemsBuffer
       // when path change and here. selectorGallSlice.itemsBuffer doesn't have time to change
       // pageQuantity in pagMenuCounter() create on old data base and button in pagination change only on to click.
       // add ...selectorGallSlice.pageQuantity,] too see 109 row
       // eslint-disable-next-line
    },[selectorGallSlice.pageSelector, selectorUserPath.logicPath, selectorGallSlice.itemsBuffer]);

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
                        if(mainPageBuffer.length < Math.floor(totalItemsQuantity.length / selectorGallSlice.pageSelector)){
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

    const fill = (total, onePage, mode) => {

        const pages = [];

        for(let i = 0; i < Math.floor(total / onePage ) + mode; i += 1)
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

                    const pagesFill = fill(totalItemsQuantity.length, selectorGallSlice.pageSelector, 0);
                    dispatch(change({operation: 'changePageQuantity', data: pagesFill}));
                 

                } else {

                    const pagesFill = fill(totalItemsQuantity.length, selectorGallSlice.pageSelector, 1);
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

        // if(selectorGallSlice.pageQuantity.length !== 1) {
            // if(selectorGallSlice.fractionPageQuantity.length === 0) {
            // reset all button (more that one) 
            if(selectorGallSlice.pageQuantity.length > 1) {

                selectorGallSlice.pageQuantity.forEach(element => {
                    dispatch(change({operation: 'changePageQuantityReset', data: element.name}));

                }); 

                dispatch(change({operation: 'changePageQuantityActive', data: evt.target.name}));
            };

            if(selectorGallSlice.fractionPageQuantity.length !== 0){
             
                // reset all button (more that one) 
                dispatch(change({operation: 'changeFractionPageQuantityReset'}));

                // set'sctive' field to true
                dispatch(change({operation: 'changeFractionPageQuantityActive', data: evt.target.name}));
            };
            // }
            
    };

    const pagChange = (evt) => {

        if(selectorGallSlice.selectfractionPage.length !== 0) {
           
            switch(evt.currentTarget.name) {
                case 'begin':
                    dispatch(change({operation: 'changeSelectfractionPage', data: 0}));
                    break;
                case 'prev':
                    if(selectorGallSlice.selectfractionPage !== 0)
                        dispatch(change({operation: 'changeSelectfractionPage', data: selectorGallSlice.selectfractionPage - 1}));
                    break;
                case 'next':
                    if(selectorGallSlice.selectfractionPage !== selectorGallSlice.fractionPageQuantity.length - 1)
                        dispatch(change({operation: 'changeSelectfractionPage', data: selectorGallSlice.selectfractionPage + 1}));
                    break;
                case 'end':
                    dispatch(change({operation: 'changeSelectfractionPage', data: selectorGallSlice.fractionPageQuantity.length - 1}));
                    break;
                default: break;    
            }
        }
    };

    return(
        
    <div className={pa.container} ref={ref} style={selectorGallSlice.dayNight ? {backgroundColor: '#384a83',} : {backgroundColor: ''}}>
        
        <label className={pa.lab} ref={pagLabContainer}> <p style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: ''}}>
            {selectorGallSlice.settings.languageSelector === 'English' ? <span>Quantity/page</span> : 
                selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Кількість/стор.</span> : 
                selectorGallSlice.settings.languageSelector === 'Polska' ? <span>Ilość/strona</span> : <span>Quantity/page</span>}
            </p>
            <select className={pa.datalist} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: ''}} value={selectorGallSlice.pageSelector} onChange={selectChange}>
                <option style={selectorGallSlice.dayNight ? {color: '#1C274C',} : {color: ''}} value={2}>2</option>
                <option style={selectorGallSlice.dayNight ? {color: '#1C274C',} : {color: ''}} value={5}>5</option>
                <option style={selectorGallSlice.dayNight ? {color: '#1C274C',} : {color: ''}} value={10}>10</option>
                <option style={selectorGallSlice.dayNight ? {color: '#1C274C',} : {color: ''}} value={20}>20</option>
                <option style={selectorGallSlice.dayNight ? {color: '#1C274C',} : {color: ''}} value={40}>40</option>
                <option style={selectorGallSlice.dayNight ? {color: '#1C274C',} : {color: ''}} value={80}>80</option>
                <option style={selectorGallSlice.dayNight ? {color: '#1C274C',} : {color: ''}} value={100}>100</option>
            </select>
        </label>

        <div className={pa.buttonSet} ref={pagButtonContainer}>
            
           {selectorGallSlice.fractionPageQuantity.length !== 1 ? selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.selectfractionPage
             !== 0 ? <button className={pa.rewind} name={'begin'} onClick={pagChange}><LeftImg style={{width: '20px', height: '20px', color: 'gray'}} /> <LeftImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : '':''}

            {selectorGallSlice.fractionPageQuantity.length !== 1 ? selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.selectfractionPage
             !== 0 ? <button className={pa.next} name={'prev'} onClick={pagChange}><LeftImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : '' : ''}

            <ul>
                {
                    selectorGallSlice.fractionPageQuantity.length === 0 ? selectorGallSlice.pageQuantity.length !== 0 ? selectorGallSlice.pageQuantity.map(value => 
                        {return <li key={nanoid()}> <button style={selectorGallSlice.dayNight ? value.active ? selectorGallSlice.settings.checkColorSchem ? {backgroundColor: selectorGallSlice.colorSchem, boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)'} : {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'rgb(122, 152, 206)'} :
                        value.active ? selectorGallSlice.settings.checkColorSchem ? {backgroundColor: selectorGallSlice.colorSchem, boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)'} : {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'none'}}
                        onClick={pageSelected} name={value.name}>{value.name}</button></li>}    
                    ) : '' :
                    selectorGallSlice.fractionPageQuantity[selectorGallSlice.selectfractionPage].map(value => 
                        {return <li key={nanoid()}><button style={selectorGallSlice.dayNight ? value.active ? selectorGallSlice.settings.checkColorSchem ? {backgroundColor: selectorGallSlice.colorSchem, boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)'} : {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'rgb(122, 152, 206)'} :
                        value.active ? selectorGallSlice.settings.checkColorSchem ? {backgroundColor: selectorGallSlice.colorSchem, boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)'} : {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'none'}}
                        onClick={pageSelected} name={value.name}>{value.name}</button> </li>}    
                    ) 
                }
            </ul>

            {selectorGallSlice.fractionPageQuantity.length !== 1 ? selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.selectfractionPage
             !== selectorGallSlice.fractionPageQuantity.length - 1 ? <button className={pa.next} name={'next'} onClick={pagChange}><RightImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : '':''}

            {selectorGallSlice.fractionPageQuantity.length !== 1 ? selectorGallSlice.pageQuantity.length !== 0 && selectorGallSlice.selectfractionPage
             !== selectorGallSlice.fractionPageQuantity.length - 1 ? <button className={pa.rewind} name={'end'} onClick={pagChange}><RightImg style={{width: '20px', height: '20px', color: 'gray'}} /><RightImg style={{width: '20px', height: '20px', color: 'gray'}} /></button> : '' : ''}

        </div>
            
    </div>);
};

export default Pagination;
