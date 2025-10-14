import { IInfoTorneoCategoria } from '@app/interface/request/info-torneo-categoria';

export const dataTorneo: IInfoTorneoCategoria = {
  stage: {
    name: ' ',
    type: 'single_elimination',
  },
  participants: [
    {
      persona: {
        id: 1,
        nombreCompleto: 'Sebastian Alejandro Gonzalez Montenegro',
        fechaNacimiento: '2013-10-25',
        peso: 22,
        cinturon: 'Verde',
        altura: 101,
        club : 'OBELIUS'
      },
      bracket: {
        id: 1,
        name: 'Sebastian Gonzalez',
      },
    },
    {
      persona: {
        id: 2,
        nombreCompleto: 'Julian David Gonzalez Montenegro',
        fechaNacimiento: '2018-10-25',
        peso: 18,
        cinturon: 'Amarillo',
        altura: 102,
        club : 'OBELIUS'
      },
      bracket: {
        id: 2,
        name: 'Julian Gonzalez',
      },
    },
    {
      persona: {
        id: 3,
        nombreCompleto: 'Ivan David Gonzalez Agulo',
        fechaNacimiento: '1988-10-25',
        peso: 99,
        cinturon: 'Azul',
        altura: 110,
        club : 'OBELIUS'
      },
      bracket: {
        id: 3,
        name: 'Ivan Gonzalez',
      },
    },
    {
      persona: {
        id: 4,
        nombreCompleto: 'Juan Carlos Rojas Estupiñan',
        fechaNacimiento: '2013-09-10',
        peso: 22,
        cinturon: 'Amarillo',
        altura: 104,
        club : 'OBELIUS'
      },
      bracket: {
        id: 4,
        name: 'Juan Rojas',
      },
    },
    {
      persona: {
        id: 5,
        nombreCompleto: 'Victor Felipe Fonseca Rojas',
        fechaNacimiento: '2013-09-10',
        peso: 25,
        cinturon: 'Blanco',
        altura: 110,
        club : 'OBELIUS'
      },
      bracket: {
        id: 5,
        name: 'Victor Fonseca',
      },
    },
  ],
};
