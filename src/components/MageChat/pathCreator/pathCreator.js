
const pathCreator = (logicPath) => {

  const user = logicPath.email;
  const item = logicPath.iid;

  const filterProperty = (data) => {
    for (var key in data) {
        if(logicPath.art[key] === true) return key;
    } 
  };

  const art = filterProperty(logicPath.art);
  const style = filterProperty(logicPath.style);

  return `${user}/${art}/${style}/${item}/`

}

export default pathCreator;