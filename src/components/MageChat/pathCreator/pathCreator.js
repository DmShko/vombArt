
const pathCreator = (logicPath) => {
  console.log(logicPath);
  const user = logicPath.name;
  const item = logicPath.iid;
  
  const filterProperty = (data) => {
    for (const key in data) {
        if(data[key] === true) return key;
    } 
  };

  const art = filterProperty(logicPath.arts);
  const style = filterProperty(logicPath.style);

  console.log(`${user}/${art}/${style}/${item}/`);
  return `${user}/${art}/${style}/${item}/`

}

export default pathCreator;