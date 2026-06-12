import { createServer } from 'node:http'

const server = createServer((request: Request,) => {
    console.log("oi");
});

server.listen(3000);