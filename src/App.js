import React, { useRef, useEffect } from 'react';

function App() {
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current.play()
  }, [])


  return (
    <div className="App">
      <audio ref={audioRef} id='mp3' src='https://music.163.com/song/media/outer/url?id=1910842986.mp3'></audio>
    </div>
  );
}

export default App;
