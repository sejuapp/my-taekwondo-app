import { BracketsManager } from "brackets-manager";
import { Match, MatchGame, Participant, Stage } from "brackets-model";

/**
 * Estructura de datos para crear el torneo
 */
export interface ITorneoCreateData {

}

export interface ITorneoResponseData {
  viewerData: IViewerData;
}

/**
 * Estructura de datos para la visulización del torneo
 */
export interface IViewerData {
  stages: Stage[],
  matches: Match[],
  matchGames: MatchGame[],
  participants: Participant[],
}
