import {Button, Card, Text} from '@shopify/polaris';
import useFetchApi from '@assets/hooks/api/useFetchApi';

const HomeCustome = () => {
  const {data: status, loading} = useFetchApi({url: '/theme/status', defaultData: {}});

  const onClick = () => {
    window.open(
      `https://admin.shopify.com/admin/themes/current/editor?context=apps&&activateAppId=aa900bb4723df09562d08d0cd605a7ce/star_rating`
    );
  };
  return (
    <div>
      {/* {data.message} */}
      <div style={{height: '76px', display: 'flex', alignItems: 'center'}}>
        <h1 style={{fontWeight: '500', fontSize: '16px'}}>Home</h1>
      </div>
      <Card>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text as="h2" variant="bodyMd">
            App status is{' '}
            <span
              style={{
                fontWeight: '700',
                color: `${loading ? 'black' : status.disabled ? 'red' : 'green'}`
              }}
            >
              {loading ? 'loading...' : status.disabled ? 'Disable' : 'Enable'}
            </span>
          </Text>
          <Button
            loading={loading}
            size={'large'}
            variant={!status.disabled ? 'primary' : 'secondary'}
            tone={!status.disabled && 'critical'}
            onClick={onClick}
          >
            {status.disabled ? 'Enable' : 'Disable'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomeCustome;
