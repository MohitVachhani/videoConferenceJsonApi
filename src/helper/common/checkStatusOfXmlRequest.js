export function checkStatusOfXmlRequest(jsonResult) {
  console.log('Checking Whether Error Occured while creating training session');
  const status =
    jsonResult['serv:message']['serv:header'][0]['serv:response'][0][
      'serv:result'
    ][0];
  console.log('Status:', status);
  if (status.toString() === 'FAILURE') {
    const reason =
      jsonResult['serv:message']['serv:header'][0]['serv:response'][0][
        'serv:reason'
      ][0];
    throw new Error('Error occured while creating training:  ' + reason);
  }
}
