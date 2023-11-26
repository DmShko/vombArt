import { auth } from "../firebase";
import { nanoid } from "nanoid";

const pathCreator = (logicPath) => {

  path='';
  // retun key of element, that have value true
  const findProperty = (data) => {

    for (const key in data) {
        if(data[key] === true) 
        {
          return true;

        } else {

          return false;

        }
    }
  };

  // retun key of element, that have value true
  const getPropertyKey = (data) => {
    for (const key in data) {
        if(data[key] === true) return key;
    } 
  };

  if(logicPath.community) {

      // for community users field
      path=`${logicPath.name}/`

      if(findProperty(logicPath.arts)) path +=`${getPropertyKey(logicPath.arts)}/`;
      if(findProperty(logicPath.style)) path +=`${getPropertyKey(logicPath.style)}/`;
      if(findProperty(logicPath.items)) path +=`${getPropertyKey(logicPath.items)}/`;

      path += `${nanoid()}/`

  } else {

    onAuthStateChanged(auth, (user) => { 

      // for singIn user field
      path=`${user.email}/`;

      if(findProperty(logicPath.arts)) path +=`${getPropertyKey(logicPath.arts)}/`;
      if(findProperty(logicPath.style)) path +=`${getPropertyKey(logicPath.style)}/`;
      if(findProperty(logicPath.items)) path +=`${getPropertyKey(logicPath.items)}/`;

      path += `${nanoid()}/`
      
    });

  }

  console.log(path);
  return path;

}

export default pathCreator;