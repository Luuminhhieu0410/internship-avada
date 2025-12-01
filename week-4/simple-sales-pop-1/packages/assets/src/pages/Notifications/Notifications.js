import {useEffect, useMemo, useState, useCallback} from 'react';
import {
  Card,
  Text,
  Banner,
  Button,
  Box,
  ResourceItem,
  ResourceList,
  Modal,
  LegacyStack,
  TextContainer,
  Select
} from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import useFetchApi from '../../hooks/api/useFetchApi';
import moment from 'moment';
import useDeleteApi from '../../hooks/api/useDeleteApi';
import useEditApi from '@assets/hooks/api/useEditApi';

const Notifications = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [pageSize, setPageSize] = useState(3);
  const [sortValue, setSortValue] = useState('desc');
  const [startCursor, setStartCursor] = useState(null); // startCursor , endCursor có thể thay bằng chỉ dùng state pageInfo của useFetchApi không
  const [endCursor, setEndCursor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveModalDeleleNotification, setIsActiveModalDeleteNotification] = useState(false);

  const {
    data: notifications, // Array<Notification>
    fetchApi,
    setData: setNotifications,
    loading,
    pageInfo // Object<{endCursor,hasNextPage,hasPrevPage,pageSize ,startCursor,totalNotifications,totalPages}>
  } = useFetchApi({
    url: '/notifications',
    defaultData: [],
    initLoad: true,
    initQueries: {limit: pageSize, sortBy: sortValue}
  });
  const successCallback = data => {
    console.log('>>>>', data);
    setNotifications(pre => pre.filter(notification => !data.data.includes(notification.id)));
  };
  const {deleting, handleDelete} = useDeleteApi({
    url: '/notifications',
    fullResp: true,
    successCallback: successCallback
  });
  const {editing, handleEdit} = useEditApi({url: '/notifications', fullResp: true});

  const optionsSelectPageSize = [
    // {label: '1', value: 1}, // nếu để giá trị 1 thì endCursor và startCursor không hoạt động
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '5', value: 5},
    {label: '10', value: 10},
    {label: '50', value: 50}
  ];
  const [startRecord, endRecord] = useMemo(() => {
    if (notifications || pageInfo) {
      return [
        (currentPage - 1) * pageSize + 1,
        Math.min(currentPage * pageSize, pageInfo.totalNotifications)
      ];
    }
    return [0, 0];
  }, [notifications, pageInfo]);
  // khi sort thay đổi, fetch lại trang đầu
  useEffect(() => {
    // lấy data trang đầu tiên
    fetchApi(null, {limit: pageSize, sortBy: sortValue});
    setStartCursor(null);
    setEndCursor(null);
    setCurrentPage(1);
  }, [sortValue]);
  // cập nhật cursors khi notifications thay đổi
  useEffect(() => {
    if (notifications.length > 0) {
      setStartCursor(notifications[0].id);
      setEndCursor(notifications[notifications.length - 1].id);
    }
    // console.log("+++" , notifications);
  }, [notifications]);
  // reset select notifications khi chuyển trang
  useEffect(() => {
    setSelectedItems([]);
  }, [currentPage]);
  useEffect(() => {
    // lấy data trang đầu tiên
    setCurrentPage(1);
    fetchApi(null, {limit: pageSize, sortBy: sortValue});
  }, [pageSize]);
  const handleNextPage = async () => {
    if (!pageInfo.hasNextPage) return;
    await fetchApi(null, {limit: pageSize, endCursor, sortBy: sortValue});
    setCurrentPage(pre => pre + 1);
  };

  const handlePrevPage = async () => {
    if (!pageInfo.hasPrevPage) return;
    await fetchApi(null, {
      limit: pageSize,
      startCursor,
      sortBy: sortValue
    });
    setCurrentPage(pre => pre - 1);
  };

  const handleDeleteInModal = async () => {
    setIsActiveModalDeleteNotification(false);
    await handleDelete({data: {listNotificationId: selectedItems}});
    await fetchApi(null, {limit: pageSize, endCursor, sortBy: sortValue});
  };
  const handleSyncManually = async () => {
    await handleEdit({});
    fetchApi(null, {limit: pageSize, sortBy: sortValue});
  };
  const handleSelectChangePageSize = useCallback(value => setPageSize(Number(value)), []);

  const resourceName = {
    singular: 'notification',
    plural: 'notifications'
  };

  const promotedBulkActions = [
    {
      content: 'Delete',
      onAction: () => setIsActiveModalDeleteNotification(true)
    }
  ];
  const toggleModal = useCallback(() => setIsActiveModalDeleteNotification(active => !active), []);
  const cancelHandle = useCallback(() => setIsActiveModalDeleteNotification(false), []);
  return (
    <div style={{margin: 'auto', maxWidth: '950px', padding: '20px 0'}}>
      <Modal
        open={isActiveModalDeleleNotification}
        onClose={toggleModal}
        title="Remove selected notification(s)?"
        primaryAction={{
          destructive: true,
          content: 'Delete',
          onAction: handleDeleteInModal
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: cancelHandle
          }
        ]}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              <TextContainer>
                <p>This action cannot be undone.</p>
              </TextContainer>
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Text variant="headingLg" as="h5">
          Notification: New sales pops
        </Text>
        <Button plain>Import</Button>
      </div>

      <Text variant="bodyMd" color="subdued">
        List of available notifications related to campaign.
      </Text>

      <Box paddingBlockStart="400">
        <Banner title="If orders are not up to date" status="info">
          <p>
            We only keep maximum amount of 30 purchase notifications synchronized from your store.
            If you find your orders are not up to date, try synchronizing it again.
          </p>
          <Box paddingBlockStart="200">
            <Button
              onClick={handleSyncManually}
              loading={editing}
              disabled={loading || deleting}
              primary
            >
              Sync manually
            </Button>
          </Box>
        </Banner>
      </Box>

      <div style={{height: '20px'}}></div>
      <div style={{maxWidth: '150px'}}>
        <Select
          disabled={loading || deleting || editing}
          label="Notifications per page "
          options={optionsSelectPageSize}
          onChange={handleSelectChangePageSize}
          value={pageSize}
        />
      </div>
      <div style={{height: '20px'}}></div>

      <Box>
        <Card padding="0">
          <ResourceList
            loading={loading || deleting || editing}
            resourceName={resourceName}
            items={notifications}
            sortValue={sortValue}
            sortOptions={[
              {label: 'Newest update', value: 'desc'},
              {label: 'Oldest update', value: 'asc'}
            ]}
            // headerContent={"abc"}
            onSortChange={newSort => setSortValue(newSort)}
            promotedBulkActions={promotedBulkActions}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            pagination={{
              label: <span>{`Pages ${currentPage}/${pageInfo.totalPages || ''}`}</span>,
              hasNext: pageInfo.hasNextPage,
              hasPrevious: pageInfo.hasPrevPage,
              onNext: handleNextPage,
              onPrevious: handlePrevPage
            }}
            renderItem={item => {
              const m = moment(item.timestamp);
              return (
                <ResourceItem id={item.id}>
                  <NotificationPopup
                    firstName={item.firstName}
                    city={item.city}
                    country={item.country}
                    productName={item.productName}
                    productImage={item.productImage}
                    timestamp={m.fromNow()}
                  />
                </ResourceItem>
              );
            }}
          />
          {!loading && (
            <div style={{textAlign: 'center'}}>
              <Text variant="headingSm" as="h6" color="subdued">
                Hiển thị {startRecord}-{endRecord} trong tổng số {pageInfo.totalNotifications}{' '}
                notification
              </Text>
            </div>
          )}
        </Card>
      </Box>
    </div>
  );
};

export default Notifications;
