import DisplayManager from './managers/DisplayManager';
import ApiManager from './managers/ApiManager';

console.log('This is the script tag');

(async () => {
  const apiManager = new ApiManager();
  const displayManager = new DisplayManager();
  const {notifications, settings} = await apiManager.getNotifications();

  // console.log(JSON.stringify(notifications));
  // console.log(JSON.stringify(settings));
  displayManager.initialize({notifications, settings});
})();
('');
