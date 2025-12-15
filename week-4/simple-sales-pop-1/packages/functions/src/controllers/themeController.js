import {getDataFileTheme} from '@functions/services/shopifyService';
import {getCurrentShopData} from '@functions/helpers/auth';

export async function getStatusAppThemeExtension(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const settingsDataJson = await getDataFileTheme(shopData);

    ctx.body = {
      data: {disabled: settingsDataJson.current.blocks['1497180459541197238'].disabled},
      success: true
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {message: e.message || 'Internal Server Error'};
  }
}
