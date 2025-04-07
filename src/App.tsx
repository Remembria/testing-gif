import { useState } from 'react'
import './App.css'
import { useFirstVideoFrame } from "./GetFirstFrame"
// import ClickableImage from "./ClickableImage"
import ImageMarker, { Marker } from 'react-image-marker';


// function onClickImage(event: React.MouseEvent, points: { x: number; y: number }[], setPoints: React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>) {
//   const x: number = event.nativeEvent.offsetX;
//   // if (videoSize) {
//   //   x = videoSize.width - x;
//   // }

//   const y: number = event.nativeEvent.offsetY;
//   const newPoint = { x, y };
//   setPoints([...points, newPoint])
// }

// const CustomMarker = () => {
//   return (
//     <img src="./public/marker_image.png" className="custom-marker"></img>
//   );
// };


function App() {
  const { imageSrc, loading, error, extractFirstFrame } = useFirstVideoFrame();
  const [points, setPoints] = useState<[Number, Number][]>([]);
  const [markers, setMarkers] = useState<Array<Marker>>([]);

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      extractFirstFrame(file);
    }
  };

  const handleImageClick = (marker: Marker) => {
    setMarkers([...markers, marker]);
    setPoints([...points, [marker.top, marker.left]]);
  }

  const handleSubmit = () => {
    return null;
  }

  return (
    <>
      <div className="controls">
        <h1>GimmeGIF</h1>
        <p>Add a video. Select a thing. Thing &rarr; GIF.</p>
        <input type="file" id="video" name="video" accept="video/mp4" onChange={handleVideoChange} />
        {imageSrc && <button onClick={handleSubmit}>Submit</button>}
      </div>
      {loading && <p>Loading first frame...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {/* <ClickableImage imageSrc={imageSrc} points={points} onClickImage={(x) => {
        onClickImage(x, points, setPoints);
        console.log(points);
      }} /> */}
      {imageSrc && <ImageMarker
        src={imageSrc}
        markers={markers}
        onAddMarker={(marker: Marker) => handleImageClick(marker)}
      // markerComponent={CustomMarker}
      />}
    </>
  )
}

export default App
