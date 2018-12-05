import { DynamoClient } from "../../common/clients/DynamoClient";
import { dropboxAccountId, cursor } from "../Api";

export class CursorRepository {

  constructor(readonly dynamo: DynamoClient) {}

  async fetchCursor(accountId: dropboxAccountId): Promise<string> {
    const result = await this.dynamo.get("dropbox_cursors", {
      "account_id": accountId
    });

    return result && result.cursor || undefined;
  }

  saveCursor(accountId: dropboxAccountId, cursor: cursor): Promise<void> {
    return this.dynamo.put("dropbox_cursors", {
      account_id: accountId,
      cursor: cursor
    });
  }
}
