enum Type {
    CLASSIC = "Classic",
    SERVER_SIDE = "Server-side",
    MVT = "MVT"
  }
  
  enum Status {
    DRAFT = "DRAFT",
    ONLINE = "ONLINE",
    PAUSED = "PAUSED",
    STOPPED = "STOPPED",
  }
  
 export interface Site {
    id: number;
    url: string;
  }
  
  export interface Test {
    id: number;
    name: string;
    type: Type;
    status: Status;
    siteId: number;
  }

  export interface ITableItem {
    id: number;
    siteId: number;
    name: string;
    type: Type ;
    status: Status;
    site: Site;
  }