import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import config from './config';

const App = () => {
  const audioRef = useRef(null)
  const tokenRef = useRef(null)
  const pauseRef = useRef(false);

  const audioEnd = (e) => {
    audioRef.current.play()
  }

  const getToken = () => {
    return axios.post(`${config.host}api/auth/loginin`, config.loginUser).then((res) => {
      res.data.code === 1 && (tokenRef.current = res.data.data)
    })
  }

  const getInfo = () => {
    return axios.get(`${config.host}api/tpsms/center/dmp/dmpTourTaskProblem/noAuthMaxDate`, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    }).then(res => res)
  }

  useEffect(() => {
    window.ipcRenderer.on('handleAudio', (e, params) => {
      switch (true) {
        case params === 0:
          audioRef.current.pause()
          pauseRef.current = true
          break;
        case params === 1:
          audioRef.current.play()
          pauseRef.current = false
          break;
      }
    })

    getToken()

    const interval = setInterval(() => {
      if (!tokenRef.current) {
        getToken()
        return
      }
      if (pauseRef.current) {
        return
      }
      getInfo().then(res => {
        const { data } = res
        if (data.code === 1) {
          data.data.icount > 0 ? audioRef.current.play() : audioRef.current.pause()
        }
      }).catch(() => getToken())
    }, config.interval)

    return () => { clearInterval(interval) }
  }, [])

  return (
    <div className="App">
      <audio ref={audioRef} id='mp3' onEnded={audioEnd} src={`${require('./assets/IOS.wav')}`}></audio>
    </div>
  );
}

export default App;