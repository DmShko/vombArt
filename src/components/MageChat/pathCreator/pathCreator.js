
const pathCreator = (logicPath) => {
  console.log(logicPath);
  const user = logicPath.name;
   
  const filterProperty = (data) => {
    for (const key in data) {
        if(data[key] === true) return key;
    } 
  };

  const art = filterProperty(logicPath.arts);
  const style = filterProperty(logicPath.style);

  console.log(`${user}/${art}/${style}/items/`);
  return `${user}/${art}/${style}/items/1/Kolya`

}

export default pathCreator;