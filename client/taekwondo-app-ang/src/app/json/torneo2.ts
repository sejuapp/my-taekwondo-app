import { IInfoTorneoCategoria } from '@app/interface/request/info-torneo-categoria';

export const dataTorneo2: IInfoTorneoCategoria = {
  stage: {
    name: ' ',
    type: 'single_elimination',
  },
  participants: [
    {
      persona: {
        id: 4,
        nombreCompleto: 'Juana Rojas Estupiñan',
        fechaNacimiento: '2013-09-10',
        peso: 22,
        cinturon: 'Negro',
        altura: 104,
        club: 'OBELIUS',
      },
      bracket: {
        id: 4,
        name: 'Juana Rojas',
      },
    },
    {
      persona: {
        id: 5,
        nombreCompleto: 'Victoria Fonseca Rojas',
        fechaNacimiento: '2013-09-10',
        peso: 25,
        cinturon: 'Blanco',
        altura: 110,
        club: 'OBELIUS',
      },
      bracket: {
        id: 5,
        name: 'Victoria Fonseca',
      },
    },
    {
      persona: {
        id: 6,
        nombreCompleto: 'Angela Montenegro',
        fechaNacimiento: '2013-09-10',
        peso: 25,
        cinturon: 'Rojo',
        altura: 110,
        club: 'OBELIUS',
      },
      bracket: {
        id: 6,
        name: 'Angela Montenegro',
      },
    },
  ],
};
