
import { onAuthStateChanged   } from "firebase/auth";
import { auth } from "../../../firebase";
import { nanoid } from "nanoid";

const pathCreator = ({ pathSelector, section, contents, write, users, userIsSingInId }) => {

  let path = '';

  // retun true if element contain true
  const findProperty = data => {
    for (const key in data) {
      if (data[key] === true) {
        return true;
      }
    }
  };

  // retun key of element, that have value true
  const getPropertyKey = data => {
    for (const key in data) {
      if (data[key] === true) return key;
    }
  };

  if (pathSelector.community === true) {
   
    // for community users field
    path = `${pathSelector.name}/${section}/`;

    if (findProperty(pathSelector.arts))
      path += `${getPropertyKey(pathSelector.arts)}/`;
    if (findProperty(pathSelector.style))
      path += `${getPropertyKey(pathSelector.style)}/`;
    if (findProperty(pathSelector.items))
      path += `${getPropertyKey(pathSelector.items)}/`;

    if (write) {
      path += `${contents}/${nanoid()}/`;
    } else {
      path += `${contents}/`;
    }
  } else {
    // get singIn user
    // onAuthStateChanged(auth, user => {
      // for singIn user field

      if(auth.currentUser !== null) {

        path = `${users.find(element => element.uid === auth.currentUser.uid).userName}/${section}/`;

        if (findProperty(pathSelector.arts))
          path += `${getPropertyKey(pathSelector.arts)}/`;
        if (findProperty(pathSelector.style))
          path += `${getPropertyKey(pathSelector.style)}/`;
        if (findProperty(pathSelector.items))
          path += `${getPropertyKey(pathSelector.items)}/`;

        if (write) {
          path += `${contents}/${nanoid()}/`;
        } else {
          path += `${contents}/`;
        }
      } else {

        path = `${users.find(element => element.uid === userIsSingInId).userName}/${section}/`;

        if (findProperty(pathSelector.arts))
          path += `${getPropertyKey(pathSelector.arts)}/`;
        if (findProperty(pathSelector.style))
          path += `${getPropertyKey(pathSelector.style)}/`;
        if (findProperty(pathSelector.items))
          path += `${getPropertyKey(pathSelector.items)}/`;

        if (write) {
          path += `${contents}/${nanoid()}/`;
        } else {
          path += `${contents}/`;
        };

      };
   
      
    // });
  };

  console.log(path);
  return path;
};

export default pathCreator;