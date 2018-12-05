import * as rp from "request-promise-native";
import { IEventListResponse, IEventResponse, ILink, INode } from "../interfaces";
import { rpOptions } from "../rpOptions";

export class Events {
  constructor(private eventsUrl: string) { }

  /**
   * Gets list of all of the events for a twiglet.
   *
   * @returns {Promise<IEventListResponse[]>} Promise containing an array of event summaries
   * @memberof Events
   */
  public getList(): Promise<IEventListResponse[]> {
    return rp(rpOptions("GET", this.eventsUrl));
  }

  /**
   * Gets a specific event
   *
   * @param {string} url the url of the event.
   * @returns {Promise<IEventResponse>} Promise containing the complete event
   * @memberof Events
   */
  public getOne(url: string): Promise<IEventResponse> {
    return rp(rpOptions("GET", url));
  }

  /**
   * Create an event
   *
   * @param {{ name: string, description: string}} body the name and description for the event.
   * @returns {Promise<string>} API currently returns "OK"
   * @memberof Events
   */
  public create(body: { name: string, description: string}): Promise<string> {
    return rp(rpOptions("POST", this.eventsUrl, body));
  }

  /**
   * Deletes a single event
   *
   * @param {string} url the url of the event to be deleted
   * @returns {Promise<any>} API currently returns an OK message
   * @memberof Events
   */
  public deleteOne(url: string): Promise<any> {
    return rp(rpOptions("DELETE", url));
  }

  /**
   * Removes all of the events
   *
   * @returns {Promise<any>} API currently returns an OK message
   * @memberof Events
   */
  public deleteAll(): Promise<any> {
    return rp(rpOptions("DELETE", this.eventsUrl));
  }

  private updateUrl(url: string) {
    this.eventsUrl = url;
  }
}
