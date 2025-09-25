import { StageType } from "brackets-model";

export interface IInfoTorneoCategoria {
  stage: IStageCategoria;
  participants: IParticipantCategoria[];
}

export interface IStageCategoria {
  tournamentId: string;
  name: string; // Si no tiene información debe ser cadena con espacio en blanco ' '.
  type: StageType; // si siempre será "single_elimination" puedes tiparlo como literal: "single_elimination"
}

export interface IParticipantCategoria {
  persona: IPersonaCategoria;
  bracket: IBracketCategoria;
}

export interface IPersonaCategoria {
  id: number
  nombreCompleto: string;
  fechaNacimiento: string; // se puede cambiar a Date si lo vas a parsear
  peso: number;
  cinturon: string;
  altura: number;
  club: string | null;
}

export interface IBracketCategoria {
  id: number;
  name: string;
}
