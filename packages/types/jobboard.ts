export interface GoogleSearchResult {
  kind: string;
  url: any;
  queries: any;
  context: any;
  searchInformation: any;
  items: Array<{
    link: string;
    snippet: string;
    title: string;
    pagemap: any;
  }>;
}

export interface JobBoard {
  id: number;
  provider: string;
  name: string;
  snippet?: string;
  title?: string;
  ogUrl?: string;
}

export interface SearchParameters {
  before: string;
  after: string;
  totalResults: number;
  resultsPerPage: number;
  startIndex: number;
}
