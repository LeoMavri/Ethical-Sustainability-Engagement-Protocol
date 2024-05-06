export interface FullTextRetrieval {
  'full-text-retrieval-response': FullTextRetrievalResponse;
}

interface FullTextRetrievalResponse {
  coredata: Coredata;
  objects: Objects;
  'scopus-id': string;
  'scopus-eid': string;
  'pubmed-id': string;
  link: Link2;
  originalText: string;
}

interface Coredata {
  'prism:url': string;
  'dc:identifier': string;
  'prism:doi': string;
  pii: string;
  'dc:title': string;
  'prism:publicationName': string;
  'prism:aggregationType': string;
  'prism:issn': string;
  'prism:volume': string;
  'prism:issueIdentifier': string;
  'prism:startingPage': string;
  'prism:endingPage': string;
  'prism:coverDate': string;
  'prism:coverDisplayDate': string;
  'prism:copyright': string;
  'dc:creator': string;
  authors: string;
  'dc:description': string;
  openaccess: string;
  openaccessFlag: boolean;
  openaccessType: string;
  link: Link[];
}

interface Link {
  '@href': string;
  '@rel': string;
  '@_fa': string;
}

interface Objects {
  object: Object[];
}

interface Object {
  '@_fa': string;
  '@ref': string;
  '@category': string;
  '@type': string;
  '@multimediatype': string;
  '@mimetype': string;
  '@width': string;
  '@height': string;
  '@size': string;
  $: string;
}

interface Link2 {
  '@href': string;
  '@rel': string;
}
