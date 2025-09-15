import { Id, Match } from "brackets-model";

export interface IItemBracketsSelect {
  match: Match;
  customOpponents : IOpponentBracketSelect[];
}


export interface IOpponentBracketSelect {
  id : Id | null | undefined;
  name : string;
}
