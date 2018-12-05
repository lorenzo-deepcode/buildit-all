import "babel-polyfill";

var config = require('../config.json');

import url from 'url';
import writeComment from './writeComments';
import readComments from './readComments';
import deleteComment from './deleteComment';
import editComment from './editComment';
import micro, {
    json,
    send,
    sendError,
} from 'micro';
import { slug } from './utils';
import urlPattern from 'url-pattern';

/**
 * handle POST requests
 */
async function postHandler(request) {
    const postParams = await json(request);
    const { pathname } = url.parse(request.url);
    const timestamp = new Date().getTime();

    var commentData = {
        userName: postParams.userName,
        userEmail: postParams.userEmail,
        componentId: slug(pathname),
        comment: postParams.comment,
        timestamp: timestamp,
        stateId: postParams.stateId,
        version: postParams.version,
        edited: false,
        lastUpdated: timestamp
    };

    return await writeComment(commentData);
}

/**
 * handle GET requests
 * Possibilities include:
 * http://[HOST]:[PORT]/[COMPONENTID] OR
 * * http://[HOST]:[PORT]/[COMPONENTID]/[STATEID] OR
 * * http://[HOST]:[PORT]/[COMPONENTID]/[STATEID]/[VERSION]
 */
async function getHandler(request) {
    const { pathname } = url.parse(request.url);
    var pattern = new urlPattern('(/:componentId)(/:stateId)(/:version)');
    var urlParams = pattern.match(pathname);

    return await readComments(urlParams);
}
/**
 * handle DELETE requests
 * http://[HOST]:[PORT]/[COMPONENTID]/[COMMENTID]
 */
async function deleteHandler(request) {
    const { pathname } = url.parse(request.url);
    var pattern = new urlPattern('(/:componentId)(/:commentId)');
    var urlParams = pattern.match(pathname);

    return await deleteComment(urlParams);
}
/**
 * handle PUT requests
 * http://[HOST]:[PORT]/[COMPONENTID]/[COMMENTID]
 * Body param e.g. { comment: "update to comment" }
 *
 */
async function putHandler(request) {
    var { pathname } = url.parse(request.url),
        pattern = new urlPattern('(/:componentId)(/:commentId)'),
        urlParams = pattern.match(pathname),
        postParams = await json(request);

    return await editComment(urlParams, postParams);
}

/**
 * Check the request method and use postHandler or getHandler (or other method handlers)
 */
async function methodHandler(request, response) {
    try {
        switch (request.method) {
            case 'POST':
                return await postHandler(request);
            case 'GET':
                return await getHandler(request);
            case 'DELETE':
                return await deleteHandler(request);
            case 'PUT':
                return await putHandler(request);
            default:
                console.log("METHOD not allowed: ", request.method);
                send(response, 405, { success: 0, error: "Invalid HTTP method" });
                break;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * our micro service, run methodHandler and send result as a response (or an error)
 */
const server = micro(async function (request, response) {
    try {
        // Add CORS
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');

        if (request.method === 'OPTIONS') {
          return send(response, 200);
        }
        send(response, 200, await methodHandler(request, response));
    } catch (error) {
        sendError(request, response, error);
    }
});
const PORT = process.env.port || config.PORT || 3000;
server.listen(PORT);

console.log(`API listening on port: ${PORT}`);
