import makeRequest from '../helpers/api/makeRequest';
import {URL_SERVER} from '../constants/constants';

export default class ApiManager {
  getNotificationsAndSettingsShop = async () => {
    return this.getApiData();
  };

  getApiData = async () => {
    const shopifyDomain = window.Shopify.shop;
    const {notifications, settings} = await makeRequest(`${URL_SERVER}/clientApi/${shopifyDomain}`);

    return {notifications, settings};
  };
}
