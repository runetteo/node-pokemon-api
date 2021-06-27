const { pokemonService } = require('../services');
const url = require('url');

const handleError = (res) => {

    const success = false;
    const result = { success, errorMessage: `name is required in path.`};

    writeResponse(result, 400, res);

};

const writeResponse = (result, responseCode, res) => {
    res.writeHead(responseCode, {
        'Content-Type': 'application/json',
    });
    res.write(JSON.stringify(result));
    res.end();
};


exports.handleGetRequest = (req, res) => {
    let data;

    const queryObject = url.parse(req.url,true).query;
    if (queryObject && queryObject.name) {
        data = pokemonService.getByName(queryObject.name);
    } else {
        data = pokemonService.get();
    }

    const result = { data };

    writeResponse(result, 200, res);
};


exports.handlePostRequest = (req, res) => {
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);

        const result = pokemonService.insert(dataJson);

        let responseCode = 200;
        if (!result.success) {
            responseCode = 400;
        }

        writeResponse(result, responseCode, res);
    });
};

exports.handleDeleteRequest = (req, res) => {

    const queryObject = url.parse(req.url,true).query;
    
    if (queryObject && queryObject.name) {
        const result = pokemonService.delete(queryObject.name);
        
        let responseCode = 200;
        if (!result.success) {
            responseCode = 400;
        }

        writeResponse(result, responseCode, res);

    } else {
        handleError(res);
    }

};

exports.handlePutRequest = (req, res) => {
    const queryObject = url.parse(req.url,true).query;
    
    if (queryObject && queryObject.name) {

        const data = [];
        req.on('data', (chunk) => {
            data.push(chunk);
        });
    
        req.on('end', () => {
            const parsedData = Buffer.concat(data).toString();
            const dataJson = JSON.parse(parsedData);
    
            const result = pokemonService.update(queryObject.name, dataJson);
    
            let responseCode = 200;
            if (!result.success) {
                responseCode = 400;
            }
    
            writeResponse(result, responseCode, res);
        });

    } else {
        handleError(res);
    }

};