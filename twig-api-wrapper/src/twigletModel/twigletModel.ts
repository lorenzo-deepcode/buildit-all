import { merge, pick } from "ramda";
import * as rp from "request-promise-native";
import { rpOptions } from "../rpOptions";

export class TwigletModel {
  constructor(private twigletModelUrl: string) { }

  /**
   * Gets the twiglet's instance of the model.
   * @returns {Promise<{ [key: string]: {
   *         class: string;
   *         color?: string;
   *         image: string;
   *         size?: number;
   *         type?: string;
   *         attributes: Array<{
   *           name: string;
   *           dataType: string;
   *           required: boolean;
   *         }>
   *       } }>}
   * @memberof TwigletModel
   */
  public get(): Promise<{ [key: string]: {
        class: string;
        color?: string;
        image: string;
        size?: number;
        type?: string;
        attributes: Array<{
          name: string;
          dataType: string;
          required: boolean;
        }>
      } }> {
    return rp(rpOptions("GET", this.twigletModelUrl))
    .then((model) => model.entities);
  }

  /**
   * Updates the twiglet's instance of the model.
   *
   * @param {{ entities: { [key: string]: {
   *         class: string;
   *         color?: string;
   *         image: string;
   *         size?: number;
   *         type?: string;
   *         attributes: Array<{
   *           name: string;
   *           dataType: string;
   *           required: boolean;
   *         }>
   *       } }, commitMessage: string }} body
   * @returns {Promise<{ [key: string]: {
   *         class: string;
   *         color?: string;
   *         image: string;
   *         size?: number;
   *         type?: string;
   *         attributes: Array<{
   *           name: string;
   *           dataType: string;
   *           required: boolean;
   *         }>
   *       } }>}
   * @memberof TwigletModel
   */
  public update(body: { entities: { [key: string]: {
        class: string;
        color?: string;
        image: string;
        size?: number;
        type?: string;
        attributes: Array<{
          name: string;
          dataType: string;
          required: boolean;
        }>
      } }, commitMessage: string })
      : Promise<{ [key: string]: {
        class: string;
        color?: string;
        image: string;
        size?: number;
        type?: string;
        attributes: Array<{
          name: string;
          dataType: string;
          required: boolean;
        }>
      } }> {
    return rp(rpOptions("GET", this.twigletModelUrl))
    .then((model) => rp(rpOptions("PUT", this.twigletModelUrl, merge(pick(["_rev"], model), body))));
  }

  private updateUrl(url: string) {
    this.twigletModelUrl = url;
  }
}
