import { ILatestCommit } from "./shared";

export interface IEntity {
  class: string;
  color?: string;
  image: string;
  size?: number;
  type?: string;
  attributes: IEntityAttribute[];
}

export interface IEntityAttribute {
  name: string;
  dataType: string;
  required: boolean;
}

export interface IModelCreation {
  name: string;
  commitMessage: string;
  entities: { [key: string]: IEntity };
}

export interface IModelUpdate {
  name?: string;
  commitMessage: string;
  entities?: { [key: string]: IEntity };
}

export interface IModelListResponse {
  name: string;
  url: string;
}

export interface IModelResponse {
  entities: { [key: string]: IEntity };
  name: string;
  _rev: string;
  latestCommit: ILatestCommit;
  url: string;
  changelog_url: string;
}
