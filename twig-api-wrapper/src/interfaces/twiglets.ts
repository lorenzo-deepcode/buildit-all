import { ILatestCommit, ILink, INode } from "./shared";

export interface ITwigletCreation {
  name: string;
  description: string;
  model?: string;
  json?: string;
  cloneTwiglet?: string;
  commitMessage: string;
}

export interface ITwigletUpdate {
  name?: string;
  description?: string;
  commitMessage: string;
  nodes?: INode[];
  links?: ILink[];
}

export interface ITwigletListResponse {
  name: string;
  description: string;
  url: string;
}

export interface ITwigletResponse {
  nodes: INode[];
  links: ILink[];
  _rev: string;
  name: string;
  description: string;
  latestCommit: ILatestCommit;
  url: string;
  model_url: string;
  changelog_url: string;
  views_url: string;
  json_url: string;
  events_url: string;
  sequences_url: string;
}
