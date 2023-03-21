import React, { Component, useState } from 'react';
import Select from 'react-dropdown-select';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { BsFillMicFill, BsFillStopCircleFill } from 'react-icons/bs';
import { BsSendFill } from 'react-icons/bs';
import { AiOutlineClear } from 'react-icons/ai';

const options = [
  {
    value: 1,
    label: 'Leanne Graham',
  },
  {
    value: 2,
    label: 'Ervin Howell',
  },
];

function SpeechToText() {
  const [record, setRecord] = useState('');
  const [values, setValues] = useState('');
  const [sendData, setSendData] = useState('');
  const [inputValue, setInputValue] = React.useState('');
  function start() {
    setRecord(RecordState.START);
    console.log(RecordState, 'hgfghf');
  }

  function stop() {
    setRecord(RecordState.STOP);
  }
  function ClearData() {
    setRecord('');
    setValues('');
    setSendData('');
    setInputValue('');
  }

  function send() {
    if (sendData) {
      const selectedFile: any = sendData;
      const formData = new FormData();
      console.log('iffffff');
      // const blob = new Blob([selectedFile.data]);
      formData.append('audio-input', selectedFile.blob);
      console.log(formData);
      fetch('http://localhost:8001/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, 'hhello');
          if (data.success) {
            setInputValue(data.data.text);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  //audioData contains blob and blobUrl
  const onStop = (audioData: any) => {
    console.log(audioData, 'dattaaaaaa');
    setSendData(audioData);
  };
  const onSelect = (values: any) => {
    const formData = new FormData();
    formData.append('audio-input', values);
    console.log(values, 'valuueee');
    console.log(formData);
    fetch('http://localhost:8001/translate', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, 'hhello----translate');
        if (data.success) {
          setValues(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <h1 className='display-4'>Speech to Text</h1>
      <AudioReactRecorder state={record} onStop={onStop} />
      <div>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => start()}
        >
          <BsFillMicFill />
        </button>
        <button
          type='button'
          className='btn btn-danger mx-3 my-3'
          onClick={() => stop()}
        >
          <BsFillStopCircleFill />
        </button>
        <button
          type='button'
          className='btn btn-success'
          onClick={() => send()}
        >
          <BsSendFill />
        </button>
      </div>
      <div>
        <input
          style={{
            width: '200%',
          }}
          type='text'
          className='form-control my-3 mx-4 '
          aria-label='Default'
          aria-describedby='inputGroup-sizing-default'
          value={inputValue}
        ></input>
      </div>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <button
          type='button'
          className='btn btn-light'
          onClick={() => ClearData()}
        >
          <AiOutlineClear />
        </button>
      </div>
    </div>
  );
}

export default SpeechToText;
