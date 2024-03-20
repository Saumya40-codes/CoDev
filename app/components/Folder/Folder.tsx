'use client'

import React,{useEffect, useState} from 'react'
import styles from './folder.module.css'
import { ChevronDownIcon, ChevronLeftIcon, AddIcon } from '@chakra-ui/icons'
import NewFile from './NewFile/NewFile'

interface FolderProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const Folder = ({id}:{id:string}) => {

  const [data, setData] = useState<FolderProps>();
  const[open, setOpen] = useState<boolean>(false);
  const[newFile, setNewFile] = useState<boolean>(false);

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
        console.log(data);
      }
      catch(err){
        console.error(err);
      }
    }
    getFolders();
  }, [data?.id]);

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
          <NewFile />
          )
        }
      </div>
    </div>
  )
}

export default Folder
