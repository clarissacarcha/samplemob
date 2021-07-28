import axios from 'axios';

export class AxiosUtility {
  static get = async ({url, params}) => {
    try {
      let responseData = null;
      let responseError = null;
      await axios
        .get(url, {params: params}) // Get uses "params" in optional parameters
        .then((response) => {
          responseData = response.data;
        })
        .catch((error) => {
          responseError = error.response.data;
        });

      return {
        responseData,
        responseError,
      };
    } catch (error) {
      throw error;
    }
  };

  static post = async ({url, param}) => {
    try {
      let responseData = null;
      let responseError = null;

      await axios
        .post(url, param)
        .then((response) => {
          responseData = response.data;
        })
        .catch((error) => {
          responseError = error.response.data;
        });

      return {
        responseData,
        responseError,
      };
    } catch (error) {
      throw error;
    }
  };
}
