export interface ILatestCommit {
  message: string;
  user: string;
  timestamp: string;
  doReplacement?: boolean;
}

export interface IAttribute {
  key: string;
  value?: string;
}

export interface ILink {
  attrs?: IAttribute[];
  association?: string;
  id: string;
  source: string;
  target: string;
  _color?: string;
  _size?: number;
}

export interface INode {
  attrs?: IAttribute[];
  id: string;
  location?: string;
  name: string;
  type: string;
  x?: number;
  y?: number;
  _color?: string;
  _size?: string;
}
