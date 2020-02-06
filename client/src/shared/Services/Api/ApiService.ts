import axios, { AxiosResponse } from 'axios';

/**
 * Processes the response of an HTTP request.
 * @param response The HTTP response.
 * @param reject Rejects a promise with a provided reason.
 * @param resolve Resolves a promise with corresponding data.
 */
function processResponse(
  response: AxiosResponse,
  reject: (reason?: any) => void,
  resolve: (reason?: any) => void
) {
  if (response.status < 200 || response.status > 299) {
    reject(`${response.status}: ${response.statusText}`);
  }

  resolve(response.data);
}

/**
 * Service that wraps Axios-based HTTP call methods. This class
 * should be used vs. explicit Axios calls in order to ensure
 * uniformity in the way in which a request structure
 * (e.g. Headers) is built.
 */
export default class ApiService {
  /**
   * Performs an asynchronous HTTP GET.
   * @param url The target URL.
   * @param params The query string parameters to include in the request.
   */
  static get<T>(url: string, params?: object) {
    return new Promise<T>((resolve, reject) => {
      axios
        .get(url, {
          method: 'GET',
          params
        })
        .then(response => processResponse(response, reject, resolve))
        .catch(err => reject(err));
    });
  }

  /**
   * Performs an asynchronous HTTP POST.
   * @param url The target URL.
   * @param data The data to include in the body of the request.
   */
  static post<T>(url: string, data: object) {
    return new Promise<T>((resolve, reject) => {
      axios
        .post(url, data, {
          method: 'POST'
        })
        .then(response => processResponse(response, reject, resolve))
        .catch(err => reject(err));
    });
  }

  /**
   * Performs an asynchronous HTTP PUT.
   * @param url The target URL.
   * @param data The data to include in the body of the request.
   */
  static put<T>(url: string, data: object) {
    return new Promise<T>((resolve, reject) => {
      axios
        .put(url, data, {
          method: 'PUT'
        })
        .then(response => processResponse(response, reject, resolve))
        .catch(err => reject(err));
    });
  }

  /**
   * Performs an asynchronous HTTP DELETE.
   * @param url The target URL.
   * @param params The query string parameters to include in the request.
   */
  static delete<T>(url: string, params: object) {
    return new Promise<T>((resolve, reject) => {
      axios
        .delete(url, {
          method: 'DELETE',
          params
        })
        .then(response => processResponse(response, reject, resolve))
        .catch(err => reject(err));
    });
  }
}
