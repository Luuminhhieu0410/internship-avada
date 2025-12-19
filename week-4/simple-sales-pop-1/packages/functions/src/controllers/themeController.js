import {getDataFileTheme} from '@functions/services/shopifyService';
import {getCurrentShopData} from '@functions/helpers/auth';

export async function getStatusAppThemeExtension(ctx) {
  try {
    const shopData = getCurrentShopData(ctx);
    const settingsDataJson = await getDataFileTheme(shopData);
    const blocks = settingsDataJson.current.blocks;

    const appBlock = Object.values(blocks).find(block =>
      block.type?.includes('shopify://apps/sale-pop-up')
    );

    const disabled = appBlock?.disabled ?? true;

    ctx.body = {
      data: {disabled},
      success: true
    };
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = {message: e.message || 'Internal Server Error'};
  }
}
