import { Alert, Button } from '@mui/material';
import * as React from 'react';
import { useState, useEffect } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dropzone from './components/dropzone';
import * as fileCheck from './fileCheck'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f71cf',
    },
    secondary: {
      main: '#11cb5f',
    },
  },
});

interface formInfo {
  filename: string,
  file: File
}

interface fileType {
  raw: string
}

function App() {
  const [error, setError] = useState({ isError: false, message: '' });
  const [activated, setActivated] = useState(false);

  const [formData1, setFormData1] = useState<formInfo | Object>({});
  const [formData2, setFormData2] = useState<formInfo | Object>({});

  function checkFiles(e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>): Boolean {
    setActivated(!activated);

    let fileList: FileList | null = null;

    if ('files' in e.target) {
      fileList = e.target.files;
    } else if ('dataTransfer' in e) {
      fileList = e.dataTransfer.files;
    }

    const file = fileList?.[0];
    const fileName: string | undefined = file?.name;

    if (fileList !== null && fileList.length > 1) {
      setError({ isError: true, message: 'You may only drag and drop one file into each dropzone.' });
      return true;
    }

    const substringArray: string[] | undefined = fileName?.split('.');
    const substringArrayLength = substringArray?.length;

    if (substringArrayLength !== 2) {
      setError({ isError: true, message: 'malformed file' });
      return true;
    }

    if (substringArray !== null && substringArray?.[substringArrayLength - 1].toLowerCase() !== 'xlsx') {
      setError({ isError: true, message: `${fileName} is not of type .xlsx` })
      return true;
    }

    return false;
  }

  async function handleSubmit() {
    const formData1Length: number = Object.keys(formData1).length;
    const formData2Length: number = Object.keys(formData2).length;

    if (formData1Length !== 0 && formData2Length !== 0) {

      if ('file' in formData1 && 'file' in formData2) {
        const fileOptions = await fileCheck.default(formData1, formData2, setError);
        const formData = new FormData();

        if (fileOptions.raw === 'file1') {
          formData.append('raw', formData1.file);
          formData.append('report', formData2.file);
        }
        else if (fileOptions.raw === 'file2') {
          formData.append('raw', formData2.file);
          formData.append('report', formData1.file);
        }

        let link;

        const productionURL = 'https://cbookingreport.com/api/compute'
        const localURL = 'http://localhost:4000/api/compute'

        try {
          fetch(localURL, { method: 'POST', body: formData })
            .then((res) => {
              if (!res.ok) {
                throw new Error('Something went wrong...');
              }
              else {
                return res.blob()
              }
            })
            .then((blob) => {
              const url = window.URL.createObjectURL(new Blob([blob]));
              let link = document.createElement('a');
              link.href = url;
              link.setAttribute(
                'download',
                `report.xlsx`,
              );
              document.body.appendChild(link);
              link.click();
              link.parentNode?.removeChild(link);
            })
            .catch((error) => {
              console.log(error);
            })
        } catch (error) {
          console.log(error);
        }
      }
    }
    else {
      setActivated(!activated);
      setError({ isError: true, message: "you can't leave file submission empty" })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setError({ isError: false, message: '' })
    }, 5000)
    return () => clearTimeout(timer);
  }, [activated])

  return (
    <>
      <Alert severity="error" className={`fixed w-screen -top-12 !transition-transform duration-1000 ${error.isError ? 'translate-y-12' : 'translate-y-0'}`}>{error.message}</Alert>

      <div className='max-w-5xl w-full h-screen	mx-auto flex justify-center items-center shadow-xl	'>
        <form className='w-full mb-12'>
          <div className='flex justify-around w-full'>
            <Dropzone name='Drag & Drop ws1' checkFiles={checkFiles} setFormData1={setFormData1} setFormData2={setFormData2}></Dropzone>
            <Dropzone name='Drag & Drop ws2' checkFiles={checkFiles} setFormData1={setFormData1} setFormData2={setFormData2}></Dropzone>
          </div>
          <div className='w-full flex justify-center items-center mt-16'>
            <ThemeProvider theme={theme}>
              <Button variant="contained" className='!mx-auto w-1/2' onClick={handleSubmit}>Generate</Button>
            </ThemeProvider>
          </div>
        </form>
      </div>
    </>
  );
}



export default App;




