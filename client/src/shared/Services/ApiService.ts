import { useEffect, useState } from "react";
import { Service } from "../Types/Service";

import axios from "axios";

class ApiService {
  get<T>(url: string) {
    const [result, setResult] = useState<Service<T>>({ status: "loading" });

    useEffect(() => {
      axios
        .get(url)
        .then(response =>
          setResult({ status: "loaded", payload: response.data })
        );
    }, []);

    return result;
  }

  post<T>(url: string, data: object) {}
}

export default ApiService;