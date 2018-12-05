import { merge, pick } from "ramda";
import * as rp from "request-promise-native";
import { Changelog } from "../changelog";
import { config } from "../config";
import { Events } from "../events";
import {
  ITwigletListResponse,
  ITwigletResponse,
} from "../interfaces";
import { rpOptions } from "../rpOptions";
import { Sequences } from "../sequences";
import { TwigletModel } from "../twigletModel";

export class Twiglet {

  /**
   * Gets a list of all of the twiglets on the server.
   *
   * @static
   * @returns {Promise<Array<{ name: string; description: string; url: string; }>>}
   * @memberof Twiglet
   */
  public static getList(): Promise<Array<{ name: string; description: string; url: string; }>> {
    return rp(rpOptions("GET", `${config.apiUrl}/twiglets`))
    .then((list: ITwigletListResponse[]) => {
      return list.map((entry) => pick(["name", "description", "url"], entry) as ITwigletListResponse);
    });
  }

  /**
   * Creates a new Twiglet.
   *
   * @static
   * @param {{
   *         name: string;
   *         description: string;
   *         model?: string;
   *         json?: string;
   *         cloneTwiglet?: string;
   *         commitMessage: string;
   *       }} body
   * @returns {Promise<Twiglet>}
   * @memberof Twiglet
   */
  public static create(body: {
        name: string;
        description: string;
        model?: string;
        json?: string;
        cloneTwiglet?: string;
        commitMessage: string;
      }): Promise<Twiglet> {
    return rp(rpOptions("POST", `${config.apiUrl}/twiglets`, body))
    .then((model: ITwigletResponse) => {
      return new Twiglet(model);
    });
  }

  /**
   * Gets a Twiglet instance representing the twiglet from the url.
   *
   * @static
   * @param {string} url the url of the twiglet on the server.
   * @returns {Promise<Twiglet>} A Twiglet instance representing the twiglet.
   * @memberof Twiglet
   */
  public static instance(url: string): Promise<Twiglet> {
    return rp(rpOptions("GET", url))
    .then((model: ITwigletResponse) => {
      return new Twiglet(model);
    });
  }

  /**
   * The twiglet's nodes
   *
   * @type {Array<{
   *     attrs?: Array<{ key: string; value?: string; }>;
   *     id: string;
   *     location?: string;
   *     name: string;
   *     type: string;
   *     x?: number;
   *     y?: number;
   *     _color?: string;
   *     _size?: string;
   *   }>}
   * @memberof Twiglet
   */
  public nodes:
    Array<{
      attrs?: Array<{ key: string; value?: string; }>;
      id: string;
      location?: string;
      name: string;
      type: string;
      x?: number;
      y?: number;
      _color?: string;
      _size?: string;
    }>;
  /**
   * The twiglet's links.
   *
   * @type {Array<{
   *       attrs?: Array<{ key: string; value?: string; }>;
   *       association?: string;
   *       id: string;
   *       source: string;
   *       target: string;
   *       _color?: string;
   *       _size?: number;
   *     }>}
   * @memberof Twiglet
   */
  public links:
    Array<{
      attrs?: Array<{ key: string; value?: string; }>;
      association?: string;
      id: string;
      source: string;
      target: string;
      _color?: string;
      _size?: number;
    }>;
  /**
   * The twiglet's name
   *
   * @type {string}
   * @memberof Twiglet
   */
  public name: string;
  /**
   * The twiglet's description.
   *
   * @type {string}
   * @memberof Twiglet
   */
  public description: string;
  /**
   * The twiglet's most recent commit message
   *
   * @type {{ message: string; user: string; timestamp: string; doReplacement?: boolean; }}
   * @memberof Twiglet
   */
  public latestCommit: { message: string; user: string; timestamp: string; doReplacement?: boolean; };
  /**
   * The changelog instance of the twiglet.
   *
   * @type {Changelog}
   * @memberof Twiglet
   */
  public changelog: Changelog;
  /**
   * The model instance of the twiglet.
   *
   * @type {TwigletModel}
   * @memberof Twiglet
   */
  public model: TwigletModel;
  /**
   * The event instance of the twiglet.
   *
   * @type {Events}
   * @memberof Twiglet
   */
  public events: Events;
  /**
   * The sequence instance of the twiglet.
   *
   * @type {Sequences}
   * @memberof Twiglet
   */
  public sequences: Sequences;
  private _rev: string; // tslint:disable-line variable-name
  private url: string;

  constructor(twiglet: ITwigletResponse) {
    this.changelog = new Changelog(twiglet.changelog_url);
    this.model = new TwigletModel(twiglet.model_url);
    this.events = new Events(twiglet.events_url);
    this.sequences = new Sequences(twiglet.sequences_url);
    this.assignIn(twiglet);
  }

  /**
   * Updates the twiglet, when the promise resolves, the twiglet instance will contain the updates.
   *
   * @param {{
   *         name?: string;
   *         description?: string;
   *         commitMessage: string;
   *         nodes?: Array<{
   *             attrs?: Array<{ key: string; value?: string; }>;
   *             id: string;
   *             location?: string;
   *             name: string;
   *             type: string;
   *             x?: number;
   *             y?: number;
   *             _color?: string;
   *             _size?: string;
   *           }>;
   *         links?: Array<{
   *             attrs?: Array<{ key: string; value?: string; }>;
   *             association?: string;
   *             id: string;
   *             source: string;
   *             target: string;
   *             _color?: string;
   *             _size?: number;
   *           }>;
   *       }} body
   * @returns {Promise<void>}
   * @memberof Twiglet
   */
  public update(body: {
        name?: string;
        description?: string;
        commitMessage: string;
        nodes?: Array<{
            attrs?: Array<{ key: string; value?: string; }>;
            id: string;
            location?: string;
            name: string;
            type: string;
            x?: number;
            y?: number;
            _color?: string;
            _size?: string;
          }>;
        links?: Array<{
            attrs?: Array<{ key: string; value?: string; }>;
            association?: string;
            id: string;
            source: string;
            target: string;
            _color?: string;
            _size?: number;
          }>;
      }): Promise<void> {
    const toUpdate = pick(["_rev"], this);
    return rp(rpOptions("PATCH", this.url, merge(toUpdate, body)))
    .then((twiglet: ITwigletResponse) => {
      this.assignIn(twiglet);
    });
  }

  /**
   * Removes the twiglet from the server, instance will be empty when promise resolves.
   *
   * @returns {Promise<void>}
   * @memberof Twiglet
   */
  public remove(): Promise<void> {
    return rp(rpOptions("DELETE", this.url))
    .then(() => {
      this.assignIn({
        _rev: null,
        changelog_url: null,
        description: null,
        events_url: null,
        json_url: null,
        latestCommit: null,
        links: null,
        model_url: null,
        name: null,
        nodes: null,
        sequences_url: null,
        url: null,
        views_url: null,
      });
    });
  }

  private assignIn(twiglet: ITwigletResponse) {
    this.nodes = twiglet.nodes;
    this.links = twiglet.links;
    this.name = twiglet.name;
    this.description = twiglet.description;
    this.latestCommit = twiglet.latestCommit;
    this.changelog["updateUrl"](twiglet.changelog_url); // tslint:disable-line:no-string-literal
    this.model["updateUrl"](twiglet.model_url); // tslint:disable-line:no-string-literal
    this.events["updateUrl"](twiglet.events_url); // tslint:disable-line:no-string-literal
    this.sequences["updateUrl"](twiglet.sequences_url); // tslint:disable-line:no-string-literal
    this._rev = twiglet._rev;
    this.url = twiglet.url;
  }
}
