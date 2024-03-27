import {createClient} from 'redis'

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '1234')
    }
});

client.on('error', (error) => {
    client.disconnect();
    console.error(error);
});

if(!client.isOpen){
    client.connect();
}
else{
    console.log('Redis client already connected');
}

export {client}