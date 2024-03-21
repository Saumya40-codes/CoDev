'use client'

import React,{useEffect, useState} from 'react'
import styles from './folder.module.css'
import { ChevronDownIcon, ChevronLeftIcon, AddIcon, EmailIcon } from '@chakra-ui/icons'
import NewFile from './NewFile/NewFile'
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks';
import { setProjectId } from '@/app/lib/redux/features/ProjectSlice'
import { setCurrentFile, setCurrentLanguage } from '@/app/lib/redux/features/FileSlice'

interface FolderProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  files: [
    {
      id: string,
      name: string
    }
  ];
}

const Folder = ({id}:{id:string}) => {

  const [data, setData] = useState<FolderProps>();
  const[open, setOpen] = useState<boolean>(false);
  const[newFile, setNewFile] = useState<boolean>(false);
  const currentFile = useAppSelector((state)=>state?.file?.currentFile);

  useEffect(()=>{
    const getFolders = async() => {
      try{
        const res = await fetch('/api/projects',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id
          })
        });
        const data = await res.json();
        setData(data);
        
        if(data && data.files){
          const file = data.files[0];
          dispatch(setCurrentFile(file.id));
          dispatch(setCurrentLanguage(file.language));
        }
      }
      catch(err){
        console.error(err);
      }
    }
    getFolders();
  }, [data?.id, currentFile]);

  const dispatch = useAppDispatch();

  useEffect(()=>{
    if(id){
      dispatch(setProjectId(id));
    }
  }, [id]); 

  const handleChevs = (e:React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
    setOpen((prevOpen)=>!prevOpen);
  }

  return (
    <div className={styles.folders}>
      <div className={styles.names}>
        <div>
          <h1>{data?.name}</h1>
        </div>
        <div>
          {open ? (
            <div className={styles.openIcons}>
              <AddIcon onClick={()=>setNewFile((prevNewFile)=>!prevNewFile)} /> 
              <ChevronDownIcon onClick={(e)=>handleChevs(e)} />
            </div>
          ): <ChevronLeftIcon onClick={(e)=>handleChevs(e)} />}
        </div>
      </div>
      <div>
        {newFile && open && (
          <NewFile setNewFile={setNewFile} />
          )
        }
        {open && (
          <div>
            {data?.files?.map((file)=>{
              return (
                <div className={styles.files}>
                  <div>
                    <EmailIcon />
                  </div>
                  <div key={file?.id} className={styles.file}>
                    <span>{file?.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Folder
