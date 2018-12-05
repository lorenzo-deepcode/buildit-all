import { expect } from 'chai';
import 'mocha';
import { DynamoClient, DynamoWritePager } from "../../../main/common/clients/DynamoClient";
import { mock, instance, when, verify, anyString, anything } from 'ts-mockito';

const mockedDynamoClient = mock(DynamoClient);
const dynamoClient = instance(mockedDynamoClient);
when(mockedDynamoClient.putAll(anyString(), anything())).thenCall((tableName, items) => Promise.resolve(items));

const pager = new DynamoWritePager(dynamoClient);

describe("Dynamo Write Pager", () => {
  it("should break up writes into groups of 25", async () => {
    const items = Array.from({length: 60}, (value, key) => key);
    const result = await pager.putAll("table_name", items);

    expect(result.map(subset => subset[0])).to.deep.equal([0, 25, 50]);
    expect(result.map(subset => subset.length)).to.deep.equal([25, 25, 10]);
  });
});
