import axios from 'axios';

interface IQueryStringParam {
  name: string;
  value: string;
}

const buildUrl = (url: string, params: Array<IQueryStringParam>): string => {
  let urlWithQueryString = `${url}?`;
  const numOfParams = params.length;

  params.map((param, index) => {
    urlWithQueryString += `${param.name}=${param.value}${
      index === numOfParams - 1 ? '' : '&'
    }`;
  });

  return urlWithQueryString;
};

class ApiService {
  get<T>(url: string, params: Array<IQueryStringParam>) {
    return new Promise<T>((resolve, reject) => {
      axios
        .get(buildUrl(url, params))
        .then(response => {
          if (response.status < 200 || response.status > 299) {
            reject(`${response.status}: ${response.statusText}`);
          }

          resolve(response.data);
        })
        .catch(err => reject(err));
    });
  }

  post<T>(url: string, data: object) {}
}

export default ApiService;
