import {getCurrentShopData} from '../helpers/auth';
import {
  getSettingsByShopId,
  updateSettingsByShopId
} from '@functions/repositories/settingsRepository';

export async function getSetting(ctx) {
  try {
    const shop = getCurrentShopData(ctx);
    // console.log(">>>> shop data in settingsController.js: ", shop);
    const settings = await getSettingsByShopId(shop.id);
    ctx.status = 200;
    ctx.body = {success: true, data: settings};
  } catch (e) {
    console.error(e);
    ctx.status = 500;
    ctx.body = {shop: null, settings: null, success: false};
  }
}

export async function updateSetting(ctx) {
  try {
    const shop = getCurrentShopData(ctx);
    const {newSettings} = ctx.req.body;
    // console.log(">>>> new settings in settingsController.js: ", newSettings);

    const updatedSettings = await updateSettingsByShopId(shop.id, newSettings);
    ctx.status = 200;
    ctx.body = {success: true, data: updatedSettings};
  } catch (e) {
    console.error(e);
    ctx.status = 500;
    ctx.body = {shop: null, settings: null, success: false};
  }
}
