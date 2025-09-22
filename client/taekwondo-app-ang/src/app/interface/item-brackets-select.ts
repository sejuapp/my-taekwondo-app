import { AccionCompetidorEnum } from "@app/shared/enum/accion-competidor.enum";
import { IdOpponent } from "@app/type/type-brackets";
import { Match, Result } from "brackets-model";

export interface IItemBracketsSelect {
  match: Match;
  customOpponents: IOpponentBracketSelect[];
}

export interface IOpponentBracketSelect {
  match : IMatchBracketSelect;
  participant : any; //Es el item de la lista que viene de la bd
}

export interface IOpcionSeleccionar  {
  accion : AccionCompetidorEnum;
  idOpponent : IdOpponent;
}

export interface IMatchBracketSelect {
  id: IdOpponent;
  name: string;
  result: Result | null;
}
