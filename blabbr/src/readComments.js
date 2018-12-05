import firebase from './db';


/**
 * @param urlParams {}
 * e.g. {
 *  componentId: "dropdown",
 *  stateId: "default",
 *  version: "0.0.1"
 *  }
 * @returns {!firebase.Promise.<*>|firebase.Promise<any>|!firebase.Thenable.<*>|firebase.Thenable<any>}
 */
export default function readComments (urlParams) {

    var { componentId, stateId, version } = urlParams,
        parsedComments = [];

    return firebase.database().ref('/comments/' + componentId).once('value').then(function(snapshot) {
        var allComments = snapshot.val();

        if (allComments === null) {
            return {
                "success": 1,
                "comments": parsedComments
            };
        }
        try {
            parsedComments = parseComments(allComments);

            //filter comments if filter sent through
            if (stateId || version) {
                parsedComments = filterComments(parsedComments, stateId, version);
            }

            // return comments in an array and with an ID property
            return {
                "success": 1,
                "comments": parsedComments
            };
        } catch (error) {
            console.error(error);
            return {
                "success": 0,
                "error": "There was a problem reading the data from the database."
            };
        }
    });
}

// #### helper functions #####
/**
 *
 * @param comments - array
 * @param stateId - string
 * @param version - string
 * @returns {Array}
 */
function filterComments(comments, stateId, version) {
    var filteredComments = [];

    filteredComments = comments.filter((entry) => {
       return version && stateId ? entry.version === version && entry.stateId === stateId : stateId ? entry.stateId === stateId : null;
    });

    return filteredComments;
}

/**
 * @param allComments - array of objects
 * @returns tidy array of objects with id property as key
 */
function parseComments(allComments) {
    var parsedComments = [];

    for (let [key, value] of entries(allComments)) {
        value.id = key;
        parsedComments.push(value);
    }

    return parsedComments.slice(0);
}

// using a generator function to
function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}
