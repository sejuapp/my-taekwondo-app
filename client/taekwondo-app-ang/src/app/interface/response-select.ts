import { ITorneoResponseData } from '@app/interface/torneo-data';
import { Match } from 'brackets-model';

export interface IResponseSelectMatch {
  torneoData: ITorneoResponseData;
  match: Match;
}
