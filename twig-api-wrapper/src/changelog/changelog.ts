import { merge, pick } from "ramda";
import * as rp from "request-promise-native";
import { Observable } from "rxjs/Observable";
import { IChangelog } from "../interfaces";
import { rpOptions } from "../rpOptions";

export class Changelog {

  constructor(private url: string) {}

  /**
   * Gets all of the changelog for a twiglet.
   *
   * @returns {Promise<IChangelog[]>} Promise containing the changelogs
   * @memberof Changelog
   */
  public getList(): Promise<IChangelog[]> {
    return rp(rpOptions("GET", this.url))
    .then((object: { changelog: IChangelog[] }) => object.changelog);
  }

  private updateUrl(url: string) {
    this.url = url;
  }
}
