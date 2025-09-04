import { Id, Match } from "brackets-model";

export interface IItemBracketsSelect {
  match: Match;
  opponent1 : IOpponentBracketSelect;
  opponent2 : IOpponentBracketSelect;
}


export interface IOpponentBracketSelect {
  id : Id | null | undefined;
  name : string;
}
