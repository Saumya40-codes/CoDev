'use client'

import React from 'react'
import { Play } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/app/lib/redux/hooks'
import { setOutput } from '@/app/lib/redux/features/FileSlice'

const Coderunner = () => {

  const currentFile = useAppSelector((state) => state?.file.currentFile);
  const currentLanguage = useAppSelector((state) => state?.file.currentLanguage);
  const currentCode = useAppSelector((state) => state?.file.currentCode);
  const dispatch = useAppDispatch();

  const runCode = async() => {

    if(!currentFile || !currentLanguage || !currentCode){
      return;
    }

    try{
      const code = currentCode[currentFile];

      if(!code || code === ''){
        return;
      }

      const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT:  "https://codev-api.onrender.com";

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          lang: currentLanguage
        })
      });

      const data = await res.json();

      const output = String(data.output)

      dispatch(setOutput({fileId: currentFile, output}));
    }
    catch(e){
      console.log(e);
    }
  }
  return (
    <div>
        <Play color="white" size={52} onClick={runCode} cursor='pointer' />
    </div>
  )
}

export default Coderunner
