// import React, {useRef, useEffect} from "react";
//
// import "./Map.css";
//
// const Map = props => {
//   const mapRef = useRef();
//
//   const [centre, zoom] = props;
//
//   useEffect(() => {
//     const map = new window.google.maps.Map(mapRef.current ,{
//       centre: centre,
//       zoom: zoom
//     });
//     new window.google.maps.Marker({postion: centre, map: map});
//   }, [centre, zoom]);
//
//
//
//   return (
//     <div
//     ref={mapRef}
//     className = {`map ${props.className}`}
//     style = {props.style}
//     >
//     </div>
//   )
// }
//
// export default Map;
