import Papa from 'papaparse';

export function csvDataFileToObject(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: result => {
        resolve(result.data);
      },
      error: error => {
        reject(error);
      }
    });
  });
}

export function validateCSVHeaders(expectedHeaders, ArrayObjectDataCsv) {
  // console.log('----', ArrayObjectDataCsv);
  // console.log('????', expectedHeaders);
  const headersInCsv = Object.keys(ArrayObjectDataCsv[0]); // array 2 chieu
  // console.log('====', headersInCsv);
  return headersInCsv.every(h => expectedHeaders.includes(h));
}
