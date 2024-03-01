export interface StorageService {
  /**
   * 파일을 지정한 경로에 저장하고 저장된 파일이름을 포함한 전체 경로를 반환합니다.
   *
   * @param {Express.Multer.File} file - 저장할 파일
   * @param {string} src - 파일을 저장할 경로
   * @returns {Promise<{src: string}>} 파일이 저장된 경로
   */
  uploadObject(file: Express.Multer.File, src: string): Promise<{ src: string }>

  /**
   * 해당 URI에 있는 파일을 삭제하고 삭제 결과를 반환합니다.
   *
   * @param {string} src - 삭제할 파일이 위치한 경로
   * @returns {Promise<{result: string}>} 파일 삭제 결과
   */
  deleteObject(src: string): Promise<{ result: string }>
}

export interface ImageStorageService extends StorageService {}
