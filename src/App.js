import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import config from './config';

const EventListen = (audioRef, pauseRef, isTwinkl) => {
  window.ipcRenderer.on('handleAudio', (e, params) => {
    switch (true) {
      case params === 0:
        audioRef.current.pause()
        pauseRef.current = true
        window.ipcRenderer.send('haveMessage', false)
        break;
      case params === 1:
        audioRef.current.currentTime = 0
        pauseRef.current = false
        isTwinkl()
        break;
    }
  })

  window.ipcRenderer.on('isTwinkl', (e, params) => {
    isTwinkl()
  })
}

const App = () => {
  const audioRef = useRef(null)
  const tokenRef = useRef(null)
  const pauseRef = useRef(false);
  const countRef = useRef(0)

  const audioEnd = (e) => {
    if (countRef.current === 2) return
    countRef.current += 1
    audioRef.current.play()
  }

  const getToken = () => {
    return axios.post(`${config.host}api/auth/loginin`, config.loginUser).then((res) => {
      res.data.code === 1 && (tokenRef.current = res.data.data)
      return res
    })
  }

  const getInfo = () => {
    //tpsms/center/dmp/dmpTourTaskProblem/noAuthMaxDate
    //tpsms/center/std/stdMalfunctionCenter/noAuthMaxDateCenter
    return axios.get(`${config.host}api/tpsms/center/std/stdMalfunctionCenter/noAuthMaxDateCenter`, {
      headers: { Authorization: `Bearer ${tokenRef.current}` }
    }).then(res => res)
  }

  const handleAudio = res => {
    const { data } = res
    if (data.code === 1) {
      if (data.data.icount > 0) {
        audioRef.current.play()
        window.ipcRenderer.send('haveMessage', true)
      } else {
        audioRef.current.pause()
        window.ipcRenderer.send('haveMessage', false)
      }
    }
  }

  const isTwinkl = () => {
    getInfo().then(({ data }) => {
      window.ipcRenderer.send('haveMessage', data.data.icount === 0 ? false : true)
    })
  }

  useEffect(() => {
    EventListen(audioRef, pauseRef, isTwinkl)

    getToken().then(res => {
      getInfo().then(handleAudio)
    })

    const interval = setInterval(() => {
      if (!tokenRef.current) {
        getToken()
        return
      }
      if (pauseRef.current) {
        return
      }
      getInfo().then(handleAudio).then(() => countRef.current = 0)
    }, config.interval)

    return () => { clearInterval(interval) }
  }, [])

  return (
    <div className="App">
      <audio ref={audioRef} id='mp3' onEnded={audioEnd} src={`${require('./assets/warning.mp3')}`}></audio>
    </div>
  );
}

export default App;