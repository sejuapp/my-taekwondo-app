import { InputStage, Match, MatchGame, Participant, Stage } from "brackets-model";

/**
 * Estructura de datos para crear el torneo
 */
export interface ITorneoCreateData {
  participants: any;
  stage: InputStage
}

/**
 * Estructura de datos para la respuesta al crear el torneo con la liberia brackets
 */
export interface ITorneoViewerData {
  viewerData: IViewerData | null;
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

export interface IGestionTorneoData {
  viewerData: IViewerData | null,
  dataCreate: ITorneoCreateData
}
