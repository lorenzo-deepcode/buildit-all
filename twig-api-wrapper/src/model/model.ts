import { merge, pick } from "ramda";
import * as rp from "request-promise-native";
import { Changelog } from "../changelog";
import { config } from "../config";
import { rpOptions } from "../rpOptions";
import {
  IModelResponse,
} from "./../interfaces";

export class Model {

  /**
   * Gets a list of models from the server.
   *
   * @static
   * @returns {Promise<Array<{ name: string; url: string; }>>}
   * @memberof Model
   */
  public static getList(): Promise<Array<{ name: string; url: string; }>> {
    return rp(rpOptions("GET", `${config.apiUrl}/models`));
  }

  /**
   * Creates a new Model.
   *
   * @static
   * @param {{
   *         name: string;
   *         commitMessage: string;
   *         entities: { [key: string]: {
   *           class: string;
   *           color?: string;
   *           image: string;
   *           size?: number;
   *           type?: string;
   *           attributes: Array<{
   *             name: string;
   *             dataType: string;
   *             required: boolean;
   *           }>;
   *         } };
   *       }} body
   * @returns {Promise<Model>}
   * @memberof Model
   */
  public static create(body: {
        name: string;
        commitMessage: string;
        entities: { [key: string]: {
          class: string;
          color?: string;
          image: string;
          size?: number;
          type?: string;
          attributes: Array<{
            name: string;
            dataType: string;
            required: boolean;
          }>;
        } };
      }): Promise<Model> {
    return rp(rpOptions("POST", `${config.apiUrl}/models`, body))
    .then((model: IModelResponse) => {
      return new Model(model);
    });
  }

  /**
   * Gets a Model instance representing the model from the url
   *
   * @static
   * @param {string} url the url of the model on the server
   * @returns {Promise<Model>} an Model instance representing model
   * @memberof Model
   */
  public static instance(url: string): Promise<Model> {
    return rp(rpOptions("GET", url))
    .then((model: IModelResponse) => {
      return new Model(model);
    });
  }

  /**
   * The model's entities
   *
   * @type {{ [key: string]: {
   *           class: string;
   *           color?: string;
   *           image: string;
   *           size?: number;
   *           type?: string;
   *           attributes: Array<{
   *             name: string;
   *             dataType: string;
   *             required: boolean;
   *           }>;
   *         } }}
   * @memberof Model
   */
  public entities: { [key: string]: {
          class: string;
          color?: string;
          image: string;
          size?: number;
          type?: string;
          attributes: Array<{
            name: string;
            dataType: string;
            required: boolean;
          }>;
        } };

  /**
   * The name of the model
   *
   * @type {string}
   * @memberof Model
   */
  public name: string;

  /**
   * The model's most recent commit message
   *
   * @type {{
   *       message: string;
   *       user: string;
   *       timestamp: string;
   *       doReplacement?: boolean;
   *     }}
   * @memberof Model
   */
  public latestCommit: {
      message: string;
      user: string;
      timestamp: string;
      doReplacement?: boolean;
    };

  /**
   * The changelog instance for this model.
   *
   * @type {Changelog}
   * @memberof Model
   */
  public changelog: Changelog;
  private _rev: string; // tslint:disable-line variable-name
  private url: string;

  constructor(model: IModelResponse) {
    this.changelog = new Changelog(model.changelog_url);
    this.assignIn(model);
  }

  /**
   * Updates the model with new information, works like a patch route.
   *
   * @param {{
   *       name?: string;
   *       commitMessage: string;
   *       entities?: { [key: string]: {
   *         class: string;
   *         color?: string;
   *         image: string;
   *         size?: number;
   *         type?: string;
   *         attributes: Array<{
   *           name: string;
   *           dataType: string;
   *           required: boolean;
   *         }>;
   *       } };
   *     }} body
   * @returns {Promise<void>}
   * @memberof Model
   */
  public update(body: {
      name?: string;
      commitMessage: string;
      entities?: { [key: string]: {
        class: string;
        color?: string;
        image: string;
        size?: number;
        type?: string;
        attributes: Array<{
          name: string;
          dataType: string;
          required: boolean;
        }>;
      } };
    }): Promise<void> {
    const toUpdate = pick(["entities", "name", "_rev"], this);
    return rp(rpOptions("PUT", this.url, merge(toUpdate, body)))
    .then((model: IModelResponse) => {
      this.assignIn(model);
    });
  }

  /**
   * Deletes a model off of the server.
   *
   * @returns {Promise<void>}
   * @memberof Model
   */
  public remove(): Promise<void> {
    return rp(rpOptions("DELETE", this.url))
    .then(() => {
      this.assignIn({
        _rev: null,
        changelog_url: null,
        entities: null,
        latestCommit: null,
        name: null,
        url: null,
      });
    });
  }

  private assignIn(model: IModelResponse) {
    this.entities = model.entities;
    this.name = model.name;
    this._rev = model._rev;
    this.latestCommit = model.latestCommit;
    this.url = model.url;
    this.changelog["updateUrl"](model.changelog_url); // tslint:disable-line:no-string-literal
  }
}
