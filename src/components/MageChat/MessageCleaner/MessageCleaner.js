import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";

import writeUserData from 'API/writerDB';
import pathCreator from '../../MageChat/pathCreator/pathCreator';
import { change } from 'vomgallStore/gallerySlice';

const MessageCleaner = () => {

  const dispatch = useDispatch();
  const selectorGallSlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const pathSelector = useSelector(state => state.path.logicPath);

  useEffect(() => {

    // for messagesBuffer

    if(selectorGallSlice.messagesBuffer.length !== 0)

      selectorGallSlice.messagesBuffer.forEach(element => {
        // check message mounth is equal current mounth
        if(Number(selectorGallSlice.date.split('/')[1]) === Number(element.date.split('/')[1])) {

          if(Number(selectorGallSlice.date.split('/')[0]) - Number(element.date.split('/')[0]) > 7) {
            
            dispatch(change({ operation: 'deleteMessage', data: element.id }));
      
            const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: false, users: selectorGallSlice.users, userIsSingInId: selectorSingInSlice.singInId});
          
            // delete message from DB (write 'null')
            writeUserData(
              `${path}${element.id}`,
              null,
              selectorGallSlice.date, true
            );
  
          }
        // check message mounth field not equal current mounth. When message create last mounth or in last numbers of mounth and
        // user did't logIn long time and logIn next mounth.
        }else {

          if(31 - Number(element.date.split('/')[0]) + Number(selectorGallSlice.date.split('/')[0]) > 7) {
           
            dispatch(change({ operation: 'deleteMessage', data: element.id }));
      
            const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: false, users: selectorGallSlice.users, userIsSingInId: selectorSingInSlice.singInId});
          
            // delete message from DB (write 'null')
            writeUserData(
              `${path}${element.id}`,
              null,
              selectorGallSlice.date, true
            );
  
          }

        }
        
      });
      
  }, [selectorGallSlice.messagesBuffer]);

  useEffect(() => {

    // for itemsMessagesBuffer

    if(selectorGallSlice.itemsMessagesBuffer.length !== 0)

    selectorGallSlice.itemsMessagesBuffer.forEach(element => {
      if(Number(selectorGallSlice.date.split('/')[1]) === Number(element.date.split('/')[1])) {

        if(Number(selectorGallSlice.date.split('/')[0]) - Number(element.date.split('/')[0]) > 2) {
          
          dispatch(change({ operation: 'deleteMessage', data: element.id }));
    
          const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: false, users: selectorGallSlice.users, userIsSingInId: selectorSingInSlice.singInId});
        
          // delete message from DB (write 'null')
          writeUserData(
            `${path}${element.id}`,
            null,
            selectorGallSlice.date, true
          );

        }

      }else {

        if(31 - Number(element.date.split('/')[0]) + Number(selectorGallSlice.date.split('/')[0]) > 2) {
         
          dispatch(change({ operation: 'deleteMessage', data: element.id }));
    
          const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: false, users: selectorGallSlice.users, userIsSingInId: selectorSingInSlice.singInId});
        
          // delete message from DB (write 'null')
          writeUserData(
            `${path}${element.id}`,
            null,
            selectorGallSlice.date, true
          );

        }

      }
      
    });
      
  }, [selectorGallSlice.itemsMessagesBuffer]);

  return (
    <div>

    </div>
  )
}

export default MessageCleaner