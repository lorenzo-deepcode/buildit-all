import { ILink, INode } from "./shared";

export interface IEventListResponse {
  description: string;
  id: string;
  name: string;
  url: string;
}

export interface IEventResponse extends IEventListResponse {
  links: ILink[];
  nodes: INode[];
}
