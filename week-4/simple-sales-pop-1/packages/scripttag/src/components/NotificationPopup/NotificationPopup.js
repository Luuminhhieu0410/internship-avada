import './NoticationPopup.scss';

const NotificationPopup = ({
  className = '',
  style = {},
  firstName = 'John Doe',
  city = 'New York',
  country = 'United States',
  productName = 'Puffer Jacket With Hidden Hood',
  relativeDate = 'a day ago',
  hideTimeAgo = false,
  slug = '',
  position = {
    top: '15px',
    left: '15px'
  },
  productImage = 'http://paris.mageplaza.com/images/shop/single/big-1.jpg'
}) => {
  return (
    <div className={`Avava-SP__Wrapper animated ${className}`} style={{...position, ...style}}>
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <a href={`/products/${slug}`} className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage})`
              }}
            />
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={'Avada-SP__Subtitle'}>
                purchased <span style={{fontWeight: '700'}}>{productName}</span>
              </div>
              <div className={'Avada-SP__Footer'}>
                {!hideTimeAgo && <span style={{color: 'red'}}> {relativeDate} </span>}
                <span className="uni-blue">
                  <i className="fa fa-check" aria-hidden="true" /> by Avada
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {};

export default NotificationPopup;
