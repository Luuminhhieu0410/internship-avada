import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Banner,
  Box,
  Button,
  Card,
  Checkbox,
  DataTable,
  DropZone,
  EmptyState,
  Icon,
  LegacyCard,
  LegacyStack,
  Link,
  Modal,
  ResourceItem,
  ResourceList,
  Select,
  SkeletonBodyText,
  Text,
  TextContainer
} from '@shopify/polaris';
import {ArrowDownIcon} from '@shopify/polaris-icons';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import useFetchApi from '../../hooks/api/useFetchApi';
import moment from 'moment';
import useDeleteApi from '../../hooks/api/useDeleteApi';
import useEditApi from '@assets/hooks/api/useEditApi';
import {csvDataFileToObject, validateCSVHeaders} from '@assets/utils/Papaparse';

const Notifications = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [pageSize, setPageSize] = useState(3);
  const [sortValue, setSortValue] = useState('desc');
  const [startCursor, setStartCursor] = useState(null); // startCursor , endCursor có thể thay bằng chỉ dùng state pageInfo của useFetchApi không
  const [endCursor, setEndCursor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveModalDeleleNotification, setIsActiveModalDeleteNotification] = useState(false);
  const [isActiveModalImportFile, setIsActiveModalImportFile] = useState(false);
  const [checkBoxReplaceValue, setCheckBoxReplaceValue] = useState(false);
  const [uploadedCsvFiles, setUploadedCsvFiles] = useState([]);
  const [rejectedCsvFiles, setRejectedCsvFiles] = useState([]);
  const [errorMessageCsvUploaded, setErrorMessageCsvUploaded] = useState('');
  const [loadingUploaded, setLoadingUploaded] = useState(false);
  const [notificationsFromAllFiles, setNotificationsFromAllFiles] = useState([]);
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
  const {editing: loadingSendDataFile, handleEdit: sendRequestDataFile} = useEditApi({
    url: '/notifications/import',
    fullResp: true
  });
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
  useEffect(() => {
    if (rejectedCsvFiles.length != 0) {
      // console.log('error ', rejectedCsvFiles);
      setErrorMessageCsvUploaded(`${rejectedCsvFiles[0].name} is not valid`);
    }
  }, [rejectedCsvFiles]);
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
    setSelectedItems([]);
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
  const toggleDeleteNotificationModal = useCallback(
    () => setIsActiveModalDeleteNotification(active => !active),
    []
  );
  const closeDeleteNotificationModal = useCallback(
    () => setIsActiveModalDeleteNotification(false),
    []
  );
  const toggleImportFileModal = useCallback(() => {
    setIsActiveModalImportFile(active => !active);
  }, []);

  const onClickDeleteFile = index => {
    console.log('onClick', index);
    setUploadedCsvFiles(files => files.filter((_, i) => i !== index));
  };

  const closeImportFileModal = useCallback(() => setIsActiveModalImportFile(false), []);

  const handleDropZoneDrop = useCallback(async (_dropFiles, acceptedFiles, _rejectedFiles) => {
    setLoadingUploaded(true);
    let convertFiles = [];
    const allNotificationsInFiles = [];
    for (let i = 0; i < acceptedFiles.length; i++) {
      const ArrayObjectCsv = await csvDataFileToObject(acceptedFiles[i]);
      const checkValidFormat = validateCSVHeaders(
        ['firstName', 'productName', 'slug', 'productImage', 'date', 'city', 'country'],
        ArrayObjectCsv
      );

      convertFiles.push({
        // dung de hien thi cho rows table
        file: acceptedFiles[i],
        time: new Date(Date.now()),
        notifi: checkValidFormat ? ArrayObjectCsv : []
      });
      if (checkValidFormat) {
        console.log('>>>', ArrayObjectCsv);
        allNotificationsInFiles.push(ArrayObjectCsv);
      }
    }
    // allNotificationsInFiles đang la array 2 chieu
    setNotificationsFromAllFiles(old => [...old, allNotificationsInFiles]); // array 3 chieu
    setUploadedCsvFiles(files => [...files, ...convertFiles]);
    setRejectedCsvFiles(_rejectedFiles);
    setLoadingUploaded(false);
  }, []);

  // const customValidator = useCallback(file => {
  //   const under25MB = file.size < 25 * 1024 * 1024;
  //
  //   return under25MB;
  // }, []);
  const handleSendImportData = async () => {
    // console.log('origin ', notificationsFromAllFiles);
    // console.log('origin -> flat() ', notificationsFromAllFiles.flat().flat());
    await sendRequestDataFile({
      notifications: notificationsFromAllFiles.flat().flat(),
      replace: checkBoxReplaceValue
    });
    await fetchApi(null, {limit: pageSize, endCursor, sortBy: sortValue});
    setIsActiveModalImportFile(false);
    setUploadedCsvFiles([]);
  };
  const rowsListFile = useMemo(() => {
    if (uploadedCsvFiles.length != 0) {
      return uploadedCsvFiles.map((data, index) => {
        // console.log('uploadedCsvFile', file);
        return [
          data.file.name,
          data.notifi.length != 0 ? (
            `${data.notifi.length}  notifications`
          ) : (
            <span style={{color: 'red'}}>Error</span>
          ),
          data.time.toLocaleString(),
          <Button onClick={() => onClickDeleteFile(index)}>x</Button>
        ];
      });
    }
  }, [uploadedCsvFiles]);
  const emptyState = (
    <LegacyCard sectioned>
      <EmptyState
        heading="No notifications found"
        image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
      >
        <p>Try changing the filters or search term</p>
      </EmptyState>
    </LegacyCard>
  );
  return (
    <div style={{margin: 'auto', maxWidth: '950px', padding: '20px 0'}}>
      <Modal
        open={isActiveModalDeleleNotification}
        onClose={toggleDeleteNotificationModal}
        title="Remove selected notification(s)?"
        primaryAction={{
          destructive: true,
          content: 'Delete',
          onAction: handleDeleteInModal
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: closeDeleteNotificationModal
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
      <Modal
        open={isActiveModalImportFile}
        onClose={toggleImportFileModal}
        title="Import Notifcations by CSV"
        primaryAction={{
          loading: loadingSendDataFile,
          disabled: loadingSendDataFile || uploadedCsvFiles?.length == 0,
          content: 'Import',
          onAction: handleSendImportData
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: closeImportFileModal
          }
        ]}
      >
        <Modal.Section>
          <LegacyStack vertical>
            {!!errorMessageCsvUploaded && (
              <div style={{color: 'red'}}>{errorMessageCsvUploaded}</div>
            )}
            <DropZone
              disabled={loadingUploaded}
              accept=".csv"
              allowMultiple={true}
              errorOverlayText="File type must be .csv"
              type="file"
              onDrop={handleDropZoneDrop}
              // customValidator={customValidator}
            >
              <DropZone.FileUpload actionHint={'Accepts .csv (maximum size is 25MB)'} />
            </DropZone>
            <Link external={true} url="http://localhost:5000/test/Sales_Pop_sample.csv">
              Download example csv file
            </Link>
            <Checkbox
              checked={checkBoxReplaceValue}
              label="Replace the entire list with the CSV content"
              onChange={() => {
                setCheckBoxReplaceValue(active => !active);
              }}
            />

            {loadingUploaded ? (
              <SkeletonBodyText />
            ) : uploadedCsvFiles.length > 0 ? (
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text']}
                headings={['Name', 'Notifications', 'Date', '']}
                rows={rowsListFile}
              />
            ) : null}
          </LegacyStack>
        </Modal.Section>
      </Modal>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Text variant="headingLg" as="h5">
          Notification: New sales pops
        </Text>
        <Button plain onClick={() => toggleImportFileModal()}>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Icon source={ArrowDownIcon} tone="base" /> Import
          </div>
        </Button>
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
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div style={{maxWidth: '150px'}}>
          <Select
            disabled={loading || deleting || editing || notifications.length <= 0}
            label="Notifications per page "
            options={optionsSelectPageSize}
            onChange={handleSelectChangePageSize}
            value={pageSize}
          />
        </div>
      </div>
      <div style={{height: '20px'}}></div>

      <Box>
        <Card padding="0">
          <ResourceList
            emptyState={emptyState}
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
            {...(notifications.length > 0 && {
              pagination: {
                label: <span>{`Pages ${currentPage}/${pageInfo.totalPages || ''}`}</span>,
                hasNext: pageInfo.hasNextPage,
                hasPrevious: pageInfo.hasPrevPage,
                onNext: handleNextPage,
                onPrevious: handlePrevPage
              }
            })}
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

          {!loading && notifications.length > 0 && (
            <div style={{textAlign: 'center'}}>
              <Text variant="headingSm" as="h6" color="subdued">
                Showing {startRecord}-{endRecord} of a total of {pageInfo.totalNotifications}{' '}
                notifications
              </Text>
            </div>
          )}
        </Card>
      </Box>
    </div>
  );
};

export default Notifications;
