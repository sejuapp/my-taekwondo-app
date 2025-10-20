export class TimeUtils {
  /**
   * Convierte minutos a segundos.
   * @param minutes - Tiempo en minutos
   * @returns Tiempo equivalente en segundos
   */
  static toSeconds(minutes: number): number {
    return minutes * 60;
  }

  /**
   * Convierte minutos a milisegundos.
   * @param minutes - Tiempo en minutos
   * @returns Tiempo equivalente en milisegundos
   */
  static toMilliseconds(minutes: number): number {
    return minutes * 60 * 1000;
  }
}
