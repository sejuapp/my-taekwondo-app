import { IdOpponent } from '@app/type/type-brackets';

export interface IResponseSelectMatch {
  viewerBracketId : string;
  idMatch: number;
  idOpponent: IdOpponent;
  coordinates: ICoordinates,
}

export interface ICoordinates {
  x: number;
  y: number;
}
