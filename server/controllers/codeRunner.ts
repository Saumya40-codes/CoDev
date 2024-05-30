import fs from 'fs';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

let langs = {
    'python': 'python-env',
    'javascript': 'js-env',
    'java': 'java-env',
    'cpp': 'cpp-env',
    'go': 'go-env'
}

let ext = {
    'python': 'py',
    'javascript': 'js',
    'java': 'java',
    'cpp': 'cpp',
    'go': 'go'
}

export const execCode = (code : string, lang : string) => {

    try{

        if(!(lang in langs)){
            return 'Language not supported';
        }

        let id = uuidv4();
        
        fs.mkdirSync(`codes/${id}`);
        fs.writeFileSync(`codes/${id}/script.${ext[lang as keyof typeof ext]}`, code);

        const sys = os.platform();

        let command = '';

        if(lang === 'javascript'){
            command = `node codes/${id}/script.js`;
        }
        else if(sys === 'win32'){
            command = `docker run --rm -v %cd%/codes/${id}:/usr/src/app ${langs[lang as keyof typeof langs]}`;
        }
        else{
            command = `docker run --rm -v $(pwd)/codes/${id}:/usr/src/app ${langs[lang as keyof typeof langs]}`;
        }

        exec(command, (error, stdout, stderr) => {

            fs.rm(`codes/${id}`, { recursive: true }, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            if (error) {
                console.log(`error: ${error.message}`);

                return error.message;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return stderr;
            }
            console.log(`stdout: ${stdout}`);
            return stdout;
        });
    }
    catch(err){
        console.log(err);
    }
}