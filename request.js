class Request {
    constructor() {
        this.requestLine = null
        this.headers = null
        this.body = null
    }

    parseRequestLine(requestLineStr) {
        let parts = requestLineStr.split(" ")
        
        this.requestLine = {}
        this.requestLine.method = parts[0]
        this.requestLine.path = parts[1]
        this.requestLine.version = parts[2]
    }

    parseHeaders(requestHeaders) {
        this.headers = new Map()

        for (let header of requestHeaders) {
            let [key, ...val] = header.split(":")
            val = val.join(":")
            this.headers.set(key, val.trim())
        }
    }

    parse(requestStr) {
        let [requestLineAndHeaders, body] = requestStr.split("\r\n\r\n")
        let [requestLine, ...headers] = requestLineAndHeaders.split("\r\n")

        this.parseRequestLine(requestLine)
        this.parseHeaders(headers)
        this.body = body
    }
}

module.exports = Request;