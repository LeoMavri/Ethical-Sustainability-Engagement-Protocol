export interface SearchResults {
  'search-results': SearchResultsResponse;
}

interface SearchResultsResponse {
  'opensearch:totalResults': string;
  'opensearch:startIndex': string;
  'opensearch:itemsPerPage': string;
  'opensearch:Query': OpensearchQuery;
  link: Link[];
  entry: Entry[];
}

interface OpensearchQuery {
  '@role': string;
  '@searchTerms': string;
  '@startPage': string;
}

interface Link {
  '@_fa': string;
  '@ref': string;
  '@href': string;
  '@type': string;
}

interface Entry {
  '@_fa': string;
  'load-date': string;
  link: Link2[];
  'dc:identifier': string;
  'prism:url': string;
  'dc:title': string;
  'dc:creator': string;
  'prism:publicationName': string;
  'prism:volume': string;
  'prism:coverDate': string;
  'prism:startingPage': string;
  'prism:doi': string;
  openaccess: boolean;
  pii: string;
  authors: Authors;
}

interface Link2 {
  '@_fa': string;
  '@ref': string;
  '@href': string;
}

interface Authors {
  author: Author[];
}

interface Author {
  $: string;
}
