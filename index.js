const net = require("net");
const Request = require('./request');

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
        
        else {
            connection.write("HTTP/1.1 404 Not Found\r\n\r\n")
        }

        connection.end()
    });
});

server.listen(8080, function() { 
   console.log('server is listening');
});