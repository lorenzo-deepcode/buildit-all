
import firebase from './db';

export default function writeComment(commentData) {
    try {
        // get reference to the table
        var tableRef = firebase.database().ref('/comments/' + commentData.componentId);

        // create a new row in the table
        var rowRef = tableRef.push();

        // write data to the new row, priority set to get comments in descending order
        rowRef.setWithPriority(commentData, 0 - commentData.timestamp);

        return {
            "success": 1,
            "msg": "Your comment was added successfully.",
            "comment": commentData
        };
    } catch (error) {
        console.error(error);
        return {
            "success": 0,
            "msg":  "There was a problem posting your comment."
        };
    }
}
