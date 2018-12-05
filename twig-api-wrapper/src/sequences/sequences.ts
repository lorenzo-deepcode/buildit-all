import * as rp from "request-promise-native";
import { ISequence } from "../interfaces";
import { rpOptions } from "../rpOptions";

export class Sequences {
  constructor(private sequencesUrl: string) { }

  /**
   * Gets a list of the sequences on this twiglet
   *
   * @returns {Promise<ISequence[]>} Promise containing an array of sequences
   * @memberof Sequences
   */
  public getList(): Promise<ISequence[]> {
    return rp(rpOptions("GET", this.sequencesUrl));
  }

  /**
   * Gets a specific sequence
   *
   * @param {string} url the url representing the sequence on the server
   * @returns {Promise<ISequence>} promise containing the specific sequence
   * @memberof Sequences
   */
  public getOne(url: string): Promise<ISequence> {
    return rp(rpOptions("GET", url));
  }

  /**
   * Creates a new sequence on the server
   *
   * @param {{ description: string, name: string, events: string[] }} body events is an array of event ids
   * @returns {Promise<string>} API currently returns an OK
   * @memberof Sequences
   */
  public create(body: { description: string, name: string, events: string[] }): Promise<string> {
    return rp(rpOptions("POST", this.sequencesUrl, body));
  }

  /**
   * Updates a sequence on the server, PUT-like call.
   *
   * @param {string} url the url representing the sequence on the server
   * @param {{ description: string, name: string, events: string[] }} body events is an array of event ids
   * @returns {Promise<ISequence>} returns the sequence wrapped in a promise.
   * @memberof Sequences
   */
  public update(url: string, body: { description: string, name: string, events: string[] }): Promise<ISequence> {
    return rp(rpOptions("PUT", url, body));
  }

  /**
   * Deletes a sequence from the server.
   *
   * @param {string} url the url representing the sequence on the server
   * @returns {Promise<any>} API currently returns OK
   * @memberof Sequences
   */
  public deleteOne(url: string): Promise<any> {
    return rp(rpOptions("DELETE", url));
  }

  private updateUrl(url: string) {
    this.sequencesUrl = url;
  }
}
