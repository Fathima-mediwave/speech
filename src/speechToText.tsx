import React, { Component, useState } from 'react';
import Select from 'react-select';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { BsFillMicFill, BsFillStopCircleFill } from 'react-icons/bs';
import { BsSendFill } from 'react-icons/bs';
import { AiOutlineClear } from 'react-icons/ai';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SpeechToText() {
  const [record, setRecord] = useState('');
  const [values, setValues] = useState('');
  const [sendData, setSendData] = useState('');
  const [selectedOption, setSelectedOption] = useState({});
  // const [selectValue, setSelectValue] = useState<any>([]);
  const [value, setValue] = useState(null);
  const [selectValue, setSelectValue] = useState<any>([]);
  const options = [
    { value: 'none', label: 'Empty' },
    { value: 'left', label: 'Open Left' },
    { value: 'right', label: 'Open Right' },
    {
      value: 'tilt,left',
      label: 'Tilf and Open Left',
    },
    {
      value: 'tilt,right',
      label: 'Tilf and Open Right',
    },
  ];

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
    formik.setFieldValue('inputValue', '');
    // setInputValue('');
  }

  function send() {
    console.log('test');
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
            formik.setFieldValue('inputValue', data.data.text);
            // setInputValue(data.data.text);
            formik.handleSubmit();
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
          // setValues(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const formik = useFormik({
    initialValues: {
      inputValue: '',
    },
    validationSchema: Yup.object({
      inputValue: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      console.log('test');
      alert(JSON.stringify(values, null, 2));
      send();
    },
  });
  ////////////////////Dropdown

  const handleChange = (value: any) => {
    setValue(value);
    setSelectValue([...selectValue, value.value]);
    console.log(`Option selected:`, value);
    console.log(`Option :==`, selectValue);
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
          // onClick={() => {
          //   makeAsTouched(
          //     textConst.addDiagnosis,
          //     formik.values.addDiagnosis
          //   );
          //   if (formik.values.addDiagnosis.name) {
          //     send(formik.values, textConst.diagnosis);
          //   }
          // }}
        >
          <BsSendFill />
        </button>
      </div>
      <div>
        <form onSubmit={formik.handleSubmit} action=''>
          <input
            style={{
              width: '200%',
            }}
            type='text'
            className='form-control my-3 mx-4 '
            aria-label='Default'
            aria-describedby='inputGroup-sizing-default'
            // value={inputValue}
            name='inputValue'
            placeholder='Start Recording'
            onChange={formik.handleChange}
            value={formik.values.inputValue}
            onBlur={formik.handleBlur}
          ></input>
          {formik.touched.inputValue && formik.errors.inputValue ? (
            <div>{formik.errors.inputValue}</div>
          ) : null}
        </form>
      </div>
      {/* Dropdown */}
      <Select value={value} onChange={handleChange} options={options} />

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
