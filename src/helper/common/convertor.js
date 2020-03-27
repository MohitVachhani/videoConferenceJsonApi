import jsonToXML from 'jsontoxml';
import convert from 'xml-js';
import xmltoJson from 'xml2js';

export function convertJsonToXml(jsonObject) {
  const xml = jsonToXML(jsonObject);
  return xml;
}

export function convertXmlToJson(xml) {
  const jsonObject = convert.xml2json(xml);
  return jsonObject;
}

export function convertXmlToJsonPromisfied(xml) {
  return new Promise((resolve) => {
    xmltoJson.parseString(xml, (error, result) => {
      resolve(result);
    });
  });
}
