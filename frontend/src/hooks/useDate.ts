import moment, { type Moment } from 'moment'

type UTCDateString = string

export const useDate = () => {
  /**
   * UTC Date String을 Moment 객체로 변환합니다.
   * @param {UTCDateString} dateString - UTC Date String
   * @returns {Moment} Moment 객체
   */
  const parseUTCDate = (dateString: UTCDateString): Moment => {
    return moment.utc(dateString).local()
  }

  /**
   * 주어진 문자열이 유효한 UTC Date String인지 검증합니다.
   * @param {string} dateString - 검증할 문자열
   * @returns {boolean} 유효 여부
   */
  const isValidUTCDateString = (
    dateString: string
  ): dateString is UTCDateString => {
    return moment(dateString, moment.ISO_8601, true).isValid()
  }

  /**
   * 로컬 시간대를 기준으로 특정 날짜를 생성합니다.
   * @param {string} dateString - 날짜 문자열 ("YYYY-MM-DD" 형식)
   * @returns {Moment} 생성된 Moment 객체
   */
  const createLocalDate = (dateString: string): Moment => {
    return moment(dateString)
  }

  /**
   * 로컬 시간대를 기준으로 특정 날짜 및 시간을 생성합니다.
   * @param {string} dateTimeString - 날짜 및 시간 문자열 ("YYYY-MM-DDTHH:mm:ss" 형식)
   * @returns {Moment} 생성된 Moment 객체
   */
  const createLocalDateTime = (dateTimeString: string): Moment => {
    return moment(dateTimeString)
  }

  /**
   * UTC 시간대를 기준으로 특정 날짜를 생성합니다.
   * @param {string} dateTimeString - 날짜 및 시간 문자열 ("YYYY-MM-DDTHH:mm:ss" 형식)
   * @returns {Moment} 생성된 Moment 객체
   */
  const createUTCDate = (dateTimeString: string): Moment => {
    return moment.utc(dateTimeString)
  }

  /**
   * Moment 객체를 사용자가 지정한 형식의 문자열로 변환합니다.
   * @param {Moment} momentObj - 변환할 Moment 객체
   * @param {string} format - 날짜 형식 문자열 (예: "YYYY-MM-DD HH:mm:ss")
   * @returns {string} 변환된 문자열
   */
  const formatDate = (momentObj: Moment, format: string): string => {
    return momentObj.format(format)
  }

  /**
   * Moment 객체를 UTC 시간 문자열로 변환합니다.
   * @param {Moment} momentObj - 변환할 Moment 객체
   * @returns {string} UTC 시간 문자열
   */
  const toUTCString = (momentObj: Moment): string => {
    return momentObj.utc().toISOString()
  }

  return {
    parseUTCDate,
    isValidUTCDateString,
    createLocalDate,
    createLocalDateTime,
    createUTCDate,
    formatDate,
    toUTCString
  }
}
