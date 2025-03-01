const net = require("net");
const fs = require('fs');
const Request = require('./request');
const blockFor = require("./util")

const server = net.createServer((connection) => { 
    console.log('client connected');

    connection.on('end', () => {
        console.log('client disconnected');
    });

    connection.on('error', () => {
        console.log('client disconnected');
    });

    connection.on('data', (data) => {
        let request = new Request()
        request.parse(data.toString())
        path = request.requestLine.path

        if (path == "/") {
            blockFor(3000)
            connection.write("HTTP/1.1 200 OK\r\n\r\n")
        } 
        
        else if (path.startsWith("/echo")) {
            let arg = path.split("/")[2]
            const response =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${arg.length}\r\n` +
                'Connection: close\r\n' +
                '\r\n' + 
                arg;

            connection.write(response)
        } 

        else if (path == "/user-agent") {
            let userAgent = request.headers.get("User-Agent")

            if (typeof userAgent == "undefined") {
                const response =
                'HTTP/1.1 400 Bad Request\r\n' +
                'Content-Type: text/plain\r\n' +
                'Content-Length: 35\r\n' +
                'Connection: close\r\n' +
                '\r\n' + 
                'Missing required header: User-Agent';

                connection.write(response)
            }
            
            const response =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Type: text/plain\r\n' +
                `Content-Length: ${userAgent.length}\r\n` +
                'Connection: close\r\n' +
                '\r\n' + 
                userAgent;

            connection.write(response)
        }

        else if (path.startsWith("/files")) {
            let fileName = path.split("/")[2]
            let filePath = `./tmp/${fileName}`

            if (request.requestLine.method == "GET") {
                if (fs.existsSync(filePath)) {
                    try {
                        const fileBuffer = fs.readFileSync(filePath) 
                    
                        const headers =
                            'HTTP/1.1 200 OK\r\n' +
                            'Content-Type: application/octet-stream\r\n' +
                            `Content-Length: ${fileBuffer.length}\r\n` +
                            '\r\n';

                        // convert headers to a Buffer & combine the header and file buffers
                        const headersBuffer = Buffer.from(headers, 'utf8');
                        const responseBuffer = Buffer.concat([headersBuffer, fileBuffer]);

                        connection.write(responseBuffer);
                    } catch (err) {
                        console.error('Error reading file:', err)
                        connection.write(
                            `HTTP/1.1 500 Internal Server Error\r\n` +
                            `Content-Length: 19\r\n` +
                            `Connection: close\r\n` +
                            `\r\n` +
                            `Error parsing file.`
                        )
                    }
                } else {
                    console.error('File not found.')
                    connection.write("HTTP/1.1 404 Not Found\r\n\r\n")
                }
            }

            else if (request.requestLine.method == "POST") {
                try {
                    fs.writeFileSync(filePath, request.body)
                    connection.write("HTTP/1.1 201 Created\r\n\r\n")
                } catch (err) {
                    console.log(err)
                    connection.write(
                        `HTTP/1.1 500 Internal Server Error\r\n` +
                        `Content-Length: 19\r\n` +
                        `Connection: close\r\n` +
                        `\r\n` +
                        `Error writing file.`
                    )
                }
            }
        } 
        
        else {
            connection.write("HTTP/1.1 404 Not Found\r\n\r\n")
        }

        connection.end()
    });
});

server.listen(8080, function() { 
   console.log('server is listening on port 8080...');
});