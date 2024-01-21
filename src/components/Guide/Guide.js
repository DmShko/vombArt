import { useEffect } from "react";

const Guide = () => {

  useEffect(() => {
    //scroll to top on page load
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);

  return (
    <div>Guide</div>
  )
}

export default Guide