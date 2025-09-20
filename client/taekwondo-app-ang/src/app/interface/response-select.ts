import { Match } from 'brackets-model';

export interface IResponseSelectMatch {
  match: Match;
  coordinates: ICoordinates
}

export interface ICoordinates {
  x: number;
  y: number;
}
